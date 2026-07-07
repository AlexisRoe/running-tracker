type EnumObject = Record<string, string>;

export const isString = (i: unknown): i is string => typeof i === "string";

export const isNumber = (i: unknown): i is number => typeof i === "number" && Number.isFinite(i);

export const isEnum = <T extends EnumObject>(i: unknown, e: T): i is T[keyof T] =>
  isString(i) && Object.values(e).includes(i);
