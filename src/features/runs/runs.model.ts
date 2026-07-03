export type RunWhere = "indoor" | "outdoor";

export interface RunningEvent {
  id: string;
  /** Unix timestamp (ms) */
  date: number;
  where: RunWhere;
  /** Distance in km */
  distance: number;
}
