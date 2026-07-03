import { useGoalStore } from "@features/goal/goal.store";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GoalDrawer } from "@widgets/app-shell/goal-drawer.component";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

afterEach(() => {
  useGoalStore.getState().resetGoal();
});

describe("GoalDrawer", () => {
  it("renders the drawer content when opened", () => {
    renderWithProviders(<GoalDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Set Goal")).toBeInTheDocument();
  });

  it("does not render drawer content when closed", () => {
    renderWithProviders(<GoalDrawer opened={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Set Goal")).not.toBeInTheDocument();
  });

  it("does not show the reset button when no goal is set", () => {
    renderWithProviders(<GoalDrawer opened onClose={vi.fn()} />);

    expect(screen.queryByText("Reset goal")).not.toBeInTheDocument();
  });

  it("shows the reset button and clears the goal when a goal is already set", async () => {
    useGoalStore
      .getState()
      .setGoal({ start: Date.now(), end: Date.now() + 86400000, distance: 20 });
    const onClose = vi.fn();
    renderWithProviders(<GoalDrawer opened onClose={onClose} />);

    expect(screen.getByText("Reset goal")).toBeInTheDocument();
    screen.getByText("Reset goal").click();

    expect(useGoalStore.getState().goal.state).toBe("_blank");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows the not-set status when no goal is set", () => {
    renderWithProviders(<GoalDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("No goal set yet")).toBeInTheDocument();
  });

  it("shows the running status and required km/day when the goal is active", () => {
    useGoalStore
      .getState()
      .setGoal({ start: Date.now() - 86400000, end: Date.now() + 86400000, distance: 10 });
    renderWithProviders(<GoalDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Goal in progress")).toBeInTheDocument();
    expect(screen.getByText("3.33 km/day required")).toBeInTheDocument();
  });

  it("shows the ended status when the goal timeframe is in the past", () => {
    useGoalStore
      .getState()
      .setGoal({ start: Date.now() - 172800000, end: Date.now() - 86400000, distance: 10 });
    renderWithProviders(<GoalDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Goal ended")).toBeInTheDocument();
  });

  it("shows a validation error and disables save when the end date is not after the start date", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalDrawer opened onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");
    await user.type(screen.getByLabelText("End date"), "January 10, 2026");

    expect(screen.getByText("End date must be after the start date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save goal" })).toBeDisabled();
  });
});
