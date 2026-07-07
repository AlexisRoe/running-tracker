export type GoalState = "_blank" | "_in_progress";

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
