# running-tracker

A small personal app to track how often — and how far — you have to run to reach your distance goal.

## Motivation

<!-- Draft — rewrite in your own words -->
I wanted a single, honest answer to one question every morning: *how many kilometers do I have to run today to still hit my goal?* Most fitness apps bury that under social feeds, subscriptions, and accounts. This one is deliberately the opposite: a tiny, private PWA where all data stays in your browser — no backend, no login, no tracking — just you against your own goal.

## Description

You set a distance goal for a period (e.g. 500 km this year) and log each run — date, indoor or outdoor, distance in km. Everything else is derived for you on the dashboard:

- the **km/day you need from today** to reach the goal, compared to the pace you planned on day one
- an **ahead/behind schedule** status, in km and days
- an **ideal vs. actual pace chart** over the last 30 days
- a **yearly overview** of your running weeks

The exact metric definitions live in [dashboard.md](./dashboard.md).

The app is a client-only single-page PWA: there is no server, and all data is persisted to `localStorage` on your device.

## Features

- Distance goal with start/end period and progress tracking
- Run log (date, indoor/outdoor, distance)
- Dashboard with derived metrics, pace chart, and yearly weeks overview
- Three languages: English, German, Polish
- Installable PWA, works offline
- No account, no backend — your data never leaves your device

## How to start

Node is pinned to **24.15.0** (`.nvmrc`, engine-strict), so switch first:

```sh
nvm use
npm ci
npm run dev   # Vite dev server on http://localhost:5173
```

Other scripts:

| Command                       | What it does                                    |
| ----------------------------- | ----------------------------------------------- |
| `npm run build`               | Typecheck (`tsc`) + production build            |
| `npm run typecheck`           | `tsc --noEmit`                                  |
| `npm run lint` / `lint:fix`   | Biome check (and auto-fix)                      |
| `npm run test` / `test:watch` | Vitest, single run / watch mode                 |
| `npm run deploy`              | Build + `wrangler deploy` to Cloudflare Workers |

Git hooks (Husky) keep the tree clean: pre-commit formats staged files via lint-staged, pre-push runs a full Biome check, typecheck, and the test suite.

## Architecture

The codebase uses a **kind-based folder structure**: files are grouped by what they *are*, not by feature.

| Folder            | Purpose                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------- |
| `src/app/`        | Entry point, providers, router config, Mantine theme, global CSS                        |
| `src/pages/`      | One `.page.tsx` per route (dashboard, log, goal, settings, not-found)                   |
| `src/components/` | Presentational components, grouped by area (`app-shell/`, `dashboard/`, `runs/`, `ui/`) |
| `src/hooks/`      | All business logic (`use-*.hook.ts`) — components stay presentational                   |
| `src/stores/`     | Zustand stores (`runs`, `goal`, `settings`), persisted to `localStorage`                |
| `src/utils/`      | Pure functions — derived dashboard/goal math lives here                                 |
| `src/types/`      | Domain models                                                                           |
| `src/config/`     | i18n, constants, validation errors, build info                                          |
| `src/locales/`    | i18next translations (en, de, pl)                                                       |
| `src/test/`       | Vitest setup and render helper                                                          |

Two entities drive everything: `Goal { start, end, distance, state }` and `RunningEvent { id, date, where, distance }` (dates as ms timestamps, distances in km). Dashboard metrics are pure derivations in `src/utils/dashboard.utils.ts`, consumed through `use-dashboard.hook.ts`.

## Technology

- **React 19** + **TypeScript 6**, built with **Vite 8**
- **Mantine 9.3** UI + **@mantine/charts** (Recharts)
- **Zustand 5** for state (persisted to `localStorage`)
- **React Router 7** (client-side data router, no SSR)
- **react-i18next** for translations
- **vite-plugin-pwa** for offline support
- **Biome** for linting and formatting, **Vitest** + Testing Library for tests
- Deployed as static assets on **Cloudflare Workers** (wrangler, SPA fallback routing)

## Coding conventions

- Kebab-case filenames with role suffixes: `.component.tsx`, `.hook.ts`, `.page.tsx`, `.store.ts`, `.model.ts`, `.utils.ts`
- Direct file imports only — no `index.ts` barrels
- Single path alias `@/*` → `src/*`
- Tests are colocated (`foo.test.ts(x)` next to `foo.ts(x)`)
- All user-facing strings go through react-i18next, with keys in all three locale files

## License

[MIT](./LICENSE)
