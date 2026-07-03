import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppHeader } from "@widgets/app-shell/app-header.component";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

describe("AppHeader", () => {
  it("renders the app title, settings button, and goal button", () => {
    renderWithProviders(<AppHeader onSettingsClick={vi.fn()} onGoalClick={vi.fn()} />);

    expect(screen.getByText("Running Tracker")).toBeInTheDocument();
    expect(screen.getByLabelText("Open settings")).toBeInTheDocument();
    expect(screen.getByLabelText("Set goal")).toBeInTheDocument();
  });

  it("calls onSettingsClick when the settings button is clicked", async () => {
    const user = userEvent.setup();
    const onSettingsClick = vi.fn();
    renderWithProviders(<AppHeader onSettingsClick={onSettingsClick} onGoalClick={vi.fn()} />);

    await user.click(screen.getByLabelText("Open settings"));

    expect(onSettingsClick).toHaveBeenCalledOnce();
  });

  it("calls onGoalClick when the goal button is clicked", async () => {
    const user = userEvent.setup();
    const onGoalClick = vi.fn();
    renderWithProviders(<AppHeader onSettingsClick={vi.fn()} onGoalClick={onGoalClick} />);

    await user.click(screen.getByLabelText("Set goal"));

    expect(onGoalClick).toHaveBeenCalledOnce();
  });
});
