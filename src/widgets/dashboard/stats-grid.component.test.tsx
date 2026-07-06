import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";
import { StatsGrid } from "./stats-grid.component";

const metrics: DashboardMetrics = {
  hasActiveGoal: true,
  isFinished: false,
  goalDistance: 30,
  totalDays: 30,
  daysElapsed: 10,
  daysLeft: 20,
  distanceRun: 8,
  distanceOpen: 22,
  daysWithRuns: 3,
  daysWithoutRuns: 7,
  indoorCount: 1,
  outdoorCount: 2,
  indoorDistance: 2,
  outdoorDistance: 6,
  baselinePerDay: 1,
  requiredPerRemainingDay: 1.5,
  schedule: { state: "behind", deltaKm: -2, deltaDays: -2 },
};

describe("StatsGrid", () => {
  it("renders the headline pace and supporting tiles", () => {
    renderWithProviders(<StatsGrid metrics={metrics} />);

    expect(screen.getByText("km/day to reach goal")).toBeInTheDocument();
    expect(screen.getByText("1.50")).toBeInTheDocument();
    expect(screen.getByText("Days left")).toBeInTheDocument();
  });
});
