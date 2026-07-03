import { isRunWhere } from "@features/runs/runs.utils";
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
