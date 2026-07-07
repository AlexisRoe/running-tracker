import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { StatsGrid } from "@/components/dashboard/stats-grid.component";
import { renderWithProviders } from "@/test/render-with-providers";
import type { DashboardMetrics } from "@/types/dashboard.model";

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

// Both flip faces are always mounted (so the card can measure and size
// itself correctly before the first flip), so labels shown on both the
// front and back (e.g. a tile's title) match twice. Resolve to the one
// that's currently visible (not on the inert, flipped-away face).
function getVisibleByText(text: string) {
  const match = screen.getAllByText(text).find((element) => !element.closest("[inert]"));
  if (!match) {
    throw new Error(`No visible element found with text: ${text}`);
  }
  return match;
}

describe("StatsGrid", () => {
  it("renders the headline pace and supporting tiles", () => {
    renderWithProviders(<StatsGrid metrics={metrics} />);

    expect(getVisibleByText("km/day to reach goal")).toBeInTheDocument();
    expect(screen.getByText("1.50")).toBeInTheDocument();
    expect(getVisibleByText("Days left")).toBeInTheDocument();
  });

  it("reveals a tile's info text after clicking it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StatsGrid metrics={metrics} />);

    const infoText =
      "How many days remain until your goal's end date, and how far through the whole period you already are.";

    expect(screen.getByText(infoText).closest("[inert]")).not.toBeNull();

    await user.click(screen.getByRole("button", { name: "More details about Days left" }));

    expect(screen.getByText(infoText).closest("[inert]")).toBeNull();
  });

  it("reveals the headline card's info text after clicking it", async () => {
    const user = userEvent.setup();
    renderWithProviders(<StatsGrid metrics={metrics} />);

    const infoText =
      "How many kilometers per day you now need to average to hit your goal, given what's left of the period and how far you've already run.";

    expect(screen.getByText(infoText).closest("[inert]")).not.toBeNull();

    await user.click(
      screen.getByRole("button", { name: "More details about your daily pace goal" }),
    );

    expect(screen.getByText(infoText).closest("[inert]")).toBeNull();
  });
});
