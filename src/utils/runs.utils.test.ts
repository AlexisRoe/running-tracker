import { describe, expect, it } from "vitest";
import type { RunningEvent } from "@/types/runs.model";
import { groupRunsByYearAndMonth, isRunWhere } from "@/utils/runs.utils";

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

describe("groupRunsByYearAndMonth", () => {
  it("returns an empty array when there are no runs", () => {
    expect(groupRunsByYearAndMonth([])).toEqual([]);
  });

  it("groups multiple runs from the same local month into one month group", () => {
    const runs = [
      makeRun({ date: new Date(2026, 0, 3).getTime() }),
      makeRun({ date: new Date(2026, 0, 28).getTime() }),
    ];

    const groups = groupRunsByYearAndMonth(runs);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.months).toHaveLength(1);
    expect(groups[0]?.months[0]?.runs).toHaveLength(2);
  });

  it("creates one year group per distinct year, ordered newest year first, with months ordered newest first", () => {
    const feb2026 = makeRun({ date: new Date(2026, 1, 10).getTime() });
    const jan2026 = makeRun({ date: new Date(2026, 0, 10).getTime() });
    const dec2025 = makeRun({ date: new Date(2025, 11, 10).getTime() });

    const groups = groupRunsByYearAndMonth([jan2026, dec2025, feb2026]);

    expect(groups.map((g) => g.year)).toEqual([2026, 2025]);
    expect(groups[0]?.months.map((m) => m.monthStart)).toEqual([
      new Date(2026, 1, 1).getTime(),
      new Date(2026, 0, 1).getTime(),
    ]);
    expect(groups[1]?.months.map((m) => m.monthStart)).toEqual([new Date(2025, 11, 1).getTime()]);
  });

  it("sums run distances into the month's totalDistance", () => {
    const runs = [
      makeRun({ date: new Date(2026, 0, 3).getTime(), distance: 5.5 }),
      makeRun({ date: new Date(2026, 0, 28).getTime(), distance: 2.5 }),
    ];

    const groups = groupRunsByYearAndMonth(runs);

    expect(groups[0]?.months[0]?.totalDistance).toBe(8);
  });

  it("sorts runs within a month newest-first by date", () => {
    const early = makeRun({ date: new Date(2026, 0, 3).getTime() });
    const late = makeRun({ date: new Date(2026, 0, 28).getTime() });
    const mid = makeRun({ date: new Date(2026, 0, 15).getTime() });

    const groups = groupRunsByYearAndMonth([early, late, mid]);

    expect(groups[0]?.months[0]?.runs.map((r) => r.id)).toEqual([late.id, mid.id, early.id]);
  });

  it("treats the last moment of one month and the first moment of the next as different groups", () => {
    const endOfJan = makeRun({ date: new Date(2026, 0, 31, 23, 59).getTime() });
    const startOfFeb = makeRun({ date: new Date(2026, 1, 1, 0, 0).getTime() });

    const groups = groupRunsByYearAndMonth([endOfJan, startOfFeb]);

    expect(groups).toHaveLength(1);
    expect(groups[0]?.months).toHaveLength(2);
  });
});
