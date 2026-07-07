import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { notifyInfo, notifySuccess } from "@/components/ui/notify";
import { GoalPage } from "@/pages/goal.page";
import { useGoalStore } from "@/stores/goal.store";
import { renderWithProviders } from "@/test/render-with-providers";

vi.mock("@/components/ui/notify", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyInfo: vi.fn(),
  notifyWarning: vi.fn(),
}));

afterEach(() => {
  useGoalStore.getState().resetGoal();
  vi.clearAllMocks();
});

function setExistingGoal() {
  useGoalStore.getState().setGoal({
    start: new Date(2026, 0, 10).getTime(),
    end: new Date(2026, 0, 12).getTime(),
    distance: 20,
  });
}

describe("GoalPage", () => {
  it("renders the goal page title", () => {
    renderWithProviders(<GoalPage />);

    expect(screen.getByRole("heading", { name: "Set Goal" })).toBeInTheDocument();
  });

  it("shows the setup form directly and focuses the start date when no goal is set", () => {
    renderWithProviders(<GoalPage />);

    const startInput = screen.getByLabelText("Start date");
    expect(startInput).toBeInTheDocument();
    expect(startInput).toHaveFocus();
  });

  it("does not show the Clear goal button when no goal is set", () => {
    renderWithProviders(<GoalPage />);

    expect(screen.queryByText("Clear goal")).not.toBeInTheDocument();
  });

  it("disables Save until start, end, and distance are all filled", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    expect(screen.getByRole("button", { name: "Save goal" })).toBeDisabled();

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");
    expect(screen.getByRole("button", { name: "Save goal" })).toBeDisabled();

    await user.type(screen.getByLabelText("Distance", { exact: false }), "20");
    expect(screen.getByRole("button", { name: "Save goal" })).toBeEnabled();
  });

  it("shows a summary notification and switches to the read-only summary on save", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");
    await user.clear(screen.getByLabelText("End date"));
    await user.type(screen.getByLabelText("End date"), "January 12, 2026");
    await user.type(screen.getByLabelText("Distance", { exact: false }), "30");
    await user.click(screen.getByRole("button", { name: "Save goal" }));

    expect(notifySuccess).toHaveBeenCalledTimes(1);
    const call = vi.mocked(notifySuccess).mock.calls[0]?.[0];
    expect(call?.title).toBe("Goal set!");
    expect(call?.message).toContain("3 days");
    expect(call?.message).toContain("30 km");
    expect(call?.message).toContain("averaging 10 km/day");
    expect(call?.autoClose).toBe(1500);

    expect(screen.queryByLabelText("Start date")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
  });

  it("shows a validation error and disables save when the end date is not after the start date", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");
    await user.clear(screen.getByLabelText("End date"));
    await user.type(screen.getByLabelText("End date"), "January 10, 2026");

    expect(screen.getByText("End date must be after the start date")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save goal" })).toBeDisabled();
  });

  it("auto-fills the end date to one year later minus a day when start changes", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");

    expect(screen.getByLabelText("End date")).toHaveValue("January 9, 2027");
  });

  it("keeps a manually edited end date when start changes again", async () => {
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.type(screen.getByLabelText("Start date"), "January 10, 2026");
    await user.clear(screen.getByLabelText("End date"));
    await user.type(screen.getByLabelText("End date"), "March 1, 2026");

    await user.clear(screen.getByLabelText("Start date"));
    await user.type(screen.getByLabelText("Start date"), "February 1, 2026");

    expect(screen.getByLabelText("End date")).toHaveValue("March 1, 2026");
  });

  it("shows the read-only summary with an Edit action when a goal is set", () => {
    setExistingGoal();
    renderWithProviders(<GoalPage />);

    expect(screen.getByText("1/10/2026")).toBeInTheDocument();
    expect(screen.getByText("1/12/2026")).toBeInTheDocument();
    expect(screen.getByText("20 km")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Clear goal" })).not.toBeInTheDocument();
  });

  it("shows the Clear goal action in the edit view when a goal is set", async () => {
    setExistingGoal();
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByRole("button", { name: "Clear goal" })).toBeInTheDocument();
  });

  it("Edit pre-fills the form and Save changes stays disabled until something changes", async () => {
    setExistingGoal();
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.click(screen.getByRole("button", { name: "Edit" }));

    expect(screen.getByLabelText("Start date")).toHaveValue("January 10, 2026");
    expect(screen.getByLabelText("End date")).toHaveValue("January 12, 2026");
    expect(screen.getByLabelText("Distance", { exact: false })).toHaveValue("20 km");
    expect(screen.getByRole("button", { name: "Save changes" })).toBeDisabled();

    await user.clear(screen.getByLabelText("Distance", { exact: false }));
    await user.type(screen.getByLabelText("Distance", { exact: false }), "25");

    expect(screen.getByRole("button", { name: "Save changes" })).toBeEnabled();
  });

  it("Cancel discards edits and returns to the unchanged summary", async () => {
    setExistingGoal();
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.clear(screen.getByLabelText("Distance", { exact: false }));
    await user.type(screen.getByLabelText("Distance", { exact: false }), "99");
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("20 km")).toBeInTheDocument();
    expect(useGoalStore.getState().goal.distance).toBe(20);
  });

  it("requires confirmation before clearing the goal", async () => {
    setExistingGoal();
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Clear goal" }));

    expect(
      screen.getByText("Do you really want to clear your goal? This cannot be undone."),
    ).toBeInTheDocument();
    expect(useGoalStore.getState().goal.state).toBe("_in_progress");

    await user.click(screen.getByRole("button", { name: "Clear" }));

    expect(useGoalStore.getState().goal.state).toBe("_blank");
    expect(notifyInfo).toHaveBeenCalledWith({
      title: "Goal cleared",
      message:
        "Your goal has been removed, so your runs are no longer measured against a daily target. Set a new goal any time to start tracking progress again.",
      autoClose: 1500,
    });
    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
  });

  it("cancelling the clear confirmation keeps the goal", async () => {
    setExistingGoal();
    const user = userEvent.setup();
    renderWithProviders(<GoalPage />);

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.click(screen.getByRole("button", { name: "Clear goal" }));
    await user.click(within(screen.getByRole("dialog")).getByRole("button", { name: "Cancel" }));

    expect(useGoalStore.getState().goal.state).toBe("_in_progress");
    expect(
      screen.queryByText("Do you really want to clear your goal? This cannot be undone."),
    ).not.toBeInTheDocument();
  });
});
