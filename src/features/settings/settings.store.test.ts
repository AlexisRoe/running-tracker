import { Language, Theme } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import { describe, expect, it } from "vitest";

describe("useSettings", () => {
  it("defaults to System theme and English language", () => {
    const state = useSettings.getState();

    expect(state.theme).toBe(Theme.System);
    expect(state.language).toBe(Language.EN);
  });

  it("updateTheme sets the theme directly without validation", () => {
    useSettings.getState().updateTheme(Theme.Dark);

    expect(useSettings.getState().theme).toBe(Theme.Dark);
  });

  it("updateLanguage sets the language directly without validation", () => {
    useSettings.getState().updateLanguage(Language.DE);

    expect(useSettings.getState().language).toBe(Language.DE);
  });

  it("persists settings to localStorage", () => {
    useSettings.getState().updateTheme(Theme.Light);

    const raw = localStorage.getItem("runner-tracking-settings-store");
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw as string);
    expect(parsed.state.theme).toBe(Theme.Light);
  });
});
