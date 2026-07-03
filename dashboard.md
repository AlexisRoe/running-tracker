# Dashboard Page — Implementation Plan

The root (`/`) page becomes the actual dashboard: goal-progress metrics, statistics,
an ideal-vs-actual pace chart, a yearly running-weeks overview, and a schedule banner.

## 1. Data & definitions

Everything derives from two existing Zustand stores via `useGoal()` and `useRuns()`:

- `Goal { start (ms), end (ms), distance (km target), state }`
- `RunningEvent { date (ms), where: "indoor" | "outdoor", distance (km) }`

Core derived values (computed once in a pure util, guarded against divide-by-zero):

| Symbol | Definition |
|---|---|
| `now` | `Date.now()` |
| `totalDays` | `countInclusiveDays(start, end)` |
| `daysElapsed` | `countInclusiveDays(start, min(now, end))` — today counts as elapsed |
| `daysLeft` | `max(0, totalDays − daysElapsed)` — full days after today |
| `daysLeftInclToday` | `max(1, daysLeft + 1)` — today is still runnable |
| `runsInPeriod` | runs with `start ≤ date ≤ end` |
| `distanceRun` | Σ distance of `runsInPeriod` |
| `distanceOpen` | `max(0, goal.distance − distanceRun)` |

## 2. Metrics (headline)

**km/day to reach goal** (1 decimal) — the headline number:

```
requiredPerRemainingDay = distanceOpen / daysLeftInclToday
```

Baseline for comparison (the pace planned on day one):

```
baselinePerDay = goal.distance / totalDays      // "average km at the beginning"
```

The headline shows `requiredPerRemainingDay` with an arrow vs `baselinePerDay`:

- required **>** baseline → red ▲ (must speed up)
- required **<** baseline → green ▼ (can ease off)
- within ε → neutral (on track)

## 3. Schedule status (authoritative behind/ahead)

```
idealCumToDate = baselinePerDay * daysElapsed     // km you "should" have by tonight
delta          = distanceRun - idealCumToDate     // + ahead, - behind (km)
daysDelta      = delta / baselinePerDay            // ahead/behind expressed in days
```

- `delta < −ε` → **behind** → red banner **"Run faster!!!"** + "X.X km / Y.Y days behind"
- `delta ≥ −ε` → **on/ahead** → green banner **"Good Job."** + (if ahead) "X.X km ahead"

## 4. Statistics grid (stat tiles)

- **Days running vs rest** — distinct calendar days with ≥1 run vs `daysElapsed − daysWithRuns`
- **Outdoor vs indoor** — run counts split (+ small km split), shown as a ring/segmented bar
- **km run vs open** — `distanceRun` / `distanceOpen`, progress ring toward `goal.distance`
- **Total goal** — `goal.distance` km for the period
- **Days left** — `daysLeft`
- **Avg at start** — `baselinePerDay`
- **Avg needed now** — `requiredPerRemainingDay`
- **Schedule delta** — km + days ahead/behind (mirrors banner)

## 5. Charts

**Pace chart** (`@mantine/charts` `LineChart`) — last 30 days (`now − 30d … now`), one point/day:

- **Ideal line**: cumulative `baselinePerDay × countInclusiveDays(start, day)` (0 before start)
- **Actual line**: cumulative Σ distance of runs up to end-of-day

Both are cumulative-from-goal-start, windowed to the trailing 30 days so the two lines are
directly comparable. Colors/formatting follow the **dataviz skill** (loaded before writing
chart code).

**Yearly overview of running weeks** — hand-rolled SVG/flex heatmap:

- One cell per ISO week of the current year (~52 cells), intensity bucketed by weekly km
  (0 / low / med / high). Mantine `Tooltip` shows the week range + km.

## 6. Empty / edge states

- **No active goal** → "Set a goal" CTA that opens the existing `GoalDrawer`; yearly overview
  + basic run totals still render.
- **Goal period ended** → final summary (achieved / missed), calcs clamp `now → end`.
- Guards for `totalDays === 0`, `baselinePerDay === 0`, `distanceOpen === 0`,
  `daysLeftInclToday === 0`.

## 7. File structure (FSD)

**Feature (logic + tests):**

- `src/features/dashboard/dashboard.model.ts` — `DashboardMetrics`, `ScheduleStatus`,
  `PacePoint`, `WeekCell` types
- `src/features/dashboard/dashboard.utils.ts` (+ `.test.ts`) — pure: `computeMetrics`,
  `buildPaceSeries`, `buildYearlyWeeks`, `scheduleStatus`
- `src/features/dashboard/use-dashboard.hook.ts` (+ `.test.ts`) — composes `useGoal` + `useRuns`

**Widgets (presentation + tests):**

- `src/widgets/dashboard/schedule-banner.component.tsx`
- `src/widgets/dashboard/stats-grid.component.tsx`
- `src/widgets/dashboard/goal-progress.component.tsx` (km run vs open ring)
- `src/widgets/dashboard/pace-chart.component.tsx`
- `src/widgets/dashboard/yearly-weeks.component.tsx`
- `src/widgets/dashboard/set-goal-cta.component.tsx`

**Page:**

- Rewrite `src/pages/home/home.page.tsx` to compose the dashboard widgets; update
  `home.page.test.tsx`.

## 8. Dependencies & i18n

- Add `@mantine/charts@9.3.2` + `recharts` (v2, its peer); import `@mantine/charts/styles.css`
  in the app entry.
- Add `dashboard.*` keys to `en.json`, `de.json`, `pl.json`.

## 9. Testing

Vitest + RTL following existing patterns: full unit coverage of `dashboard.utils` (all edge
cases above), a hook test, and render/smoke tests per widget.
