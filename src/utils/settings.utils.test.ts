import { describe, expect, it } from "vitest";
import { Theme } from "@/types/settings.model";
import { mapThemeToColorScheme } from "@/utils/settings.utils";

describe("mapThemeToColorScheme", () => {
  it("maps Light to 'light'", () => {
    expect(mapThemeToColorScheme(Theme.Light)).toBe("light");
  });

  it("maps Dark to 'dark'", () => {
    expect(mapThemeToColorScheme(Theme.Dark)).toBe("dark");
  });

  it("maps System to 'auto'", () => {
    expect(mapThemeToColorScheme(Theme.System)).toBe("auto");
  });
});
