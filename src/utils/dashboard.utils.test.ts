import { describe, expect, it } from "vitest";
import { PACE_WINDOW_DAYS } from "@/config/constants.const";
import type { DashboardInput } from "@/types/dashboard.model";
import type { Goal } from "@/types/goal.model";
import type { RunningEvent, RunWhere } from "@/types/runs.model";
import { buildPaceSeries, buildYearlyWeeks, computeMetrics } from "@/utils/dashboard.utils";
import { toGoalEnd, toGoalStart } from "@/utils/goal.utils";

// A 30-day goal: 1 Jun–30 Jun 2026, 30 km target → baseline 1 km/day.
const goal: Goal = {
  id: "g1",
  start: toGoalStart(new Date(2026, 5, 1)),
  end: toGoalEnd(new Date(2026, 5, 30)),
  distance: 30,
  state: "_in_progress",
};

// Mid-goal: day 10 of 30 → ideal cumulative target is 10 km.
const now = new Date(2026, 5, 10, 12, 0, 0).getTime();

let runId = 0;
function run(day: number, distance: number, where: RunWhere = "outdoor"): RunningEvent {
  runId += 1;
  return { id: `r${runId}`, date: new Date(2026, 5, day, 9, 0, 0).getTime(), distance, where };
}

function input(runs: RunningEvent[], overrides: Partial<DashboardInput> = {}): DashboardInput {
  return { goal, isActive: true, runs, now, ...overrides };
}

describe("computeMetrics", () => {
  it("derives day counts and the baseline pace for a mid-goal snapshot", () => {
    const m = computeMetrics(input([run(3, 4, "indoor"), run(5, 6)]));

    expect(m.totalDays).toBe(30);
    expect(m.daysElapsed).toBe(10);
    expect(m.daysLeft).toBe(21);
    expect(m.baselinePerDay).toBe(1);
    expect(m.distanceRun).toBe(10);
    expect(m.distanceOpen).toBe(20);
    expect(m.hasActiveGoal).toBe(true);
    expect(m.isFinished).toBe(false);
  });

  it("counts distinct running days, rest days, and indoor/outdoor splits", () => {
    // Two runs on the same day → one running day.
    const m = computeMetrics(input([run(3, 2, "indoor"), run(3, 3, "outdoor"), run(7, 5)]));

    expect(m.daysWithRuns).toBe(2);
    expect(m.daysWithoutRuns).toBe(8);
    expect(m.indoorCount).toBe(1);
    expect(m.outdoorCount).toBe(2);
    expect(m.indoorDistance).toBe(2);
    expect(m.outdoorDistance).toBe(8);
  });

  it("reports on_track when actual matches the ideal cumulative target", () => {
    const m = computeMetrics(input([run(5, 10)]));

    expect(m.schedule.state).toBe("on_track");
    expect(m.schedule.deltaKm).toBe(0);
    expect(m.schedule.deltaDays).toBe(0);
  });

  it("reports behind schedule with a signed km and day deficit", () => {
    const m = computeMetrics(input([run(5, 5)])); // ideal 10, actual 5

    expect(m.schedule.state).toBe("behind");
    expect(m.schedule.deltaKm).toBe(-5);
    expect(m.schedule.deltaDays).toBe(-5);
  });

  it("reports ahead of schedule with a positive surplus", () => {
    const m = computeMetrics(input([run(5, 15)])); // ideal 10, actual 15

    expect(m.schedule.state).toBe("ahead");
    expect(m.schedule.deltaKm).toBe(5);
    expect(m.schedule.deltaDays).toBe(5);
  });

  it("clamps open distance and required pace to zero once the goal is met", () => {
    const m = computeMetrics(input([run(5, 35)]));

    expect(m.distanceOpen).toBe(0);
    expect(m.requiredPerRemainingDay).toBe(0);
  });

  it("excludes runs logged outside the goal period", () => {
    const outside: RunningEvent = {
      id: "x",
      date: new Date(2026, 4, 20).getTime(), // May, before the goal
      distance: 99,
      where: "outdoor",
    };
    const m = computeMetrics(input([outside, run(5, 4)]));

    expect(m.distanceRun).toBe(4);
  });

  it("marks the goal finished and fully elapsed once the end date has passed", () => {
    const m = computeMetrics(input([run(5, 12)], { now: new Date(2026, 6, 5).getTime() }));

    expect(m.isFinished).toBe(true);
    expect(m.daysElapsed).toBe(30);
    expect(m.daysLeft).toBe(0);
  });

  it("still counts 1 day left while the last day of the goal period is in progress", () => {
    const m = computeMetrics(input([], { now: new Date(2026, 5, 30, 9, 0, 0).getTime() }));

    expect(m.isFinished).toBe(false);
    expect(m.daysElapsed).toBe(30);
    expect(m.daysLeft).toBe(1);
  });
});

