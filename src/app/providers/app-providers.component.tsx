import { SettingsSync } from "@app/providers/settings-sync.component";
import { theme } from "@app/providers/theme.config";
import { router } from "@app/router/app-router.config";
import { useSettings } from "@features/settings/settings.store";
import { mapThemeToColorScheme } from "@features/settings/settings.utils";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import i18n from "@shared/i18n/i18n.config";
import { RouterProvider } from "react-router";

// Zustand's persist middleware rehydrates synchronously from localStorage,
// so the settings are already available here, before first render — used
// to avoid a flash of the wrong theme/language on initial paint.
const persistedLanguage = useSettings.getState().language;
if (i18n.language !== persistedLanguage) {
  void i18n.changeLanguage(persistedLanguage);
}
const initialColorScheme = mapThemeToColorScheme(useSettings.getState().theme);

export function AppProviders() {
  return (
    <MantineProvider theme={theme} defaultColorScheme={initialColorScheme}>
      <SettingsSync />
      <Notifications />
      <DatesProvider settings={{}}>
        <RouterProvider router={router} />
      </DatesProvider>
    </MantineProvider>
  );
}
