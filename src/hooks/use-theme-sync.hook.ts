import { useMantineColorScheme } from "@mantine/core";
import { useEffect } from "react";
import { useSettings } from "@/stores/settings.store";
import { mapThemeToColorScheme } from "@/utils/settings.utils";

export function useThemeSync(): void {
  const theme = useSettings((state) => state.theme);
  const { setColorScheme } = useMantineColorScheme();

  useEffect(() => {
    setColorScheme(mapThemeToColorScheme(theme));
  }, [theme, setColorScheme]);
}
