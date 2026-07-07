import type {
  DashboardInput,
  DashboardMetrics,
  PacePoint,
  ScheduleState,
  WeekCell,
} from "@/types/dashboard.model";
import type { RunningEvent } from "@/types/runs.model";
import { countInclusiveDays } from "@/utils/goal.utils";

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

/** Buckets a weekly run count into a 0-5 heatmap intensity level (5 = 5 or more runs). */
function bucketLevel(runCount: number): WeekCell["level"] {
  return Math.min(runCount, 5) as WeekCell["level"];
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
  // Today still counts as a day left until the goal period is actually over.
  const daysLeft = isFinished ? 0 : Math.max(0, totalDays - daysElapsed) + 1;
  const daysLeftInclToday = Math.max(1, daysLeft);

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
 * Aggregates runs into ISO-Monday weeks across the given calendar `year`,
 * bucketing each week's run count into a 0-5 intensity level for the heatmap.
 * `goalPeriod` (if given) flags weeks outside its range as not `inGoalPeriod`;
 * omitting it treats every week as in-period.
 */
export function buildYearlyWeeks(
  runs: RunningEvent[],
  year: number,
  goalPeriod?: { start: number; end: number } | null,
): WeekCell[] {
  const firstMonday = startOfWeekMonday(new Date(year, 0, 1).getTime());
  const dec31 = new Date(year, 11, 31, 23, 59, 59, 999).getTime();

  const cells: WeekCell[] = [];
  let weekStart = firstMonday;
  let weekNumber = 1;

  while (weekStart <= dec31) {
    const weekEnd = weekStart + 7 * MS_PER_DAY;
    const weekRuns = runs.filter((r) => r.date >= weekStart && r.date < weekEnd);
    const distance = weekRuns.reduce((sum, r) => sum + r.distance, 0);
    const runCount = weekRuns.length;
    const inGoalPeriod = !goalPeriod || (weekStart < goalPeriod.end && weekEnd > goalPeriod.start);

    cells.push({
      weekStart,
      weekNumber,
      distance: round2(distance),
      runCount,
      level: bucketLevel(runCount),
      inGoalPeriod,
    });
    weekStart = weekEnd;
    weekNumber += 1;
  }

  return cells;
}

/** Distinct years present in `runs`, ascending, always including `currentYear`. */
export function getAvailableYears(runs: RunningEvent[], currentYear: number): number[] {
  const years = new Set(runs.map((r) => new Date(r.date).getFullYear()));
  years.add(currentYear);
  return [...years].sort((a, b) => a - b);
}
