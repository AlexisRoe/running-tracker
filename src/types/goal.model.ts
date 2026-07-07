/** Lifecycle of the goal: unset (`_blank`) or actively being tracked (`_in_progress`). */
export type GoalState = "_blank" | "_in_progress";

/** A running goal: a target distance to cover within a date range. */
export interface Goal {
  /** Internal id, for later (logging, multiple goal) */
  id: string;
  /** Start date in unix timestamp (ms) */
  start: number;
  /** End date in unix timestamp (ms) */
  end: number;
  /** Target distance in km */
  distance: number;
  /** Current state of the goal */
  state: GoalState;
}
