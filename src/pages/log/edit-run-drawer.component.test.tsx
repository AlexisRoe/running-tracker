import type { RunningEvent } from "@features/runs/runs.model";
import { useRunsStore } from "@features/runs/runs.store";
import { EditRunDrawer } from "@pages/log/edit-run-drawer.component";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

const run: RunningEvent = {
  id: "run-1",
  date: new Date(2026, 0, 15).getTime(),
  where: "outdoor",
  distance: 5.5,
};

afterEach(() => {
  useRunsStore.setState({ events: [] });
});

describe("EditRunDrawer", () => {
  it("renders nothing when no run is being edited", () => {
    renderWithProviders(<EditRunDrawer run={null} onClose={vi.fn()} />);

    expect(screen.queryByText("Edit Run")).not.toBeInTheDocument();
  });

  it("prefills the form with the run's values", () => {
    renderWithProviders(<EditRunDrawer run={run} onClose={vi.fn()} />);

    expect(screen.getByText("Edit Run")).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Outdoor" })).toBeChecked();
  });

  it("saves changes and closes the drawer", async () => {
    useRunsStore.setState({ events: [run] });
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<EditRunDrawer run={run} onClose={onClose} />);

    const distanceInput = screen.getByLabelText("Distance", { exact: false });
    await user.clear(distanceInput);
    await user.type(distanceInput, "8");
    await user.click(screen.getByRole("button", { name: "Save changes" }));

    expect(useRunsStore.getState().events[0]).toMatchObject({ distance: 8, where: "outdoor" });
    expect(onClose).toHaveBeenCalled();
  });

  it("requires confirmation before deleting", async () => {
    useRunsStore.setState({ events: [run] });
    const user = userEvent.setup();
    const onClose = vi.fn();
    renderWithProviders(<EditRunDrawer run={run} onClose={onClose} />);

    await user.click(screen.getByRole("button", { name: "Delete run" }));

    expect(screen.getByText("Do you really want to delete this run?")).toBeInTheDocument();
    expect(useRunsStore.getState().events).toHaveLength(1);
    expect(onClose).not.toHaveBeenCalled();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    expect(useRunsStore.getState().events).toHaveLength(0);
    expect(onClose).toHaveBeenCalled();
  });

  it("cancelling the confirmation keeps the run", async () => {
    useRunsStore.setState({ events: [run] });
    const user = userEvent.setup();
    renderWithProviders(<EditRunDrawer run={run} onClose={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Delete run" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(useRunsStore.getState().events).toHaveLength(1);
    expect(screen.queryByText("Do you really want to delete this run?")).not.toBeInTheDocument();
  });
});
