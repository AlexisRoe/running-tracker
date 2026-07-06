import type { WeekCell } from "@features/dashboard/dashboard.model";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";
import { YearlyWeeks } from "./yearly-weeks.component";

const weeks: WeekCell[] = [
  {
    weekStart: new Date(2026, 0, 5).getTime(),
    weekNumber: 1,
    distance: 0,
    runCount: 0,
    level: 0,
    inGoalPeriod: true,
  },
  {
    weekStart: new Date(2026, 0, 12).getTime(),
    weekNumber: 2,
    distance: 12,
    runCount: 4,
    level: 4,
    inGoalPeriod: false,
  },
];

describe("YearlyWeeks", () => {
  it("renders a titled heatmap with an accessible cell per week", () => {
    renderWithProviders(
      <YearlyWeeks
        year={2026}
        weeks={weeks}
        canGoPrev={false}
        canGoNext={false}
        onPrevYear={vi.fn()}
        onNextYear={vi.fn()}
      />,
    );

    expect(screen.getByText("2026 running weeks")).toBeInTheDocument();
    expect(screen.getByLabelText("Week 2: 4 runs · 12 km")).toBeInTheDocument();
  });

  it("hides prev/next arrows when no other years are available", () => {
    renderWithProviders(
      <YearlyWeeks
        year={2026}
        weeks={weeks}
        canGoPrev={false}
        canGoNext={false}
        onPrevYear={vi.fn()}
        onNextYear={vi.fn()}
      />,
    );

    expect(screen.queryByLabelText("Previous year")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Next year")).not.toBeInTheDocument();
  });

  it("shows and wires up prev/next arrows when other years are available", async () => {
    const user = userEvent.setup();
    const onPrevYear = vi.fn();
    const onNextYear = vi.fn();

    renderWithProviders(
      <YearlyWeeks
        year={2026}
        weeks={weeks}
        canGoPrev={true}
        canGoNext={true}
        onPrevYear={onPrevYear}
        onNextYear={onNextYear}
      />,
    );

    await user.click(screen.getByLabelText("Previous year"));
    await user.click(screen.getByLabelText("Next year"));

    expect(onPrevYear).toHaveBeenCalledOnce();
    expect(onNextYear).toHaveBeenCalledOnce();
  });
});
