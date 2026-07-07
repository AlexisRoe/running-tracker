import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ValidationError } from "@/config/validation.error";
import { useTheme } from "@/hooks/use-theme.hook";
import { useSettings } from "@/stores/settings.store";
import { Theme } from "@/types/settings.model";

describe("useTheme", () => {
  it("value reflects the current store theme", () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.value).toBe(Theme.System);
  });

  it("change() updates the store for each valid theme", () => {
    const { result } = renderHook(() => useTheme());

    for (const theme of Object.values(Theme)) {
      act(() => {
        result.current.change(theme);
      });
      expect(useSettings.getState().theme).toBe(theme);
    }
  });

  it("change() throws a ValidationError with reference prefix B9893BEF- for invalid input", () => {
    const { result } = renderHook(() => useTheme());

    try {
      result.current.change("not-a-theme");
      throw new Error("expected change() to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).name).toBe("ValidationError");
      expect((err as ValidationError).reference.startsWith("B9893BEF-")).toBe(true);
    }
  });

  it("change() does not mutate the store when the input is invalid", () => {
    const { result } = renderHook(() => useTheme());
    const before = useSettings.getState().theme;

    try {
      result.current.change(42);
    } catch {
      // expected
    }

    expect(useSettings.getState().theme).toBe(before);
  });
});
