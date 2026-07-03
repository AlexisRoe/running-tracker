import { theme as mantineTheme } from "@app/providers/theme.config";
import { Theme } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import { useThemeSync } from "@features/settings/use-theme-sync.hook";
import { MantineProvider, useMantineColorScheme } from "@mantine/core";
import { act, renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

function Wrapper({ children }: { children: ReactNode }) {
  return <MantineProvider theme={mantineTheme}>{children}</MantineProvider>;
}

function useProbe() {
  useThemeSync();
  return useMantineColorScheme().colorScheme;
}

describe("useThemeSync", () => {
  it("applies the persisted theme as Mantine's color scheme on mount", () => {
    useSettings.setState({ theme: Theme.Dark });

    const { result } = renderHook(() => useProbe(), { wrapper: Wrapper });

    expect(result.current).toBe("dark");
  });

  it("updates Mantine's color scheme when the store theme changes", () => {
    useSettings.setState({ theme: Theme.Light });
    const { result } = renderHook(() => useProbe(), { wrapper: Wrapper });

    expect(result.current).toBe("light");

    act(() => {
      useSettings.getState().updateTheme(Theme.Dark);
    });

    expect(result.current).toBe("dark");
  });
});
