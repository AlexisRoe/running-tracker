import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RunningEvent } from "@/types/runs.model";

type RunsActions = {
  addRun(input: Omit<RunningEvent, "id">): void;
  removeRun(id: string): void;
  updateRun(id: string, input: Partial<Omit<RunningEvent, "id">>): void;
};

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
