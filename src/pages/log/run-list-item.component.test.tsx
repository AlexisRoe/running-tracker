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
    renderWithProviders(<RunListItem run={run} onRemove={vi.fn()} />);

    const expectedDate = new Date(run.date).toLocaleDateString("en", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    expect(screen.getByText(expectedDate)).toBeInTheDocument();
    expect(screen.getByText("5.5 km · Outdoor")).toBeInTheDocument();
  });

  it("renders 'Indoor' for an indoor run", () => {
    renderWithProviders(<RunListItem run={{ ...run, where: "indoor" }} onRemove={vi.fn()} />);

    expect(screen.getByText("5.5 km · Indoor")).toBeInTheDocument();
  });

  it("calls onRemove with the run's id when the trash button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();
    renderWithProviders(<RunListItem run={run} onRemove={onRemove} />);

    await user.click(screen.getByRole("button", { name: "Delete run" }));

    expect(onRemove).toHaveBeenCalledWith(run.id);
  });
});
