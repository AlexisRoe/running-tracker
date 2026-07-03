import { ValidationError } from "@shared/errors/validation.error";
import { isEnum } from "@shared/lib/validation.utils";
import { Theme } from "./settings.model";
import { useSettings } from "./settings.store";

interface UseTheme {
  value: Theme;
  change: (theme: unknown) => void;
}

export function useTheme(): UseTheme {
  const { theme, updateTheme } = useSettings();

  const change = (input: unknown) => {
    if (isEnum(input, Theme) === false) {
      throw new ValidationError("Not a valid theme", "B9893BEF-5DC6-4E03-9440-3CB4FD80C8E3");
    }

    updateTheme(input);
  };

  return {
    value: theme,
    change,
  };
}
