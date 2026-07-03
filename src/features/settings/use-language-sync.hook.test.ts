import { Language } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import { useLanguageSync } from "@features/settings/use-language-sync.hook";
import i18n from "@shared/i18n/i18n.config";
import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";

describe("useLanguageSync", () => {
  it("applies the persisted language to i18next on mount", async () => {
    useSettings.setState({ language: Language.DE });

    renderHook(() => useLanguageSync());

    await waitFor(() => expect(i18n.language).toBe(Language.DE));
  });

  it("changes i18next's active language when the store language changes", async () => {
    useSettings.setState({ language: Language.EN });
    renderHook(() => useLanguageSync());
    await waitFor(() => expect(i18n.language).toBe(Language.EN));

    act(() => {
      useSettings.getState().updateLanguage(Language.PL);
    });

    await waitFor(() => expect(i18n.language).toBe(Language.PL));
  });
});
