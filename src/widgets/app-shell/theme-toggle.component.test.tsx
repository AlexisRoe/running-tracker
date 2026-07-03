import { Theme } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeToggle } from "@widgets/app-shell/theme-toggle.component";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

describe("ThemeToggle", () => {
  it("renders a toggle button", () => {
    renderWithProviders(<ThemeToggle />);

    expect(screen.getByLabelText("Toggle color scheme")).toBeInTheDocument();
  });

  it("clicking toggles Mantine's color scheme without touching the app's settings store", async () => {
    const user = userEvent.setup();
    renderWithProviders(<ThemeToggle />);
    const button = screen.getByLabelText("Toggle color scheme");

    await user.click(button);

    expect(useSettings.getState().theme).toBe(Theme.System);
  });
});
