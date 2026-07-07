import { ValidationError } from "@/config/validation.error";
import { useSettings } from "@/stores/settings.store";
import { Theme } from "@/types/settings.model";
import { isEnum } from "@/utils/validation.utils";

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
