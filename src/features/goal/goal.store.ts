import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Goal } from "./goal.model";

const defaultGoal: Goal = {
  id: "",
  start: 0,
  end: 0,
  distance: 0,
  state: "_blank",
};

type GoalActions = {
  setGoal(input: Omit<Goal, "id" | "state">): void;
  updateGoal(input: Partial<Omit<Goal, "id" | "state">>): void;
  resetGoal(): void;
};

export const useGoalStore = create<{ goal: Goal } & GoalActions>()(
  persist(
    (set) => ({
      goal: defaultGoal,
      setGoal: (input) =>
        set({ goal: { ...input, id: crypto.randomUUID(), state: "_in_progress" } }),
      updateGoal: (input) => set((s) => ({ goal: { ...s.goal, ...input } })),
      resetGoal: () => set({ goal: defaultGoal }),
    }),
    { name: "runner-tracking-goal-store" },
  ),
);
