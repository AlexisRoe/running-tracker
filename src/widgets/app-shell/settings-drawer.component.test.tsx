import { screen } from "@testing-library/react";
import { SettingsDrawer } from "@widgets/app-shell/settings-drawer.component";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

describe("SettingsDrawer", () => {
  it("renders the drawer content when opened", () => {
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("does not render drawer content when closed", () => {
    renderWithProviders(<SettingsDrawer opened={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });
});
