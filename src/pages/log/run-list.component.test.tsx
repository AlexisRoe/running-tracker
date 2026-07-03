import type { RunningEvent } from "@features/runs/runs.model";
import type { RunGroup } from "@features/runs/runs.utils";
import { RunList } from "@pages/log/run-list.component";
import { screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

const makeRun = (overrides: Partial<RunningEvent> & { date: number }): RunningEvent => ({
  id: `run-${overrides.date}`,
  where: "indoor",
  distance: 5,
  ...overrides,
});

describe("RunList", () => {
  it("renders one heading per group with the localized month and year, in order", () => {
    const groups: RunGroup[] = [
      {
        monthStart: new Date(2026, 1, 1).getTime(),
        runs: [makeRun({ date: new Date(2026, 1, 10).getTime() })],
      },
      {
        monthStart: new Date(2026, 0, 1).getTime(),
        runs: [makeRun({ date: new Date(2026, 0, 10).getTime() })],
      },
    ];

    renderWithProviders(<RunList groups={groups} onRemove={vi.fn()} />);

    const headings = screen.getAllByText(/^[A-Za-z]+ 2026$/);
    expect(headings[0]).toHaveTextContent("February 2026");
    expect(headings[1]).toHaveTextContent("January 2026");
  });

  it("renders every run within its group", () => {
    const runA = makeRun({ date: new Date(2026, 0, 5).getTime(), distance: 3 });
    const runB = makeRun({ date: new Date(2026, 0, 20).getTime(), distance: 7 });
    const groups: RunGroup[] = [{ monthStart: new Date(2026, 0, 1).getTime(), runs: [runB, runA] }];

    renderWithProviders(<RunList groups={groups} onRemove={vi.fn()} />);

    expect(screen.getByText(/3 km/)).toBeInTheDocument();
    expect(screen.getByText(/7 km/)).toBeInTheDocument();
  });
});
