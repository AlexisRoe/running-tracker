import { countInclusiveDays } from "@features/goal/goal.utils";
import type { RunningEvent } from "@features/runs/runs.model";
import type {
  DashboardInput,
  DashboardMetrics,
  PacePoint,
  ScheduleState,
  WeekCell,
} from "./dashboard.model";

const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Runs within ±this many km of the ideal target still count as "on track". */
const SCHEDULE_EPSILON_KM = 0.05;

/** Days rendered in the pace chart, ending today. */
export const PACE_WINDOW_DAYS = 30;

/** Rounds to 2 decimal places. */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** 00:00:00.000 local time of the given instant. */
function startOfDay(input: number): number {
  const d = new Date(input);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

/** 00:00 local time of the Monday of the given instant's week. */
function startOfWeekMonday(input: number): number {
  const d = new Date(input);
  d.setHours(0, 0, 0, 0);
  const offsetToMonday = (d.getDay() + 6) % 7; // getDay(): 0=Sun … 6=Sat
  d.setDate(d.getDate() - offsetToMonday);
  return d.getTime();
}

/** Buckets a weekly distance into a 0-4 heatmap intensity level. */
function bucketLevel(distance: number, max: number): WeekCell["level"] {
  if (distance <= 0 || max <= 0) return 0;
  const ratio = distance / max;
  if (ratio <= 0.25) return 1;
  if (ratio <= 0.5) return 2;
  if (ratio <= 0.75) return 3;
  return 4;
}

function scheduleState(deltaKm: number): ScheduleState {
  if (deltaKm < -SCHEDULE_EPSILON_KM) return "behind";
  if (deltaKm > SCHEDULE_EPSILON_KM) return "ahead";
  return "on_track";
}

/**
 * Derives every goal-progress metric from a goal + its runs. Assumes the goal is
 * set (distance > 0, end > start); callers gate on that via the hook.
 */
export function computeMetrics({
  goal,
  isActive,
  runs,
  now = Date.now(),
}: DashboardInput): DashboardMetrics {
  const { start, end, distance: goalDistance } = goal;

  const totalDays = Math.max(1, countInclusiveDays(start, end));
  const isFinished = now > end;

  const clampedNow = Math.min(Math.max(now, start), end);
  const daysElapsed = Math.min(countInclusiveDays(start, clampedNow), totalDays);
  const daysLeft = Math.max(0, totalDays - daysElapsed);
  const daysLeftInclToday = Math.max(1, isFinished ? 0 : daysLeft + 1);

  const runsInPeriod = runs.filter((r) => r.date >= start && r.date <= end);
  const distanceRun = runsInPeriod.reduce((sum, r) => sum + r.distance, 0);
  const distanceOpen = Math.max(0, goalDistance - distanceRun);

  const runDays = new Set(runsInPeriod.map((r) => startOfDay(r.date)));
  const daysWithRuns = runDays.size;
  const daysWithoutRuns = Math.max(0, daysElapsed - daysWithRuns);

  const indoor = runsInPeriod.filter((r) => r.where === "indoor");
  const outdoor = runsInPeriod.filter((r) => r.where === "outdoor");

  const baselinePerDay = goalDistance / totalDays;
  const requiredPerRemainingDay = distanceOpen / daysLeftInclToday;

  const idealCumToDate = baselinePerDay * daysElapsed;
  const deltaKm = distanceRun - idealCumToDate;
  const deltaDays = baselinePerDay > 0 ? deltaKm / baselinePerDay : 0;

  return {
    hasActiveGoal: isActive,
    isFinished,
    goalDistance: round2(goalDistance),
    totalDays,
    daysElapsed,
    daysLeft,
    distanceRun: round2(distanceRun),
    distanceOpen: round2(distanceOpen),
    daysWithRuns,
    daysWithoutRuns,
    indoorCount: indoor.length,
    outdoorCount: outdoor.length,
    indoorDistance: round2(indoor.reduce((sum, r) => sum + r.distance, 0)),
    outdoorDistance: round2(outdoor.reduce((sum, r) => sum + r.distance, 0)),
    baselinePerDay: round2(baselinePerDay),
    requiredPerRemainingDay: round2(requiredPerRemainingDay),
    schedule: {
      state: scheduleState(deltaKm),
      deltaKm: round2(deltaKm),
      deltaDays: round2(deltaDays),
    },
  };
}

/**
 * Builds the ideal-vs-actual cumulative pace series for the trailing
 * `windowDays` days (ending today). Both lines are cumulative from the goal
 * start so they are directly comparable; the ideal line plateaus at the goal
 * distance once the period ends.
 */
export function buildPaceSeries(
  { goal, runs, now = Date.now() }: DashboardInput,
  windowDays: number = PACE_WINDOW_DAYS,
): PacePoint[] {
  const { start, end, distance: goalDistance } = goal;
  const totalDays = Math.max(1, countInclusiveDays(start, end));
  const baselinePerDay = goalDistance / totalDays;

  const todayStart = startOfDay(now);
  const points: PacePoint[] = [];

  for (let i = windowDays - 1; i >= 0; i--) {
    const dayStart = todayStart - i * MS_PER_DAY;
    const dayEnd = dayStart + MS_PER_DAY - 1;

    let ideal = 0;
    if (dayEnd >= start) {
      const elapsed = Math.min(countInclusiveDays(start, Math.min(dayEnd, end)), totalDays);
      ideal = baselinePerDay * elapsed;
    }

    const cutoff = Math.min(dayEnd, end);
    const actual = runs
      .filter((r) => r.date >= start && r.date <= cutoff)
      .reduce((sum, r) => sum + r.distance, 0);

    points.push({ date: dayStart, ideal: round2(ideal), actual: round2(actual) });
  }

  return points;
}

/**
 * Aggregates runs into ISO-Monday weeks across the calendar year of `now`,
 * bucketing each week's total distance into a 0-4 intensity level (relative to
 * the busiest week) for the heatmap.
 */
export function buildYearlyWeeks(runs: RunningEvent[], now: number = Date.now()): WeekCell[] {
  const year = new Date(now).getFullYear();
  const firstMonday = startOfWeekMonday(new Date(year, 0, 1).getTime());
  const dec31 = new Date(year, 11, 31, 23, 59, 59, 999).getTime();

  const cells: WeekCell[] = [];
  let weekStart = firstMonday;
  let weekNumber = 1;

  while (weekStart <= dec31) {
    const weekEnd = weekStart + 7 * MS_PER_DAY;
    const distance = runs
      .filter((r) => r.date >= weekStart && r.date < weekEnd)
      .reduce((sum, r) => sum + r.distance, 0);
    cells.push({ weekStart, weekNumber, distance: round2(distance), level: 0 });
    weekStart = weekEnd;
    weekNumber += 1;
  }

  const max = cells.reduce((m, c) => Math.max(m, c.distance), 0);
  for (const cell of cells) {
    cell.level = bucketLevel(cell.distance, max);
  }

  return cells;
}
