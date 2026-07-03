import { useLanguageSync } from "@features/settings/use-language-sync.hook";
import { useThemeSync } from "@features/settings/use-theme-sync.hook";

export function SettingsSync() {
  useThemeSync();
  useLanguageSync();

  return null;
}
