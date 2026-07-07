import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Goal } from "@/types/goal.model";

/** The blank goal used before any goal is set and after a reset. */
const defaultGoal: Goal = {
  id: "",
  start: 0,
  end: 0,
  distance: 0,
  state: "_blank",
};

/** Mutations for the goal store. */
type GoalActions = {
  /** Replaces the goal with a new one, assigning a generated id and in-progress state. */
  setGoal(input: Omit<Goal, "id" | "state">): void;
  /** Applies a partial update to the current goal's editable fields. */
  updateGoal(input: Partial<Omit<Goal, "id" | "state">>): void;
  /** Clears the goal back to the blank default. */
  resetGoal(): void;
};

/** Persisted store of the single running goal (localStorage-backed). */
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
