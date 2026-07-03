import { useGoalStore } from "@features/goal/goal.store";
import { describe, expect, it } from "vitest";

describe("useGoalStore", () => {
  it("setGoal creates a new in-progress goal with a generated id", () => {
    useGoalStore.getState().setGoal({ start: 100, end: 200, distance: 42 });
    const { goal } = useGoalStore.getState();

    expect(goal.id).not.toBe("");
    expect(goal.state).toBe("_in_progress");
    expect(goal.start).toBe(100);
    expect(goal.end).toBe(200);
    expect(goal.distance).toBe(42);
  });

  it("updateGoal merges a partial patch onto the existing goal", () => {
    useGoalStore.getState().setGoal({ start: 100, end: 200, distance: 42 });
    const idBefore = useGoalStore.getState().goal.id;

    useGoalStore.getState().updateGoal({ distance: 10 });
    const { goal } = useGoalStore.getState();

    expect(goal.distance).toBe(10);
    expect(goal.start).toBe(100);
    expect(goal.end).toBe(200);
    expect(goal.id).toBe(idBefore);
  });

  it("resetGoal returns to the default blank goal", () => {
    useGoalStore.getState().setGoal({ start: 100, end: 200, distance: 42 });
    useGoalStore.getState().resetGoal();

    expect(useGoalStore.getState().goal).toEqual({
      id: "",
      start: 0,
      end: 0,
      distance: 0,
      state: "_blank",
    });
  });

  it("persists the goal to localStorage", () => {
    useGoalStore.getState().setGoal({ start: 100, end: 200, distance: 42 });

    const raw = localStorage.getItem("runner-tracking-goal-store");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.state.goal.distance).toBe(42);
  });
});
