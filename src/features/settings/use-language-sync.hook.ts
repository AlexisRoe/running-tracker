import i18n from "@shared/i18n/i18n.config";
import { useEffect } from "react";
import { useSettings } from "./settings.store";

export function useLanguageSync(): void {
  const language = useSettings((state) => state.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);
}
