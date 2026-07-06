import type { RunningEvent } from "@features/runs/runs.model";
import { RunListItem } from "@pages/log/run-list-item.component";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

const run: RunningEvent = {
  id: "run-1",
  date: new Date(2026, 6, 3).getTime(),
  where: "outdoor",
  distance: 5.5,
};

describe("RunListItem", () => {
  it("renders the formatted date, distance and location", () => {
    renderWithProviders(<RunListItem run={run} onEdit={vi.fn()} />);

    const expectedDate = new Date(run.date).toLocaleDateString("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
    expect(screen.getByText("5.5 km · Outdoor")).toBeInTheDocument();
  });

  it("renders 'Indoor' for an indoor run", () => {
    renderWithProviders(<RunListItem run={{ ...run, where: "indoor" }} onEdit={vi.fn()} />);

    expect(screen.getByText("5.5 km · Indoor")).toBeInTheDocument();
  });

  it("calls onEdit with the run when the edit button is clicked", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    renderWithProviders(<RunListItem run={run} onEdit={onEdit} />);

    await user.click(screen.getByRole("button", { name: "Edit run" }));

    expect(onEdit).toHaveBeenCalledWith(run);
  });
});
