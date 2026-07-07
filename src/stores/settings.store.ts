import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, Theme } from "@/types/settings.model";

/** Persisted user preferences. */
type SettingsState = {
  /** Selected color theme (light, dark, or follow-system). */
  theme: Theme;
  /** Selected UI language. */
  language: Language;
};

/** Mutations for the settings store. */
type SettingsActions = {
  /** Sets the color theme preference. */
  updateTheme(theme: Theme): void;
  /** Sets the UI language preference. */
  updateLanguage(language: Language): void;
};

/** Persisted store of user settings — theme and language (localStorage-backed). */
export const useSettings = create<SettingsState & SettingsActions>()(
  persist(
    (set) => ({
      theme: Theme.System,
      language: Language.EN,
      updateTheme: (theme) => set({ theme }),
      updateLanguage: (language) => set({ language }),
    }),
    { name: "runner-tracking-settings-store" },
  ),
);
