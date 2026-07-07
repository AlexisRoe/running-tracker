import { describe, expect, it } from "vitest";
import { formatDistance } from "@/utils/distance.utils";

describe("formatDistance", () => {
  it("renders whole numbers without a decimal part", () => {
    expect(formatDistance(5)).toBe("5");
    expect(formatDistance(0)).toBe("0");
    expect(formatDistance(42)).toBe("42");
  });

  it("renders fractional values with exactly two decimals", () => {
    expect(formatDistance(5.1)).toBe("5.10");
    expect(formatDistance(5.25)).toBe("5.25");
    expect(formatDistance(0.5)).toBe("0.50");
  });

  it("rounds to two decimals", () => {
    expect(formatDistance(5.126)).toBe("5.13");
    expect(formatDistance(5.124)).toBe("5.12");
    expect(formatDistance(5.125)).toBe("5.13");
  });

  it("drops the decimal part when rounding lands on a whole number", () => {
    expect(formatDistance(4.999)).toBe("5");
    expect(formatDistance(4.001)).toBe("4");
  });

  it("handles negative values", () => {
    expect(formatDistance(-3)).toBe("-3");
    expect(formatDistance(-3.5)).toBe("-3.50");
    expect(formatDistance(-3.126)).toBe("-3.13");
  });
});
