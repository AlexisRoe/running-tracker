import type { WeekCell } from "@features/dashboard/dashboard.model";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";
import { YearlyWeeks } from "./yearly-weeks.component";

const weeks: WeekCell[] = [
  { weekStart: new Date(2026, 0, 5).getTime(), weekNumber: 1, distance: 0, level: 0 },
  { weekStart: new Date(2026, 0, 12).getTime(), weekNumber: 2, distance: 12, level: 4 },
];

describe("YearlyWeeks", () => {
  it("renders a titled heatmap with an accessible cell per week", () => {
    renderWithProviders(<YearlyWeeks weeks={weeks} />);

    expect(screen.getByText("2026 running weeks")).toBeInTheDocument();
    expect(screen.getByLabelText("Week 2: 12 km")).toBeInTheDocument();
  });
});
