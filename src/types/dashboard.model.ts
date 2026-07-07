import type { Goal } from "@/types/goal.model";
import type { RunningEvent } from "@/types/runs.model";

/** Whether the runner is behind, on, or ahead of the ideal pace. */
export type ScheduleState = "behind" | "on_track" | "ahead";

export interface ScheduleStatus {
  state: ScheduleState;
  /** Signed distance vs. the ideal cumulative target: + ahead, - behind (km). */
  deltaKm: number;
  /** Signed schedule offset expressed in days at the baseline pace. */
  deltaDays: number;
}

/** One day in the ideal-vs-actual pace chart (cumulative km from goal start). */
export interface PacePoint {
  /** Unix ms timestamp for 00:00 of the day. */
  date: number;
  /** Cumulative ideal distance by end of this day (km). */
  ideal: number;
  /**
   * Cumulative actual distance by end of this day (km), or `null` for days that
   * lie in the future (nothing run yet — keeps the actual line from flat-lining).
   */
  actual: number | null;
}

/** One ISO-week cell in the yearly running-weeks heatmap. */
export interface WeekCell {
  /** Unix ms timestamp for 00:00 of the week's Monday. */
  weekStart: number;
  /** ISO week number (1-53). */
  weekNumber: number;
  /** Total distance run in the week (km). */
  distance: number;
  /** Number of runs logged in the week. */
  runCount: number;
  /** Discrete intensity bucket for coloring, keyed to runCount: 0 (none) … 5 (5+ runs). */
  level: 0 | 1 | 2 | 3 | 4 | 5;
  /** Whether the week overlaps the active goal's date range. */
  inGoalPeriod: boolean;
}

/** Everything the dashboard renders, derived from the goal and runs. */
export interface DashboardMetrics {
  /** Whether an active goal exists that these metrics describe. */
  hasActiveGoal: boolean;
  /** True once the goal's end date has passed. */
  isFinished: boolean;

  goalDistance: number;
  totalDays: number;
  daysElapsed: number;
  daysLeft: number;

  distanceRun: number;
  distanceOpen: number;

  /** Distinct calendar days with at least one run in the period. */
  daysWithRuns: number;
  /** Elapsed days without any run. */
  daysWithoutRuns: number;

  indoorCount: number;
  outdoorCount: number;
  indoorDistance: number;
  outdoorDistance: number;

  /** goalDistance / totalDays — the pace planned on day one (km/day). */
  baselinePerDay: number;
  /** distanceOpen / remaining days incl. today — pace needed now (km/day). */
  requiredPerRemainingDay: number;

  schedule: ScheduleStatus;
}

export interface DashboardInput {
  goal: Goal;
  isActive: boolean;
  runs: RunningEvent[];
  /** Injectable clock for testing; defaults to Date.now(). */
  now?: number;
}
