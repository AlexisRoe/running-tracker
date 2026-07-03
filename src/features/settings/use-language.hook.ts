import { ValidationError } from "@shared/errors/validation.error";
import { isEnum } from "@shared/lib/validation.utils";
import { Language } from "./settings.model";
import { useSettings } from "./settings.store";

interface UseLanguage {
  value: Language;
  change: (language: unknown) => void;
}

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
