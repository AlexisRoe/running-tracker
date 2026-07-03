import type { PacePoint } from "@features/dashboard/dashboard.model";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";
import { PaceChart } from "./pace-chart.component";

const data: PacePoint[] = [
  { date: new Date(2026, 5, 1).getTime(), ideal: 1, actual: 0 },
  { date: new Date(2026, 5, 2).getTime(), ideal: 2, actual: 3 },
];

describe("PaceChart", () => {
  it("renders the chart section with its title", () => {
    renderWithProviders(<PaceChart data={data} />);

    expect(screen.getByText("Pace — last 30 days")).toBeInTheDocument();
  });
});
