import { isEnum, isNumber, isString } from "@shared/lib/validation.utils";
import { describe, expect, it } from "vitest";

enum Sample {
  A = "a",
  B = "b",
}

describe("isString", () => {
  it("returns true for strings", () => {
    expect(isString("")).toBe(true);
    expect(isString("hello")).toBe(true);
  });

  it("returns false for non-strings", () => {
    expect(isString(1)).toBe(false);
    expect(isString(null)).toBe(false);
    expect(isString(undefined)).toBe(false);
    expect(isString({})).toBe(false);
    expect(isString([])).toBe(false);
  });
});

describe("isNumber", () => {
  it("returns true for finite numbers", () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(-3)).toBe(true);
    expect(isNumber(2.5)).toBe(true);
  });

  it("returns false for NaN and Infinity", () => {
    expect(isNumber(Number.NaN)).toBe(false);
    expect(isNumber(Number.POSITIVE_INFINITY)).toBe(false);
    expect(isNumber(Number.NEGATIVE_INFINITY)).toBe(false);
  });

  it("returns false for non-numbers", () => {
    expect(isNumber("1")).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber(undefined)).toBe(false);
  });
});

describe("isEnum", () => {
  it("returns true for a value present in the enum", () => {
    expect(isEnum("a", Sample)).toBe(true);
    expect(isEnum("b", Sample)).toBe(true);
  });

  it("returns false for a value not present in the enum", () => {
    expect(isEnum("c", Sample)).toBe(false);
    expect(isEnum(1, Sample)).toBe(false);
    expect(isEnum(undefined, Sample)).toBe(false);
  });
});
