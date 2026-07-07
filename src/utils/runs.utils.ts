import type { RunningEvent, RunWhere } from "@/types/runs.model";

export const isRunWhere = (i: unknown): i is RunWhere => i === "indoor" || i === "outdoor";

export interface MonthGroup {
  /** Unix ms timestamp for the 1st of the local calendar month this group represents */
  monthStart: number;
  /** Sum of run.distance for all runs in this month */
  totalDistance: number;
  /** Runs in this month, sorted newest-first by date */
  runs: RunningEvent[];
}

export interface YearGroup {
  year: number;
  /** Months in this year, sorted newest-first */
  months: MonthGroup[];
}

export function groupRunsByYearAndMonth(events: RunningEvent[]): YearGroup[] {
  const years = new Map<number, Map<string, MonthGroup>>();

  for (const event of events) {
    const d = new Date(event.date);
    const year = d.getFullYear();
    const key = `${year}-${d.getMonth()}`;

    let months = years.get(year);
    if (!months) {
      months = new Map();
      years.set(year, months);
    }

    let group = months.get(key);
    if (!group) {
      group = {
        monthStart: new Date(year, d.getMonth(), 1).getTime(),
        totalDistance: 0,
        runs: [],
      };
      months.set(key, group);
    }
    group.runs.push(event);
    group.totalDistance += event.distance;
  }

  const result: YearGroup[] = [...years.entries()].map(([year, months]) => ({
    year,
    months: [...months.values()].sort((a, b) => b.monthStart - a.monthStart),
  }));

  result.sort((a, b) => b.year - a.year);
  for (const yearGroup of result) {
    for (const group of yearGroup.months) {
      group.runs.sort((a, b) => b.date - a.date);
    }
  }
  return result;
}
