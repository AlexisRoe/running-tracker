import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { useYearlyWeeks } from "@/hooks/use-yearly-weeks.hook";
import { useGoalStore } from "@/stores/goal.store";
import { useRunsStore } from "@/stores/runs.store";
import { toGoalEnd, toGoalStart } from "@/utils/goal.utils";

const DAY = 24 * 60 * 60 * 1000;

beforeEach(() => {
  useGoalStore.getState().resetGoal();
  useRunsStore.setState({ events: [] });
});

describe("useYearlyWeeks", () => {
  it("defaults to the current year and covers the whole calendar year", () => {
    const { result } = renderHook(() => useYearlyWeeks());

    expect(result.current.year).toBe(new Date().getFullYear());
    expect(result.current.weeks.length).toBeGreaterThanOrEqual(52);
  });

  it("disallows navigation when runs only exist in the current year", () => {
    useRunsStore.getState().addRun({ date: Date.now(), distance: 5, where: "outdoor" });

    const { result } = renderHook(() => useYearlyWeeks());

    expect(result.current.canGoPrev).toBe(false);
    expect(result.current.canGoNext).toBe(false);
  });

  it("allows switching to a year with runs and updates the displayed weeks", () => {
    const lastYear = new Date().getFullYear() - 1;
    useRunsStore
      .getState()
      .addRun({ date: new Date(lastYear, 5, 1).getTime(), distance: 5, where: "outdoor" });

    const { result } = renderHook(() => useYearlyWeeks());

    expect(result.current.canGoPrev).toBe(true);
    expect(result.current.canGoNext).toBe(false);

    act(() => result.current.goPrev());

    expect(result.current.year).toBe(lastYear);
    expect(result.current.canGoPrev).toBe(false);
    expect(result.current.canGoNext).toBe(true);
  });

  it("flags weeks outside the active goal period as not in-period", () => {
    const now = Date.now();
    useGoalStore.getState().setGoal({
      start: toGoalStart(now - 10 * DAY),
      end: toGoalEnd(now + 10 * DAY),
      distance: 30,
    });

    const { result } = renderHook(() => useYearlyWeeks());

    expect(result.current.weeks.some((w) => !w.inGoalPeriod)).toBe(true);
    expect(result.current.weeks.some((w) => w.inGoalPeriod)).toBe(true);
  });
});
