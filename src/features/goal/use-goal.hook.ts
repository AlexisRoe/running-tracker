import type { Goal } from "./goal.model";
import { useGoalStore } from "./goal.store";

interface UseGoal {
  value: Goal;
  create(input: Omit<Goal, "id" | "state">): void;
  update(input: Partial<Omit<Goal, "id" | "state">>): void;
  reset(): void;
}

export function useGoal(): UseGoal {
  const { goal, setGoal, updateGoal, resetGoal } = useGoalStore();

  return {
    value: goal,
    create: setGoal,
    update: updateGoal,
    reset: resetGoal,
  };
}
