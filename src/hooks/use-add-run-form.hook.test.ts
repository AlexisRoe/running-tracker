import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireConfetti } from "@/components/ui/confetti";
import { notifyError, notifySuccess, notifyWarning } from "@/components/ui/notify";
import { useAddRunForm } from "@/hooks/use-add-run-form.hook";
import { useGoalStore } from "@/stores/goal.store";
import { useRunsStore } from "@/stores/runs.store";
import { toGoalEnd, toGoalStart } from "@/utils/goal.utils";

vi.mock("@/components/ui/notify", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyWarning: vi.fn(),
}));

vi.mock("@/components/ui/confetti", () => ({
  fireConfetti: vi.fn(),
}));

function setActiveGoal(distance: number) {
  const now = Date.now();
  useGoalStore.getState().setGoal({ start: toGoalStart(now), end: toGoalEnd(now), distance });
}

afterEach(() => {
  useRunsStore.setState({ events: [] });
  useGoalStore.getState().resetGoal();
  vi.clearAllMocks();
});

describe("useAddRunForm", () => {
  it("defaults to an empty indoor run for today", () => {
    setActiveGoal(10);
    const { result } = renderHook(() => useAddRunForm({ onClose: vi.fn() }));

    expect(result.current.distance).toBe("");
    expect(result.current.where).toBe("indoor");
    expect(result.current.isValidRange).toBe(true);
  });

  it("isValidRange is false when no goal is set", () => {
    const { result } = renderHook(() => useAddRunForm({ onClose: vi.fn() }));

    expect(result.current.isValidRange).toBe(false);
  });

  it("isValidRange is false when today is before the goal period", () => {
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    useGoalStore.getState().setGoal({
      start: toGoalStart(tomorrow),
      end: toGoalEnd(tomorrow),
      distance: 10,
    });
    const { result } = renderHook(() => useAddRunForm({ onClose: vi.fn() }));

    expect(result.current.isValidRange).toBe(false);
  });

  it("save records the run and closes", () => {
    setActiveGoal(10);
    const onClose = vi.fn();
    const { result } = renderHook(() => useAddRunForm({ onClose }));

    act(() => result.current.setDistance(5));
    act(() => result.current.setWhere("outdoor"));
    act(() => result.current.save());

    expect(useRunsStore.getState().events[0]).toMatchObject({ distance: 5, where: "outdoor" });
    expect(onClose).toHaveBeenCalled();
  });

  it("save with an invalid distance notifies an error and stays open", () => {
    setActiveGoal(10);
    const onClose = vi.fn();
    const { result } = renderHook(() => useAddRunForm({ onClose }));

    act(() => result.current.setDistance(0));
    act(() => result.current.save());

    expect(useRunsStore.getState().events).toHaveLength(0);
    expect(notifyError).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("fires confetti and a success notification when the run meets the daily goal", () => {
    setActiveGoal(10);
    const { result } = renderHook(() => useAddRunForm({ onClose: vi.fn() }));

    act(() => result.current.setDistance(10));
    act(() => result.current.save());

    expect(fireConfetti).toHaveBeenCalled();
    expect(notifySuccess).toHaveBeenCalledWith({
      title: "Well done! 🎉",
      message: "10 km run · 10 km/day goal",
    });
  });

  it("warns without confetti when the run misses the daily goal", () => {
    setActiveGoal(10);
    const { result } = renderHook(() => useAddRunForm({ onClose: vi.fn() }));

    act(() => result.current.setDistance(5));
    act(() => result.current.save());

    expect(fireConfetti).not.toHaveBeenCalled();
    expect(notifyWarning).toHaveBeenCalledWith({
      title: "Better next time",
      message: "5 km run · 10 km/day goal",
    });
  });

  it("close resets the fields", () => {
    setActiveGoal(10);
    const onClose = vi.fn();
    const { result } = renderHook(() => useAddRunForm({ onClose }));

    act(() => result.current.setDistance(7));
    act(() => result.current.close());

    expect(result.current.distance).toBe("");
    expect(onClose).toHaveBeenCalled();
  });
});
