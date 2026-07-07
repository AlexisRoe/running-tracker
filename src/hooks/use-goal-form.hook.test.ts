import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyInfo, notifySuccess } from "@/components/ui/notify";
import { useGoalForm } from "@/hooks/use-goal-form.hook";
import { useGoalStore } from "@/stores/goal.store";
import { addOneYearMinusOneDay } from "@/utils/goal.utils";

vi.mock("@/components/ui/notify", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyInfo: vi.fn(),
  notifyWarning: vi.fn(),
}));

function setExistingGoal() {
  useGoalStore.getState().setGoal({
    start: new Date(2026, 0, 10).getTime(),
    end: new Date(2026, 0, 12).getTime(),
    distance: 20,
  });
}

afterEach(() => {
  useGoalStore.getState().resetGoal();
  vi.clearAllMocks();
});

describe("useGoalForm", () => {
  it("starts in edit mode with blank fields when no goal is set", () => {
    const { result } = renderHook(() => useGoalForm());

    expect(result.current.mode).toBe("edit");
    expect(result.current.isSet).toBe(false);
    expect(result.current.fields).toEqual({ start: null, end: null, distance: "" });
  });

  it("starts in view mode with the stored goal summary when a goal is set", () => {
    setExistingGoal();
    const { result } = renderHook(() => useGoalForm());

    expect(result.current.mode).toBe("view");
    expect(result.current.isSet).toBe(true);
    expect(result.current.summary.distance).toBe(20);
  });

  it("disables save until start, end, and distance are all filled and changed", () => {
    const { result } = renderHook(() => useGoalForm());

    expect(result.current.saveDisabled).toBe(true);

    act(() => result.current.changeStart(new Date(2026, 0, 10).toISOString()));
    act(() => result.current.changeDistance(20));

    expect(result.current.saveDisabled).toBe(false);
    expect(result.current.isDirty).toBe(true);
  });

  it("auto-fills the end date one year minus a day when start changes, unless end was touched", () => {
    const { result } = renderHook(() => useGoalForm());
    const start = new Date(2026, 0, 10);

    act(() => result.current.changeStart(start.toISOString()));
    expect(result.current.fields.end?.getTime()).toBe(addOneYearMinusOneDay(start).getTime());

    act(() => result.current.changeEnd(new Date(2026, 2, 1).toISOString()));
    act(() => result.current.changeStart(new Date(2026, 1, 1).toISOString()));
    expect(result.current.fields.end?.getTime()).toBe(new Date(2026, 2, 1).getTime());
  });

  it("flags a date error when end is on or before start", () => {
    const { result } = renderHook(() => useGoalForm());

    act(() => result.current.changeStart(new Date(2026, 0, 10).toISOString()));
    act(() => result.current.changeEnd(new Date(2026, 0, 10).toISOString()));

    expect(result.current.dateError).not.toBeNull();
    expect(result.current.saveDisabled).toBe(true);
  });

  it("save persists the goal, notifies with the computed pace, and switches to view mode", () => {
    const { result } = renderHook(() => useGoalForm());

    act(() => result.current.changeStart(new Date(2026, 0, 10).toISOString()));
    act(() => result.current.changeEnd(new Date(2026, 0, 12).toISOString()));
    act(() => result.current.changeDistance(30));
    act(() => result.current.save());

    expect(useGoalStore.getState().goal.distance).toBe(30);
    expect(result.current.mode).toBe("view");

    const call = vi.mocked(notifySuccess).mock.calls[0]?.[0];
    expect(call?.message).toContain("3 days");
    expect(call?.message).toContain("averaging 10 km/day");
  });

  it("clear resets the goal, notifies, and returns to a blank edit form", () => {
    setExistingGoal();
    const { result } = renderHook(() => useGoalForm());

    act(() => result.current.startEdit());
    act(() => result.current.clear());

    expect(useGoalStore.getState().goal.state).toBe("_blank");
    expect(result.current.mode).toBe("edit");
    expect(result.current.fields).toEqual({ start: null, end: null, distance: "" });
    expect(notifyInfo).toHaveBeenCalledTimes(1);
  });
});
