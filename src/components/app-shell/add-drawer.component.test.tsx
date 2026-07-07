import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AddDrawer } from "@/components/app-shell/add-drawer.component";
import { fireConfetti } from "@/components/ui/confetti";
import { notifySuccess, notifyWarning } from "@/components/ui/notify";
import { useGoalStore } from "@/stores/goal.store";
import { useRunsStore } from "@/stores/runs.store";
import { renderWithProviders } from "@/test/render-with-providers";
import { toGoalEnd, toGoalStart } from "@/utils/goal.utils";

vi.mock("@/components/ui/notify", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyWarning: vi.fn(),
}));

vi.mock("@/components/ui/confetti", () => ({
  fireConfetti: vi.fn(),
}));

function setActiveGoal(distance: number) {
  const now = Date.now();
  useGoalStore.getState().setGoal({ start: toGoalStart(now), end: toGoalEnd(now), distance });
}

afterEach(() => {
  useRunsStore.setState({ events: [] });
  useGoalStore.getState().resetGoal();
  vi.clearAllMocks();
});

describe("AddDrawer", () => {
  it("renders the drawer content when opened", () => {
    setActiveGoal(10);
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Add Run")).toBeInTheDocument();
  });

  it("does not render drawer content when closed", () => {
    setActiveGoal(10);
    renderWithProviders(<AddDrawer opened={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Add Run")).not.toBeInTheDocument();
  });

  it("disables save until a distance is entered", () => {
    setActiveGoal(10);
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Add run" })).toBeDisabled();
  });

  it("defaults location to indoor", () => {
    setActiveGoal(10);
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "Indoor" })).toBeChecked();
  });

  it("adds a run and closes the drawer on save", async () => {
    setActiveGoal(10);
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AddDrawer opened onClose={onClose} />);

    await user.type(screen.getByLabelText("Distance", { exact: false }), "5");
    await user.click(screen.getByRole("radio", { name: "Outdoor" }));
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(useRunsStore.getState().events[0]).toMatchObject({ distance: 5, where: "outdoor" });
    expect(onClose).toHaveBeenCalled();
  });

  it("keeps the drawer open and does not add a run for an invalid distance", async () => {
    setActiveGoal(10);
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<AddDrawer opened onClose={onClose} />);

    await user.type(screen.getByLabelText("Distance", { exact: false }), "0");
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(useRunsStore.getState().events).toHaveLength(0);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("shows a success notification when the run meets the daily goal", async () => {
    setActiveGoal(10);
    const user = userEvent.setup();
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Distance", { exact: false }), "10");
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(notifySuccess).toHaveBeenCalledWith({
      title: "Well done! 🎉",
      message: "10 km run · 10 km/day goal",
    });
    expect(fireConfetti).toHaveBeenCalled();
  });

  it("shows a warning notification when the run misses the daily goal", async () => {
    setActiveGoal(10);
    const user = userEvent.setup();
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    await user.type(screen.getByLabelText("Distance", { exact: false }), "5");
    await user.click(screen.getByRole("button", { name: "Add run" }));

    expect(notifyWarning).toHaveBeenCalledWith({
      title: "Better next time",
      message: "5 km run · 10 km/day goal",
    });
    expect(fireConfetti).not.toHaveBeenCalled();
  });

  it("shows an empty state instead of the form when no goal is set", () => {
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Nothing to add")).toBeInTheDocument();
    expect(screen.queryByLabelText("Distance")).not.toBeInTheDocument();
  });

  it("shows an empty state when a goal exists but today is outside its period", () => {
    const tomorrow = Date.now() + 24 * 60 * 60 * 1000;
    useGoalStore.getState().setGoal({
      start: toGoalStart(tomorrow),
      end: toGoalEnd(tomorrow),
      distance: 10,
    });
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Nothing to add")).toBeInTheDocument();
    expect(screen.queryByLabelText("Distance")).not.toBeInTheDocument();
  });
});
