import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyError } from "@/components/ui/notify";
import { useEditRunForm } from "@/hooks/use-edit-run-form.hook";
import { useRunsStore } from "@/stores/runs.store";
import type { RunningEvent } from "@/types/runs.model";

vi.mock("@/components/ui/notify", () => ({
  notifyError: vi.fn(),
}));

const run: RunningEvent = {
  id: "run-1",
  date: new Date(2026, 0, 15).getTime(),
  where: "outdoor",
  distance: 5.5,
};

afterEach(() => {
  useRunsStore.setState({ events: [] });
  vi.clearAllMocks();
});

describe("useEditRunForm", () => {
  it("seeds the form from the run", () => {
    const { result } = renderHook(() => useEditRunForm(run, vi.fn()));

    expect(result.current.distance).toBe(5.5);
    expect(result.current.where).toBe("outdoor");
    expect(result.current.date.getTime()).toBe(run.date);
  });

  it("save applies the edits and closes", () => {
    useRunsStore.setState({ events: [run] });
    const onClose = vi.fn();
    const { result } = renderHook(() => useEditRunForm(run, onClose));

    act(() => result.current.setDistance(8));
    act(() => result.current.save());

    expect(useRunsStore.getState().events[0]).toMatchObject({ distance: 8, where: "outdoor" });
    expect(onClose).toHaveBeenCalled();
  });

  it("save with an invalid distance notifies an error and stays open", () => {
    useRunsStore.setState({ events: [run] });
    const onClose = vi.fn();
    const { result } = renderHook(() => useEditRunForm(run, onClose));

    act(() => result.current.setDistance(0));
    act(() => result.current.save());

    expect(useRunsStore.getState().events[0]?.distance).toBe(5.5);
    expect(notifyError).toHaveBeenCalled();
    expect(onClose).not.toHaveBeenCalled();
  });

  it("remove deletes the run and closes", () => {
    useRunsStore.setState({ events: [run] });
    const onClose = vi.fn();
    const { result } = renderHook(() => useEditRunForm(run, onClose));

    act(() => result.current.remove());

    expect(useRunsStore.getState().events).toHaveLength(0);
    expect(onClose).toHaveBeenCalled();
  });
});
