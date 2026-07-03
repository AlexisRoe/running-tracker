import "@testing-library/jest-dom/vitest";
import { useGoalStore } from "@features/goal/goal.store";
import { useRunsStore } from "@features/runs/runs.store";
import { Language, Theme } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import i18n from "@shared/i18n/i18n.config";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

class MockObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

globalThis.ResizeObserver = MockObserver as unknown as typeof ResizeObserver;
globalThis.IntersectionObserver = MockObserver as unknown as typeof IntersectionObserver;

Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  cleanup();
});

beforeEach(async () => {
  localStorage.clear();
  useGoalStore.getState().resetGoal();
  useRunsStore.setState({ events: [] });
  useSettings.setState({ theme: Theme.System, language: Language.EN });
  await i18n.changeLanguage(Language.EN);
});
