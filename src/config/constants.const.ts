/** Client-side route paths, keyed by page. */
export const APP_ROUTES = {
  home: "/",
  log: "/log",
  goal: "/goal",
  settings: "/settings",
} as const;

/** Number of milliseconds in one day. */
export const MS_PER_DAY = 24 * 60 * 60 * 1000;

/** Number of trailing days rendered in the dashboard pace chart, ending today. */
export const PACE_WINDOW_DAYS = 30;

/** Runs within ±this many km of the ideal target still count as "on track". */
export const SCHEDULE_EPSILON_KM = 0.05;

/** Default auto-close delay (ms) for app-wide toast notifications. */
export const NOTIFICATION_AUTO_CLOSE_MS = 2500;

/** Auto-close delay (ms) for the goal save/clear confirmation notifications. */
export const GOAL_NOTIFICATION_AUTO_CLOSE_MS = 1500;

/** Delay (ms) before reloading the app after a data reset, so the notification is seen. */
export const RESET_RELOAD_DELAY_MS = 1200;

/** Delay (ms) before auto-focusing an input, to let the drawer open animation settle. */
export const INPUT_FOCUS_DELAY_MS = 750;
