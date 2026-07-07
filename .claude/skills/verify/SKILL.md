---
name: verify
description: How to launch and drive the running-tracker app to verify changes end-to-end in a real browser.
---

# Verifying running-tracker changes

PWA SPA (React 19 + Vite + Mantine). No backend — all state lives in localStorage
(zustand persist), so **every fresh browser context starts blank**: seed a goal/runs
through the UI (or pre-fill localStorage) before testing flows that need them.

## Launch

```bash
npm run dev -- --port 5199   # background; ready in ~1s, check http://localhost:5199
```

## Drive (Playwright)

Playwright is not a dependency; install it ad-hoc in a scratch dir
(`npm install playwright --no-save`) — Chromium is usually already cached in
`~/Library/Caches/ms-playwright`. Use a phone-ish viewport (420x860): the app is
mobile-first and the footer nav overlaps content on desktop sizes.

Useful selectors / flows:
- Footer nav: `getByRole("button", { name: "Add run" })` opens the add drawer;
  home/goal/log/settings tabs by aria-label.
- Goal form: `getByLabel("Start date" | "End date")`, `getByLabel(/Distance/)`.
  Mantine `DateInput` opens a popover **on focus** that intercepts clicks on
  buttons below it — press `Escape` after filling a date before clicking
  Save/Clear/Edit.
- Notifications: `.mantine-Notification-root` (goal ones autoclose after 1.5s,
  others 2.5s — wait them out between steps or they stack).
- Log page rows: `getByLabel("Edit run")`.
- Confetti = a `canvas` element appearing after a goal-meeting run.

## Worth checking after logic changes

Goal set/edit (dirty-state disables Save; end auto-fills +1y−1day unless touched;
end ≤ start shows inline error), goal clear (confirm modal → info notification →
blank edit form), add run met/missed pace (confetti + success vs warning
notification), add drawer with no goal (empty state), edit/delete run from the log,
dashboard banner copy + headline trend + stat percentages.
