import { useEffect } from "react";
import i18n from "@/config/i18n.config";
import { useSettings } from "@/stores/settings.store";

export function useLanguageSync(): void {
  const language = useSettings((state) => state.language);

  useEffect(() => {
    if (i18n.language !== language) {
      void i18n.changeLanguage(language);
    }
  }, [language]);
}