describe("buildPaceSeries", () => {
  it("returns one cumulative point per day in the trailing window", () => {
    const series = buildPaceSeries(input([run(5, 10)]));

    expect(series).toHaveLength(PACE_WINDOW_DAYS);
    // Last point is today (day 10): ideal and actual cumulative both 10.
    expect(series.at(-1)?.ideal).toBe(10);
    expect(series.at(-1)?.actual).toBe(10);
  });

  it("keeps the ideal line at zero for days before the goal starts", () => {
    const series = buildPaceSeries(input([]));
    // Window starts 29 days before day 10 → mid-May, before the 1 Jun start.
    expect(series[0]?.ideal).toBe(0);
  });

  it("plateaus the ideal line at the goal distance after the period ends", () => {
    const series = buildPaceSeries(input([run(5, 12)], { now: new Date(2026, 6, 5).getTime() }));
    const last = series.at(-1);

    expect(last?.ideal).toBe(30); // capped at goal distance
    expect(last?.actual).toBe(12);
  });
});

describe("buildYearlyWeeks", () => {
  it("covers the whole calendar year as Monday-started weeks", () => {
    const weeks = buildYearlyWeeks([], 2026);

    expect(weeks.length).toBeGreaterThanOrEqual(52);
    expect(weeks[0]?.weekNumber).toBe(1);
    // Every cell starts on a Monday.
    for (const cell of weeks) {
      expect(new Date(cell.weekStart).getDay()).toBe(1);
    }
  });

  it("aggregates run distance and count into the week that contains it", () => {
    const runs = [run(10, 5), run(11, 3)]; // same week (Mon 8 Jun–Sun 14 Jun)
    const weekOf = runs[0]?.date ?? 0;
    const weeks = buildYearlyWeeks(runs, 2026);

    const target = weeks.find(
      (c) => c.weekStart <= weekOf && weekOf < c.weekStart + 7 * 86_400_000,
    );
    expect(target?.distance).toBe(8);
    expect(target?.runCount).toBe(2);
  });

  it("buckets a week's level by its run count, capped at 5", () => {
    // All within the same Mon 8 Jun–Sun 14 Jun week → 6 runs total.
    const weeks = buildYearlyWeeks(
      [run(8, 8), run(9, 1), run(10, 1), run(11, 1), run(12, 1), run(13, 1)],
      2026,
    );

    const busy = weeks.find((c) => c.runCount === 6);
    expect(busy?.level).toBe(5);

    const january: RunningEvent = {
      id: "jan",
      date: new Date(2026, 0, 15).getTime(),
      distance: 2,
      where: "outdoor",
    };
    const withOneRun = buildYearlyWeeks([january], 2026).find((c) => c.runCount === 1);
    expect(withOneRun?.level).toBe(1);

    // Weeks with no runs stay at level 0.
    expect(weeks.some((c) => c.runCount === 0 && c.level === 0)).toBe(true);
  });

  it("marks every week in-period when no goal period is given", () => {
    const weeks = buildYearlyWeeks([], 2026);
    expect(weeks.every((c) => c.inGoalPeriod)).toBe(true);
  });

  it("flags weeks outside the given goal period as not in-period", () => {
    const weeks = buildYearlyWeeks([], 2026, { start: goal.start, end: goal.end });

    const inPeriod = weeks.find(
      (c) => c.weekStart <= goal.start && goal.start < c.weekStart + 7 * 86_400_000,
    );
    const beforePeriod = weeks.find((c) => c.weekStart + 7 * 86_400_000 <= goal.start);
    const afterPeriod = weeks.find((c) => c.weekStart > goal.end);

    expect(inPeriod?.inGoalPeriod).toBe(true);
    expect(beforePeriod?.inGoalPeriod).toBe(false);
    expect(afterPeriod?.inGoalPeriod).toBe(false);
  });
});
