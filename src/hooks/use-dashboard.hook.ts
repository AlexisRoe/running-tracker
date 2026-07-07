import { useMemo } from "react";
import { useGoal } from "@/hooks/use-goal.hook";
import { useRuns } from "@/hooks/use-runs.hook";
import type { DashboardInput, DashboardMetrics, PacePoint } from "@/types/dashboard.model";
import { buildPaceSeries, computeMetrics } from "@/utils/dashboard.utils";

interface UseDashboard {
  /** Whether a goal has been set at all (blank goal → show the CTA instead). */
  isGoalSet: boolean;
  /** Null until a goal is set. */
  metrics: DashboardMetrics | null;
  /** Ideal-vs-actual pace series; empty until a goal is set. */
  paceSeries: PacePoint[];
}

/** Derives the dashboard's metrics and pace series from the current goal and runs. */
export function useDashboard(): UseDashboard {
  const goal = useGoal();
  const runs = useRuns();

  return useMemo(() => {
    if (!goal.isSet) {
      return { isGoalSet: false, metrics: null, paceSeries: [] };
    }

    const input: DashboardInput = {
      goal: goal.value,
      isActive: goal.isActive,
      runs: runs.value,
    };

    return {
      isGoalSet: true,
      metrics: computeMetrics(input),
      paceSeries: buildPaceSeries(input),
    };
  }, [goal.isSet, goal.isActive, goal.value, runs.value]);
}
