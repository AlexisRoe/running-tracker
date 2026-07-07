import { useMemo, useState } from "react";
import { useGoal } from "@/hooks/use-goal.hook";
import { useRuns } from "@/hooks/use-runs.hook";
import type { WeekCell } from "@/types/dashboard.model";
import { buildYearlyWeeks, getAvailableYears } from "@/utils/dashboard.utils";

interface UseYearlyWeeks {
  year: number;
  weeks: WeekCell[];
  canGoPrev: boolean;
  canGoNext: boolean;
  goPrev(): void;
  goNext(): void;
}

/** Yearly running-weeks heatmap state, incl. year navigation — available goal or not. */
export function useYearlyWeeks(): UseYearlyWeeks {
  const goal = useGoal();
  const runs = useRuns();
  const [year, setYear] = useState(() => new Date().getFullYear());

  const availableYears = useMemo(
    () => getAvailableYears(runs.value, new Date().getFullYear()),
    [runs.value],
  );

  const weeks = useMemo(
    () =>
      buildYearlyWeeks(
        runs.value,
        year,
        goal.isSet ? { start: goal.value.start, end: goal.value.end } : null,
      ),
    [runs.value, year, goal.isSet, goal.value],
  );

  return {
    year,
    weeks,
    canGoPrev: year > Math.min(...availableYears),
    canGoNext: year < Math.max(...availableYears),
    goPrev: () => setYear((y) => y - 1),
    goNext: () => setYear((y) => y + 1),
  };
}
