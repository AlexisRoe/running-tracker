import type { RunningEvent, RunWhere } from "./runs.model";

export const isRunWhere = (i: unknown): i is RunWhere => i === "indoor" || i === "outdoor";

export interface RunGroup {
  /** Unix ms timestamp for the 1st of the local calendar month this group represents */
  monthStart: number;
  /** Runs in this month, sorted newest-first by date */
  runs: RunningEvent[];
}

export function groupRunsByMonth(events: RunningEvent[]): RunGroup[] {
  const groups = new Map<string, RunGroup>();

  for (const event of events) {
    const d = new Date(event.date);
    const key = `${d.getFullYear()}-${d.getMonth()}`;

    let group = groups.get(key);
    if (!group) {
      group = { monthStart: new Date(d.getFullYear(), d.getMonth(), 1).getTime(), runs: [] };
      groups.set(key, group);
    }
    group.runs.push(event);
  }

  const result = [...groups.values()];
  result.sort((a, b) => b.monthStart - a.monthStart);
  for (const group of result) {
    group.runs.sort((a, b) => b.date - a.date);
  }
  return result;
}
