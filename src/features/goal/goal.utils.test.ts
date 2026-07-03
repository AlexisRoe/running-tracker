import {
  countInclusiveDays,
  isWithinTimeframe,
  toGoalEnd,
  toGoalStart,
} from "@features/goal/goal.utils";
import { describe, expect, it } from "vitest";

describe("toGoalStart", () => {
  it("normalizes a Date to 00:00:01.000 local time of that day", () => {
    const input = new Date(2026, 5, 15, 13, 45, 30);
    const result = new Date(toGoalStart(input));

    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(1);
    expect(result.getMilliseconds()).toBe(0);
    expect(result.getDate()).toBe(15);
  });

  it("accepts a raw epoch number for the same calendar day", () => {
    const asDate = new Date(2026, 5, 15, 13, 45, 30);
    const asNumber = asDate.getTime();

    expect(toGoalStart(asNumber)).toBe(toGoalStart(asDate));
  });
});

describe("toGoalEnd", () => {
  it("normalizes a Date to 23:59:59.000 local time of that day", () => {
    const input = new Date(2026, 5, 15, 3, 10, 0);
    const result = new Date(toGoalEnd(input));

    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
    expect(result.getMilliseconds()).toBe(0);
    expect(result.getDate()).toBe(15);
  });
});

describe("countInclusiveDays", () => {
  it("returns 1 for the same day", () => {
    const start = toGoalStart(new Date(2026, 5, 15));
    const end = toGoalEnd(new Date(2026, 5, 15));

    expect(countInclusiveDays(start, end)).toBe(1);
  });

  it("returns an inclusive count across multiple days (Mon-Tue = 2)", () => {
    const start = toGoalStart(new Date(2026, 5, 15));
    const end = toGoalEnd(new Date(2026, 5, 16));

    expect(countInclusiveDays(start, end)).toBe(2);
  });

  it("ignores time-of-day when counting days", () => {
    const start = new Date(2026, 5, 15, 23, 59, 0).getTime();
    const end = new Date(2026, 5, 16, 0, 0, 1).getTime();

    expect(countInclusiveDays(start, end)).toBe(2);
  });
});

describe("isWithinTimeframe", () => {
  const start = 1000;
  const end = 2000;

  it("returns true when now equals start or end (inclusive boundaries)", () => {
    expect(isWithinTimeframe(start, end, start)).toBe(true);
    expect(isWithinTimeframe(start, end, end)).toBe(true);
  });

  it("returns true when now is strictly inside the timeframe", () => {
    expect(isWithinTimeframe(start, end, 1500)).toBe(true);
  });

  it("returns false when now is outside the timeframe", () => {
    expect(isWithinTimeframe(start, end, 999)).toBe(false);
    expect(isWithinTimeframe(start, end, 2001)).toBe(false);
  });
});
