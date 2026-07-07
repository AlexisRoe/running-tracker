import { useLanguageSync } from "@/hooks/use-language-sync.hook";
import { useThemeSync } from "@/hooks/use-theme-sync.hook";

export function SettingsSync() {
  useThemeSync();
  useLanguageSync();

  return null;
}
