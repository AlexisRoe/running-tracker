import { useGoalStore } from "@features/goal/goal.store";
import { useRunsStore } from "@features/runs/runs.store";
import { notifySuccess, notifyWarning } from "@shared/ui/notification/notify";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddDrawer } from "@widgets/app-shell/add-drawer.component";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

vi.mock("@shared/ui/notification/notify", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyWarning: vi.fn(),
}));

afterEach(() => {
  useRunsStore.setState({ events: [] });
  useGoalStore.getState().resetGoal();
  vi.clearAllMocks();
});

describe("AddDrawer", () => {
  it("renders the drawer content when opened", () => {
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Add Run")).toBeInTheDocument();
  });

  it("does not render drawer content when closed", () => {
    renderWithProviders(<AddDrawer opened={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Add Run")).not.toBeInTheDocument();
  });

  it("disables save until a distance is entered", () => {
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Add run" })).toBeDisabled();
  });

  it("defaults location to indoor", () => {
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "Indoor" })).toBeChecked();
  });

  it("adds a run and closes the drawer on save", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AddDrawer opened onClose={onClose} />);

    await user.type(screen.getByLabelText("Distance"), "5");
    await user.click(screen.getByRole("radio", { name: "Outdoor" }));
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(useRunsStore.getState().events[0]).toMatchObject({ distance: 5, where: "outdoor" });
    expect(onClose).toHaveBeenCalled();
  });

  it("keeps the drawer open and does not add a run for an invalid distance", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AddDrawer opened onClose={onClose} />);

    await user.type(screen.getByLabelText("Distance"), "0");
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(useRunsStore.getState().events).toHaveLength(0);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not show a goal-progress notification when no goal is set", async () => {
    const user = userEvent.setup();
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Distance"), "5");
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(notifySuccess).not.toHaveBeenCalled();
    expect(notifyWarning).not.toHaveBeenCalled();
  });

  it("shows a success notification when the run meets the daily goal", async () => {
    const now = Date.now();
    useGoalStore.getState().setGoal({ start: now, end: now, distance: 10 });
    const user = userEvent.setup();
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Distance"), "10");
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(notifySuccess).toHaveBeenCalledWith({
      title: "Good done! 🎉",
      message: "10.00 km run · 10.00 km/day goal",
    });
  });

  it("shows a warning notification when the run misses the daily goal", async () => {
    const now = Date.now();
    useGoalStore.getState().setGoal({ start: now, end: now, distance: 10 });
    const user = userEvent.setup();
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Distance"), "5");
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(notifyWarning).toHaveBeenCalledWith({
      title: "Better next time",
      message: "5.00 km run · 10.00 km/day goal",
    });
  });
});
