import { Language } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import { useLanguage } from "@features/settings/use-language.hook";
import { ValidationError } from "@shared/errors/validation.error";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("useLanguage", () => {
  it("value reflects the current store language", () => {
    const { result } = renderHook(() => useLanguage());

    expect(result.current.value).toBe(Language.EN);
  });

  it("change() updates the store for each valid language", () => {
    const { result } = renderHook(() => useLanguage());

    for (const language of Object.values(Language)) {
      act(() => {
        result.current.change(language);
      });
      expect(useSettings.getState().language).toBe(language);
    }
  });

  it("change() throws a ValidationError with reference prefix 946ED344- for invalid input", () => {
    const { result } = renderHook(() => useLanguage());

    try {
      result.current.change("not-a-language");
      throw new Error("expected change() to throw");
    } catch (err) {
      expect(err).toBeInstanceOf(ValidationError);
      expect((err as ValidationError).name).toBe("ValidationError");
      expect((err as ValidationError).reference.startsWith("946ED344-")).toBe(true);
    }
  });

  it("change() does not mutate the store when the input is invalid", () => {
    const { result } = renderHook(() => useLanguage());
    const before = useSettings.getState().language;

    try {
      result.current.change(42);
    } catch {
      // expected
    }

    expect(useSettings.getState().language).toBe(before);
  });
});
