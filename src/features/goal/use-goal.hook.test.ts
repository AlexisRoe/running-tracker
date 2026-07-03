import { useGoal } from "@features/goal/use-goal.hook";
import { ValidationError } from "@shared/errors/validation.error";
import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.useRealTimers();
});

describe("useGoal", () => {
  it("defaults to an unset goal", () => {
    const { result } = renderHook(() => useGoal());

    expect(result.current.isSet).toBe(false);
    expect(result.current.isActive).toBe(false);
    expect(result.current.requiredDistancePerDay).toBeNull();
  });

  it("set() with a valid input updates the store", () => {
    const { result } = renderHook(() => useGoal());

    act(() => {
      result.current.set({
        start: new Date(2026, 5, 1),
        end: new Date(2026, 5, 10),
        distance: 50,
      });
    });

    expect(result.current.isSet).toBe(true);
    expect(result.current.value.distance).toBe(50);
  });

  it("set() throws ref ...E01 for a non-positive or non-numeric distance", () => {
    const { result } = renderHook(() => useGoal());

    expect(() => result.current.set({ start: new Date(), end: new Date(), distance: 0 })).toThrow(
      ValidationError,
    );
    try {
      result.current.set({ start: new Date(), end: new Date(), distance: Number.NaN });
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).reference.endsWith("E01")).toBe(true);
    }
  });

  it("set() throws ref ...E02 for an invalid date", () => {
    const { result } = renderHook(() => useGoal());

    try {
      result.current.set({ start: new Date(Number.NaN), end: new Date(2026, 5, 10), distance: 5 });
      throw new Error("expected set() to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).reference.endsWith("E02")).toBe(true);
    }
  });

  it("set() throws ref ...E03 when end is before or equal to start", () => {
    const { result } = renderHook(() => useGoal());

    try {
      result.current.set({ start: new Date(2026, 5, 10), end: new Date(2026, 5, 1), distance: 5 });
      throw new Error("expected set() to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).reference.endsWith("E03")).toBe(true);
    }
  });

  it("isActive is true exactly at the start and end boundaries", () => {
    const { result } = renderHook(() => useGoal());

    act(() => {
      result.current.set({
        start: new Date(2026, 5, 1),
        end: new Date(2026, 5, 10),
        distance: 50,
      });
    });
    const { start, end } = result.current.value;

    vi.useFakeTimers();
    vi.setSystemTime(start);
    expect(renderHook(() => useGoal()).result.current.isActive).toBe(true);

    vi.setSystemTime(end);
    expect(renderHook(() => useGoal()).result.current.isActive).toBe(true);

    vi.setSystemTime(start - 1);
    expect(renderHook(() => useGoal()).result.current.isActive).toBe(false);

    vi.setSystemTime(end + 1);
    expect(renderHook(() => useGoal()).result.current.isActive).toBe(false);
  });

  it("requiredDistancePerDay divides distance by the inclusive day count", () => {
    const { result } = renderHook(() => useGoal());

    act(() => {
      result.current.set({
        start: new Date(2026, 5, 1),
        end: new Date(2026, 5, 10),
        distance: 50,
      });
    });

    expect(result.current.requiredDistancePerDay).toBe(5);
  });

  it("reset() returns to the unset default state", () => {
    const { result } = renderHook(() => useGoal());

    act(() => {
      result.current.set({
        start: new Date(2026, 5, 1),
        end: new Date(2026, 5, 10),
        distance: 50,
      });
    });
    act(() => {
      result.current.reset();
    });

    expect(result.current.isSet).toBe(false);
  });
});
