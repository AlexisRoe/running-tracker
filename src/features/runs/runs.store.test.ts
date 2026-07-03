import { useRunsStore } from "@features/runs/runs.store";
import { describe, expect, it } from "vitest";

describe("useRunsStore", () => {
  it("addRun appends a new event with a generated id, preserving prior events", () => {
    useRunsStore.getState().addRun({ date: 1, where: "indoor", distance: 5 });
    useRunsStore.getState().addRun({ date: 2, where: "outdoor", distance: 10 });

    const { events } = useRunsStore.getState();
    expect(events).toHaveLength(2);
    expect(events[0]?.id).not.toBe("");
    expect(events[1]?.distance).toBe(10);
  });

  it("removeRun removes only the matching event", () => {
    useRunsStore.getState().addRun({ date: 1, where: "indoor", distance: 5 });
    useRunsStore.getState().addRun({ date: 2, where: "outdoor", distance: 10 });
    const idToRemove = useRunsStore.getState().events[0]?.id as string;

    useRunsStore.getState().removeRun(idToRemove);

    const { events } = useRunsStore.getState();
    expect(events).toHaveLength(1);
    expect(events[0]?.distance).toBe(10);
  });

  it("removeRun is a no-op for an unknown id", () => {
    useRunsStore.getState().addRun({ date: 1, where: "indoor", distance: 5 });

    useRunsStore.getState().removeRun("does-not-exist");

    expect(useRunsStore.getState().events).toHaveLength(1);
  });

  it("updateRun merges a partial patch onto the matching event only", () => {
    useRunsStore.getState().addRun({ date: 1, where: "indoor", distance: 5 });
    useRunsStore.getState().addRun({ date: 2, where: "outdoor", distance: 10 });
    const targetId = useRunsStore.getState().events[0]?.id as string;

    useRunsStore.getState().updateRun(targetId, { distance: 99 });

    const { events } = useRunsStore.getState();
    expect(events[0]?.distance).toBe(99);
    expect(events[0]?.where).toBe("indoor");
    expect(events[1]?.distance).toBe(10);
  });

  it("updateRun is a no-op for an unknown id", () => {
    useRunsStore.getState().addRun({ date: 1, where: "indoor", distance: 5 });

    useRunsStore.getState().updateRun("does-not-exist", { distance: 99 });

    expect(useRunsStore.getState().events[0]?.distance).toBe(5);
  });

  it("persists events to localStorage", () => {
    useRunsStore.getState().addRun({ date: 1, where: "indoor", distance: 5 });

    const raw = localStorage.getItem("runner-tracking-runs-store");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.state.events).toHaveLength(1);
  });
});
