import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ValidationError } from "@/config/validation.error";
import { useRuns } from "@/hooks/use-runs.hook";

afterEach(() => {
  vi.useRealTimers();
});

function expectRef(fn: () => void, suffix: string) {
  try {
    fn();
    throw new Error("expected function to throw");
  } catch (err) {
    expect(err).toBeInstanceOf(ValidationError);
    expect((err as ValidationError).reference.endsWith(suffix)).toBe(true);
  }
}

describe("useRuns", () => {
  it("add() defaults where to 'indoor' and stamps the current time", () => {
    vi.useFakeTimers();
    vi.setSystemTime(12345);
    const { result } = renderHook(() => useRuns());

    act(() => {
      result.current.add({ distance: 5 });
    });

    expect(result.current.value[0]).toMatchObject({ where: "indoor", distance: 5, date: 12345 });
  });

  it("add() accepts an explicit where value", () => {
    const { result } = renderHook(() => useRuns());

    act(() => {
      result.current.add({ distance: 5, where: "outdoor" });
    });

    expect(result.current.value[0]?.where).toBe("outdoor");
  });

  it("add() throws ref ...A01 for an invalid distance", () => {
    const { result } = renderHook(() => useRuns());

    expectRef(() => result.current.add({ distance: 0 }), "A01");
  });

  it("add() throws ref ...A02 for an invalid where", () => {
    const { result } = renderHook(() => useRuns());

    expectRef(() => result.current.add({ distance: 5, where: "elsewhere" }), "A02");
  });

  it("update() only patches provided fields", () => {
    const { result } = renderHook(() => useRuns());
    act(() => {
      result.current.add({ distance: 5, where: "indoor" });
    });
    const id = result.current.value[0]?.id as string;

    act(() => {
      result.current.update(id, { distance: 9 });
    });

    expect(result.current.value[0]).toMatchObject({ distance: 9, where: "indoor" });
  });

  it("update() throws ref ...A03 for an invalid distance", () => {
    const { result } = renderHook(() => useRuns());
    act(() => {
      result.current.add({ distance: 5, where: "indoor" });
    });
    const id = result.current.value[0]?.id as string;

    expectRef(() => result.current.update(id, { distance: -1 }), "A03");
  });

  it("update() throws ref ...A04 for an invalid where", () => {
    const { result } = renderHook(() => useRuns());
    act(() => {
      result.current.add({ distance: 5, where: "indoor" });
    });
    const id = result.current.value[0]?.id as string;

    expectRef(() => result.current.update(id, { where: "nowhere" }), "A04");
  });

  it("update() passes date through unvalidated when provided", () => {
    const { result } = renderHook(() => useRuns());
    act(() => {
      result.current.add({ distance: 5, where: "indoor" });
    });
    const id = result.current.value[0]?.id as string;

    act(() => {
      result.current.update(id, { date: 999 });
    });

    expect(result.current.value[0]?.date).toBe(999);
  });

  it("update() with an empty patch is a no-op that does not throw", () => {
    const { result } = renderHook(() => useRuns());
    act(() => {
      result.current.add({ distance: 5, where: "indoor" });
    });
    const id = result.current.value[0]?.id as string;
    const before = result.current.value[0];

    act(() => {
      result.current.update(id, {});
    });

    expect(result.current.value[0]).toEqual(before);
  });

  it("remove() removes the matching run and is a no-op for an unknown id", () => {
    const { result } = renderHook(() => useRuns());
    act(() => {
      result.current.add({ distance: 5, where: "indoor" });
    });
    const id = result.current.value[0]?.id as string;

    act(() => {
      result.current.remove("unknown-id");
    });
    expect(result.current.value).toHaveLength(1);

    act(() => {
      result.current.remove(id);
    });
    expect(result.current.value).toHaveLength(0);
  });
});
