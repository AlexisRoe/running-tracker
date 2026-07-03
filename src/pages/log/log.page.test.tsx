import { useRunsStore } from "@features/runs/runs.store";
import { LogPage } from "@pages/log/log.page";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

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

  it("groups seeded runs by month, newest month first", () => {
    useRunsStore
      .getState()
      .addRun({ date: new Date(2026, 0, 10).getTime(), where: "indoor", distance: 3 });
    useRunsStore
      .getState()
      .addRun({ date: new Date(2026, 1, 10).getTime(), where: "outdoor", distance: 4 });

    renderWithProviders(<LogPage />);

    const headings = screen.getAllByText(/^[A-Za-z]+ 2026$/);
    expect(headings[0]).toHaveTextContent("February 2026");
    expect(headings[1]).toHaveTextContent("January 2026");
  });

  it("orders runs within a month newest first", () => {
    useRunsStore
      .getState()
      .addRun({ date: new Date(2026, 0, 5).getTime(), where: "indoor", distance: 3 });
    useRunsStore
      .getState()
      .addRun({ date: new Date(2026, 0, 20).getTime(), where: "indoor", distance: 7 });

    renderWithProviders(<LogPage />);

    const distances = screen.getAllByText(/km ·/).map((el) => el.textContent);
    expect(distances[0]).toMatch(/^7 km/);
    expect(distances[1]).toMatch(/^3 km/);
  });

  it("removing a run via the trash icon updates the list", async () => {
    useRunsStore
      .getState()
      .addRun({ date: new Date(2026, 0, 5).getTime(), where: "indoor", distance: 3 });
    const user = userEvent.setup();
    renderWithProviders(<LogPage />);

    await user.click(screen.getByRole("button", { name: "Delete run" }));

    expect(useRunsStore.getState().events).toHaveLength(0);
    expect(screen.getByText("No runs logged yet")).toBeInTheDocument();
  });
});
