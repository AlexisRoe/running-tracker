import type { MantineColorScheme } from "@mantine/core";
import { Theme } from "@/types/settings.model";

/** Translates the app's theme preference into Mantine's color-scheme value. */
export function mapThemeToColorScheme(theme: Theme): MantineColorScheme {
  switch (theme) {
    case Theme.Light:
      return "light";
    case Theme.Dark:
      return "dark";
    case Theme.System:
      return "auto";
  }
}
