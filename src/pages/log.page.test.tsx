import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { LogPage } from "@/pages/log.page";
import { useRunsStore } from "@/stores/runs.store";
import { renderWithProviders } from "@/test/render-with-providers";

const now = new Date();
const currentMonthDate = new Date(now.getFullYear(), now.getMonth(), 1);
const otherMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);

afterEach(() => {
  useRunsStore.setState({ events: [] });
});

describe("LogPage", () => {
  it("renders the log page heading", () => {
    renderWithProviders(<LogPage />);

    expect(screen.getByText("Run Log")).toBeInTheDocument();
  });

  it("shows the empty state when no runs are stored", () => {
    renderWithProviders(<LogPage />);

    expect(screen.getByText("No runs logged yet")).toBeInTheDocument();
    expect(screen.getByText("Your tracked running events will appear here.")).toBeInTheDocument();
  });

  it("groups seeded runs by year and month, newest first", () => {
    useRunsStore
      .getState()
      .addRun({ date: new Date(2026, 0, 10).getTime(), where: "indoor", distance: 3 });
    useRunsStore
      .getState()
      .addRun({ date: new Date(2026, 1, 10).getTime(), where: "outdoor", distance: 4 });

    renderWithProviders(<LogPage />);

    expect(screen.getByText("2026")).toBeInTheDocument();
    expect(screen.getByText("February - 4 km")).toBeInTheDocument();
    expect(screen.getByText("January - 3 km")).toBeInTheDocument();
  });

  it("expands the current month by default and keeps other months collapsed", () => {
    useRunsStore
      .getState()
      .addRun({ date: currentMonthDate.getTime(), where: "indoor", distance: 3 });
    useRunsStore
      .getState()
      .addRun({ date: otherMonthDate.getTime(), where: "indoor", distance: 7 });

    renderWithProviders(<LogPage />);

    expect(screen.getByText("3 km · Indoor")).toBeVisible();
    expect(screen.queryByText("7 km · Indoor")).not.toBeVisible();
  });

  it("opens the edit drawer with the run's values when the edit button is clicked", async () => {
    useRunsStore
      .getState()
      .addRun({ date: currentMonthDate.getTime(), where: "indoor", distance: 3 });
    const user = userEvent.setup();
    renderWithProviders(<LogPage />);

    await user.click(screen.getByRole("button", { name: "Edit run" }));

    expect(screen.getByText("Edit Run")).toBeInTheDocument();
  });

  it("deleting a run requires confirmation from within the edit drawer", async () => {
    useRunsStore
      .getState()
      .addRun({ date: currentMonthDate.getTime(), where: "indoor", distance: 3 });
    const user = userEvent.setup();
    renderWithProviders(<LogPage />);

    await user.click(screen.getByRole("button", { name: "Edit run" }));
    await user.click(screen.getByRole("button", { name: "Delete run" }));
    expect(useRunsStore.getState().events).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(useRunsStore.getState().events).toHaveLength(0);
    expect(screen.getByText("No runs logged yet")).toBeInTheDocument();
  });
});
