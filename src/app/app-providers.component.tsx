import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Notifications } from "@mantine/notifications";
import { router } from "@/app/app-router.config";
import { SettingsSync } from "@/app/settings-sync.component";
import { theme } from "@/app/theme.config";
import { useSettings } from "@/stores/settings.store";
import { mapThemeToColorScheme } from "@/utils/settings.utils";
import "@mantine/core/styles.css";
import "@mantine/charts/styles.css";
import "@mantine/dates/styles.css";
import "@mantine/notifications/styles.css";
import "@gfazioli/mantine-flip/styles.css";
import { RouterProvider } from "react-router";
import i18n from "@/config/i18n.config";

const AUTOCLOSE_IN_MILLISECONDS = 2500;

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
      <Notifications position="top-center" autoClose={AUTOCLOSE_IN_MILLISECONDS} />
      <DatesProvider settings={{}}>
        <RouterProvider router={router} />
      </DatesProvider>
    </MantineProvider>
  );
}
