import { act, renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import i18n from "@/config/i18n.config";
import { useLanguageSync } from "@/hooks/use-language-sync.hook";
import { useSettings } from "@/stores/settings.store";
import { Language } from "@/types/settings.model";

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
