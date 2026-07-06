import type { RunningEvent } from "@features/runs/runs.model";
import type { YearGroup } from "@features/runs/runs.utils";
import { RunList } from "@pages/log/run-list.component";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

const makeRun = (overrides: Partial<RunningEvent> & { date: number }): RunningEvent => ({
  id: `run-${overrides.date}`,
  where: "indoor",
  distance: 5,
  ...overrides,
});

const now = new Date();
const currentYear = now.getFullYear();
const currentMonthStart = new Date(currentYear, now.getMonth(), 1);
const otherMonthStart = new Date(currentYear, now.getMonth() - 1, 1);

describe("RunList", () => {
  it("renders one control per year and one per month, in order", () => {
    const groups: YearGroup[] = [
      {
        year: 2026,
        months: [
          {
            monthStart: new Date(2026, 1, 1).getTime(),
            totalDistance: 5,
            runs: [makeRun({ date: new Date(2026, 1, 10).getTime() })],
          },
          {
            monthStart: new Date(2026, 0, 1).getTime(),
            totalDistance: 5,
            runs: [makeRun({ date: new Date(2026, 0, 10).getTime() })],
          },
        ],
      },
      {
        year: 2025,
        months: [
          {
            monthStart: new Date(2025, 11, 1).getTime(),
            totalDistance: 5,
            runs: [makeRun({ date: new Date(2025, 11, 10).getTime() })],
          },
        ],
      },
    ];

    renderWithProviders(<RunList groups={groups} onEdit={vi.fn()} />);

    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("2025")).toBeInTheDocument();
    expect(screen.getByText("February - 5.0 km")).toBeInTheDocument();
    expect(screen.getByText("January - 5.0 km")).toBeInTheDocument();
    expect(screen.getByText("December - 5.0 km")).toBeInTheDocument();
  });

  it("sums each month's total distance in its control label", () => {
    const groups: YearGroup[] = [
      {
        year: 2026,
        months: [
          {
            monthStart: new Date(2026, 0, 1).getTime(),
            totalDistance: 10,
            runs: [
              makeRun({ date: new Date(2026, 0, 5).getTime(), distance: 3 }),
              makeRun({ date: new Date(2026, 0, 20).getTime(), distance: 7 }),
            ],
          },
        ],
      },
    ];

    renderWithProviders(<RunList groups={groups} onEdit={vi.fn()} />);

    expect(screen.getByText("January - 10.0 km")).toBeInTheDocument();
  });

  it("expands only the current month by default, collapsing other months and years", () => {
    const groups: YearGroup[] = [
      {
        year: currentYear,
        months: [
          {
            monthStart: currentMonthStart.getTime(),
            totalDistance: 3,
            runs: [makeRun({ date: currentMonthStart.getTime(), distance: 3 })],
          },
          {
            monthStart: otherMonthStart.getTime(),
            totalDistance: 7,
            runs: [makeRun({ date: otherMonthStart.getTime(), distance: 7 })],
          },
        ],
      },
    ];

    renderWithProviders(<RunList groups={groups} onEdit={vi.fn()} />);

    expect(screen.getByText("3 km · Indoor")).toBeVisible();
    expect(screen.queryByText("7 km · Indoor")).not.toBeVisible();
  });

  it("toggles a month's control open when clicked", async () => {
    const user = userEvent.setup();
    const groups: YearGroup[] = [
      {
        year: currentYear,
        months: [
          {
            monthStart: currentMonthStart.getTime(),
            totalDistance: 3,
            runs: [makeRun({ date: currentMonthStart.getTime(), distance: 3 })],
          },
          {
            monthStart: otherMonthStart.getTime(),
            totalDistance: 7,
            runs: [makeRun({ date: otherMonthStart.getTime(), distance: 7 })],
          },
        ],
      },
    ];

    renderWithProviders(<RunList groups={groups} onEdit={vi.fn()} />);

    const otherMonthLabel = otherMonthStart.toLocaleDateString("en", { month: "long" });
    const control = screen.getByRole("button", { name: `${otherMonthLabel} - 7.0 km` });
    expect(control).toHaveAttribute("aria-expanded", "false");

    await user.click(control);

    expect(control).toHaveAttribute("aria-expanded", "true");
  });
});
