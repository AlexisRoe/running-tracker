import { useLanguageSync } from "@/hooks/use-language-sync.hook";
import { useThemeSync } from "@/hooks/use-theme-sync.hook";

/** Headless component that keeps the runtime theme and language in sync with settings. */
export function SettingsSync() {
  useThemeSync();
  useLanguageSync();

  return null;
}
