import { useGoalStore } from "@features/goal/goal.store";
import { notifyInfo, notifySuccess } from "@shared/ui/notification/notify";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";
import { GoalPage } from "./goal.page";

vi.mock("@shared/ui/notification/notify", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyInfo: vi.fn(),
  notifyWarning: vi.fn(),
}));

afterEach(() => {
  useGoalStore.getState().resetGoal();
  vi.clearAllMocks();
});

describe("GoalPage", () => {
  it("renders the goal page title", () => {
    renderWithProviders(<GoalPage />);

    expect(screen.getByRole("heading", { name: "Set Goal" })).toBeInTheDocument();
  });

  it("does not show the reset button when no goal is set", () => {
    renderWithProviders(<GoalPage />);

    expect(screen.queryByText("Reset goal")).not.toBeInTheDocument();
  });

  it("shows the reset button, clears the goal, and shows a reset notification", async () => {
    useGoalStore
      .getState()
      .setGoal({ start: Date.now(), end: Date.now() + 86400000, distance: 20 });
    renderWithProviders(<GoalPage />);

    expect(screen.getByText("Reset goal")).toBeInTheDocument();
    screen.getByText("Reset goal").click();

    expect(useGoalStore.getState().goal.state).toBe("_blank");
    expect(notifyInfo).toHaveBeenCalledWith({
      title: "Goal cleared",
      message:
        "Your goal has been removed, so your runs are no longer measured against a daily target. Set a new goal any time to start tracking progress again.",
      autoClose: 8000,
    });
  });

  it("shows a summary notification with the timeframe, distance, and daily average on save", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");
    await user.type(screen.getByLabelText("End date"), "January 12, 2026");
    await user.type(screen.getByLabelText("Distance"), "30");
    await user.click(screen.getByRole("button", { name: "Save goal" }));

    expect(notifySuccess).toHaveBeenCalledTimes(1);
    const call = vi.mocked(notifySuccess).mock.calls[0]?.[0];
    expect(call?.title).toBe("Goal set!");
    expect(call?.message).toContain("3 days");
    expect(call?.message).toContain("30.00 km");
    expect(call?.message).toContain("averaging 10.00 km/day");
    expect(call?.autoClose).toBe(8000);
  });

  it("shows a validation error and disables save when the end date is not after the start date", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");
    await user.type(screen.getByLabelText("End date"), "January 10, 2026");

    expect(screen.getByText("End date must be after the start date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save goal" })).toBeDisabled();
  });
});
