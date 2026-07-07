import { ValidationError } from "@/config/validation.error";
import { useSettings } from "@/stores/settings.store";
import { Language } from "@/types/settings.model";
import { isEnum } from "@/utils/validation.utils";

/** The active UI language plus a validated setter. */
interface UseLanguage {
  /** The currently selected language. */
  value: Language;
  /** Validates and persists a new language; throws ValidationError on unknown values. */
  change: (language: unknown) => void;
}

/** Reads the selected language and exposes a validated change action. */
export function useLanguage(): UseLanguage {
  const { language, updateLanguage } = useSettings();

  const change = (input: unknown) => {
    if (isEnum(input, Language) === false) {
      throw new ValidationError("Not a valid language", "946ED344-2127-48B7-AA37-48530FD04103");
    }

    updateLanguage(input);
  };

  return {
    value: language,
    change,
  };
}
