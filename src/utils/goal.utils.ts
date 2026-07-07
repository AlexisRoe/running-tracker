import { MS_PER_DAY } from "@/config/constants.const";

/** Normalizes a calendar day to 00:00:01.000 of that day. */
export function toGoalStart(input: Date | number): number {
  const d = new Date(input);
  d.setHours(0, 0, 1, 0);
  return d.getTime();
}

/** Normalizes a calendar day to 23:59:59.000 of that day. */
export function toGoalEnd(input: Date | number): number {
  const d = new Date(input);
  d.setHours(23, 59, 59, 0);
  return d.getTime();
}

/** Inclusive calendar-day count from start's day through end's day (e.g. Mon-Tue = 2). */
export function countInclusiveDays(start: number, end: number): number {
  const startDay = new Date(start);
  startDay.setHours(0, 0, 0, 0);
  const endDay = new Date(end);
  endDay.setHours(0, 0, 0, 0);
  const diff = Math.round((endDay.getTime() - startDay.getTime()) / MS_PER_DAY);
  return diff + 1;
}

/** Whether `now` falls within [start, end] inclusive. */
export function isWithinTimeframe(start: number, end: number, now: number): boolean {
  return now >= start && now <= end;
}
