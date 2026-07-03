import type { RunningEvent } from "@features/runs/runs.model";
import { groupRunsByMonth, isRunWhere } from "@features/runs/runs.utils";
import { describe, expect, it } from "vitest";

describe("isRunWhere", () => {
  it("returns true for exact 'indoor' or 'outdoor'", () => {
    expect(isRunWhere("indoor")).toBe(true);
    expect(isRunWhere("outdoor")).toBe(true);
  });

  it("returns false for case-mismatched or unrelated values", () => {
    expect(isRunWhere("Indoor")).toBe(false);
    expect(isRunWhere("somewhere")).toBe(false);
    expect(isRunWhere(1)).toBe(false);
    expect(isRunWhere(null)).toBe(false);
    expect(isRunWhere(undefined)).toBe(false);
  });
});

const makeRun = (overrides: Partial<RunningEvent> & { date: number }): RunningEvent => ({
  id: `run-${overrides.date}`,
  where: "indoor",
  distance: 5,
  ...overrides,
});

describe("groupRunsByMonth", () => {
  it("returns an empty array when there are no runs", () => {
    expect(groupRunsByMonth([])).toEqual([]);
  });

  it("groups multiple runs from the same local month into one group", () => {
    const runs = [
      makeRun({ date: new Date(2026, 0, 3).getTime() }),
      makeRun({ date: new Date(2026, 0, 28).getTime() }),
    ];

    const groups = groupRunsByMonth(runs);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.runs).toHaveLength(2);
  });

  it("creates one group per distinct local month, ordered newest month first", () => {
    const feb = makeRun({ date: new Date(2026, 1, 10).getTime() });
    const jan = makeRun({ date: new Date(2026, 0, 10).getTime() });
    const dec = makeRun({ date: new Date(2025, 11, 10).getTime() });

    const groups = groupRunsByMonth([jan, dec, feb]);

    expect(groups.map((g) => g.monthStart)).toEqual([
      new Date(2026, 1, 1).getTime(),
      new Date(2026, 0, 1).getTime(),
      new Date(2025, 11, 1).getTime(),
    ]);
  });

  it("sorts runs within a group newest-first by date", () => {
    const early = makeRun({ date: new Date(2026, 0, 3).getTime() });
    const late = makeRun({ date: new Date(2026, 0, 28).getTime() });
    const mid = makeRun({ date: new Date(2026, 0, 15).getTime() });

    const groups = groupRunsByMonth([early, late, mid]);

    expect(groups[0]?.runs.map((r) => r.id)).toEqual([late.id, mid.id, early.id]);
  });

  it("treats the last moment of one month and the first moment of the next as different groups", () => {
    const endOfJan = makeRun({ date: new Date(2026, 0, 31, 23, 59).getTime() });
    const startOfFeb = makeRun({ date: new Date(2026, 1, 1, 0, 0).getTime() });

    const groups = groupRunsByMonth([endOfJan, startOfFeb]);

    expect(groups).toHaveLength(2);
  });
});
