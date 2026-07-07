import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("reveals a tile's info text after clicking it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StatsGrid metrics={metrics} />);

    expect(
      screen.queryByText(
        "How many days remain until your goal's end date, and how far through the whole period you already are.",
      ),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "More details about Days left" }));

    expect(
      screen.getByText(
        "How many days remain until your goal's end date, and how far through the whole period you already are.",
      ),
    ).toBeInTheDocument();
  });

  it("reveals the headline card's info text after clicking it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StatsGrid metrics={metrics} />);

    expect(
      screen.queryByText(
        "How many kilometers per day you now need to average to hit your goal, given what's left of the period and how far you've already run.",
      ),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "More details about your daily pace goal" }),
    );

    expect(
      screen.getByText(
        "How many kilometers per day you now need to average to hit your goal, given what's left of the period and how far you've already run.",
      ),
    ).toBeInTheDocument();
  });
});
