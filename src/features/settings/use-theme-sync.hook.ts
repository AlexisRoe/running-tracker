import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";
import { useSettings } from "./settings.store";
import { mapThemeToColorScheme } from "./settings.utils";

export function useThemeSync(): void {
  const theme = useSettings((state) => state.theme);
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setColorScheme(mapThemeToColorScheme(theme));
  }, [theme, setColorScheme]);
}
