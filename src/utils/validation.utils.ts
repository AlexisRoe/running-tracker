/** A string-valued enum-like object (the shape produced by a TS string enum). */
type EnumObject = Record<string, string>;

/** Type guard: whether the value is a string. */
export const isString = (i: unknown): i is string => typeof i === "string";

/** Type guard: whether the value is a finite number. */
export const isNumber = (i: unknown): i is number => typeof i === "number" && Number.isFinite(i);

/** Type guard: whether the value is one of the given enum's member values. */
export const isEnum = <T extends EnumObject>(i: unknown, e: T): i is T[keyof T] =>
  isString(i) && Object.values(e).includes(i);
