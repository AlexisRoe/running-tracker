import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ScheduleBanner } from "@/components/dashboard/schedule-banner.component";
import { renderWithProviders } from "@/test/render-with-providers";
import type { DashboardMetrics } from "@/types/dashboard.model";

const base: DashboardMetrics = {
  hasActiveGoal: true,
  isFinished: false,
  goalDistance: 30,
  totalDays: 30,
  daysElapsed: 10,
  daysLeft: 20,
  distanceRun: 5,
  distanceOpen: 25,
  daysWithRuns: 2,
  daysWithoutRuns: 8,
  indoorCount: 1,
  outdoorCount: 1,
  indoorDistance: 2,
  outdoorDistance: 3,
  baselinePerDay: 1,
  requiredPerRemainingDay: 1.2,
  schedule: { state: "behind", deltaKm: -5, deltaDays: -5 },
};

describe("ScheduleBanner", () => {
  it("urges the runner on when behind schedule", () => {
    renderWithProviders(<ScheduleBanner metrics={base} />);

    expect(screen.getByText("Run faster!!!")).toBeInTheDocument();
    expect(screen.getByText(/5 km behind/)).toBeInTheDocument();
  });

  it("praises the runner when ahead of schedule", () => {
    const ahead: DashboardMetrics = {
      ...base,
      schedule: { state: "ahead", deltaKm: 5, deltaDays: 5 },
    };
    renderWithProviders(<ScheduleBanner metrics={ahead} />);

    expect(screen.getByText("Good Job.")).toBeInTheDocument();
    expect(screen.getByText(/5 km ahead/)).toBeInTheDocument();
  });
});
