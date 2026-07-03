import { useGoalStore } from "@features/goal/goal.store";
import { toGoalEnd, toGoalStart } from "@features/goal/goal.utils";
import { useRunsStore } from "@features/runs/runs.store";
import { renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { PACE_WINDOW_DAYS } from "./dashboard.utils";
import { useDashboard } from "./use-dashboard.hook";

const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
  useGoalStore.getState().resetGoal();
  useRunsStore.setState({ events: [] });
});

describe("useDashboard", () => {
  it("returns no metrics but still a weekly overview when no goal is set", () => {
    const { result } = renderHook(() => useDashboard());

    expect(result.current.isGoalSet).toBe(false);
    expect(result.current.metrics).toBeNull();
    expect(result.current.paceSeries).toEqual([]);
    expect(result.current.weeks.length).toBeGreaterThanOrEqual(52);
  });

  it("computes metrics and a full pace series once a goal is active", () => {
    const now = Date.now();
    useGoalStore.getState().setGoal({
      start: toGoalStart(now - 10 * DAY),
      end: toGoalEnd(now + 20 * DAY),
      distance: 30,
    });
    useRunsStore.getState().addRun({ date: now - 2 * DAY, distance: 4, where: "outdoor" });
    useRunsStore.getState().addRun({ date: now - 1 * DAY, distance: 6, where: "indoor" });

    const { result } = renderHook(() => useDashboard());

    expect(result.current.isGoalSet).toBe(true);
    expect(result.current.metrics?.goalDistance).toBe(30);
    expect(result.current.metrics?.distanceRun).toBe(10);
    expect(result.current.metrics?.indoorCount).toBe(1);
    expect(result.current.metrics?.outdoorCount).toBe(1);
    expect(result.current.paceSeries).toHaveLength(PACE_WINDOW_DAYS);
  });
});
