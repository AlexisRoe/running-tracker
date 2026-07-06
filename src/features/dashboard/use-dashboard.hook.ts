import { useGoal } from "@features/goal/use-goal.hook";
import { useRuns } from "@features/runs/use-runs.hook";
import { useMemo } from "react";
import type { DashboardInput, DashboardMetrics, PacePoint } from "./dashboard.model";
import { buildPaceSeries, computeMetrics } from "./dashboard.utils";

interface UseDashboard {
  /** Whether a goal has been set at all (blank goal → show the CTA instead). */
  isGoalSet: boolean;
  /** Null until a goal is set. */
  metrics: DashboardMetrics | null;
  /** Ideal-vs-actual pace series; empty until a goal is set. */
  paceSeries: PacePoint[];
}

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
