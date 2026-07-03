import type { RunWhere } from "./runs.model";

export const isRunWhere = (i: unknown): i is RunWhere => i === "indoor" || i === "outdoor";
