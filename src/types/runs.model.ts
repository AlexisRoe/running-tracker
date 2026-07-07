/** Where a run took place. */
export type RunWhere = "indoor" | "outdoor";

/** A single recorded run. */
export interface RunningEvent {
  /** Unique to determine runs which look similar */
  id: string;
  /** Unix timestamp (ms) */
  date: number;
  /** Define where the user runs (location) */
  where: RunWhere;
  /** Distance in km */
  distance: number;
}
