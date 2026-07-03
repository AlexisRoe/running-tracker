import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Language, Theme } from "./settings.model";

type SettingsState = {
  theme: Theme;
  language: Language;
};

type SettingsActions = {
  updateTheme(theme: Theme): void;
  updateLanguage(language: Language): void;
};

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
