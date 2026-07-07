import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RunningEvent } from "@/types/runs.model";

/** Mutations for the runs store. */
type RunsActions = {
  /** Appends a new run, assigning it a generated id. */
  addRun(input: Omit<RunningEvent, "id">): void;
  /** Removes the run with the given id. */
  removeRun(id: string): void;
  /** Applies a partial update to the run with the given id. */
  updateRun(id: string, input: Partial<Omit<RunningEvent, "id">>): void;
};

/** Persisted store of all recorded runs (localStorage-backed). */
export const useRunsStore = create<{ events: RunningEvent[] } & RunsActions>()(
  persist(
    (set) => ({
      events: [],
      addRun: (input) =>
        set((s) => ({ events: [...s.events, { ...input, id: crypto.randomUUID() }] })),
      removeRun: (id) => set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
      updateRun: (id, input) =>
        set((s) => ({
          events: s.events.map((e) => (e.id === id ? { ...e, ...input } : e)),
        })),
    }),
    { name: "runner-tracking-runs-store" },
  ),
);
