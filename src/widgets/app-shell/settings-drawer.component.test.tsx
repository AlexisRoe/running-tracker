import { Language, Theme } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import { BUILD_INFO } from "@shared/build-info/build-info.const";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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

  it("renders the theme, language, and build info cards", () => {
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Build Info")).toBeInTheDocument();
  });

  it("updates the store when a theme option is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    await user.click(screen.getByText("Dark"));
    expect(useSettings.getState().theme).toBe(Theme.Dark);

    await user.click(screen.getByText("Light"));
    expect(useSettings.getState().theme).toBe(Theme.Light);
  });

  it("updates the store when a language option is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    await user.click(screen.getByRole("combobox", { name: "Language" }));
    await user.click(screen.getByText("German"));

    expect(useSettings.getState().language).toBe(Language.DE);
  });

  it("shows the build info version, commit hash, and built-at date", () => {
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText(BUILD_INFO.version)).toBeInTheDocument();
    expect(screen.getByText(BUILD_INFO.commitHash)).toBeInTheDocument();
    expect(screen.getByText(new Date(BUILD_INFO.builtAt).toLocaleString("en"))).toBeInTheDocument();
  });
});
