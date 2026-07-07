# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Running Tracker — a personal PWA (React 19 + Vite 8 + TypeScript 6) to track runs against a distance goal. Client-only SPA, no backend: all data lives in localStorage via persisted Zustand stores. Deployed as static assets on Cloudflare Workers (wrangler.jsonc, SPA fallback routing).

Node is pinned to 24.15.0 (`.nvmrc`, engine-strict).

## Commands

- `npm run dev` — Vite dev server on port 5173 (PWA service worker enabled in dev)
- `npm run build` — `tsc -p tsconfig.json` then `vite build`
- `npm run typecheck` — `tsc --noEmit`
- `npm run lint` / `npm run lint:fix` — Biome (replaces ESLint + Prettier; config in biome.json)
- `npm run test` — Vitest, single run
- `npm run test:watch` — Vitest watch mode
- Single test file: `npx vitest run src/hooks/use-dashboard.hook.test.ts`
- `npm run deploy` — build + `wrangler deploy`

At the end of a task, verify the application by running `npm run test`, `npm run lint`, `npm run typecheck`, and `npm run build`.

All inspection of and changes to git history must go through the standard `git` commands (`git log`, `git commit`, `git rebase`, etc.) — never by editing files under `.git/` directly or using other tools to rewrite history.

Git hooks (Husky): pre-commit runs lint-staged (Biome formats staged .ts/.tsx). Pre-push runs `biome check --write .` on the whole tree — if it changes anything it auto-commits the result and aborts the push (re-push to continue) — then typecheck and the full test suite.

## Architecture

Kind-based folder structure (deliberately migrated off Feature-Sliced Design): files are grouped by what they *are*, not by feature. Top-level `src/` folders:

- `app/` — entry (`main.tsx`), providers, router config, Mantine theme, global CSS
- `pages/` — one `.page.tsx` per route (home = dashboard, log, goal, settings, not-found)
- `components/` — subfolders by area: `app-shell/`, `dashboard/`, `runs/`, `ui/`
- `hooks/` — all business logic lives in hooks (`use-*.hook.ts`); components stay presentational
- `stores/` — Zustand stores (`runs`, `goal`, `settings`), persisted to localStorage
- `utils/` — pure functions (`.utils.ts`); derived dashboard/goal math lives here, not in components
- `types/` — domain models (`.model.ts`)
- `config/` — i18n, constants, validation errors, build info
- `locales/` — i18next JSON (en, de, pl)
- `test/` — Vitest setup and `render-with-providers.tsx` test helper

Conventions:
- Kebab-case filenames with role suffixes: `.component.tsx`, `.hook.ts`, `.page.tsx`, `.store.ts`, `.model.ts`, `.utils.ts`, `.config.ts`, `.const.ts`
- Direct file imports only — no `index.ts` barrels
- Single path alias `@/*` → `src/*` (tsconfig paths + `vite-shared.config.ts`, shared by vite.config.ts and vitest.config.ts). When moving files, also update string specifiers in `vi.mock("...")` calls — path tooling won't rewrite those.
- Tests are colocated (`foo.test.ts(x)` next to `foo.ts(x)`); jsdom environment, `globals: false` so import from `vitest` explicitly; use `render-with-providers.tsx` for components needing Mantine/i18n/router context.
- Routes are defined via `APP_ROUTES` in `config/constants.const.ts`; the route table is `app/app-router.config.tsx` (React Router 7, client-side data router, no SSR).
- Build-time globals `__APP_NAME__`, `__APP_VERSION__`, `__BUILD_COMMIT_HASH__`, `__BUILD_TIME__` are injected via `define` in `vite-shared.config.ts` (typed in `types/global.d.ts`).
- UI is Mantine 9.3 + @mantine/charts (Recharts); all user-facing strings go through react-i18next with keys in all three locale files.

## Domain model

Two core entities drive everything: `Goal { start, end, distance, state }` and `RunningEvent { id, date, where: "indoor" | "outdoor", distance }` (dates as ms timestamps, distances in km). Dashboard metrics (km/day needed, pace chart, yearly weeks) are pure derivations in `utils/dashboard.utils.ts` consumed via `use-dashboard.hook.ts`; `dashboard.md` at the repo root documents the metric definitions.
