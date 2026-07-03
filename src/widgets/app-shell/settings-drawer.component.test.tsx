import { useGoalStore } from "@features/goal/goal.store";
import { useRunsStore } from "@features/runs/runs.store";
import { Language, Theme } from "@features/settings/settings.model";
import { useSettings } from "@features/settings/settings.store";
import { BUILD_INFO } from "@shared/build-info/build-info.const";
import { notifySuccess } from "@shared/ui/notification/notify";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SettingsDrawer } from "@widgets/app-shell/settings-drawer.component";
import { afterEach, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

vi.mock("@shared/ui/notification/notify", () => ({
  notifyError: vi.fn(),
  notifySuccess: vi.fn(),
  notifyInfo: vi.fn(),
  notifyWarning: vi.fn(),
}));

describe("SettingsDrawer", () => {
  it("renders the drawer content when opened", () => {
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("does not render drawer content when closed", () => {
    renderWithProviders(<SettingsDrawer opened={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Settings")).not.toBeInTheDocument();
  });

  it("renders the theme, language, and build info cards", () => {
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Theme")).toBeInTheDocument();
    expect(screen.getByText("Language")).toBeInTheDocument();
    expect(screen.getByText("Build Info")).toBeInTheDocument();
  });

  it("updates the store when a theme option is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    await user.click(screen.getByText("Dark"));
    expect(useSettings.getState().theme).toBe(Theme.Dark);

    await user.click(screen.getByText("Light"));
    expect(useSettings.getState().theme).toBe(Theme.Light);
  });

  it("updates the store when a language option is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    await user.click(screen.getByRole("combobox", { name: "Language" }));
    await user.click(screen.getByText("German"));

    expect(useSettings.getState().language).toBe(Language.DE);
  });

  it("shows the build info version, commit hash, and built-at date", () => {
    renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText(BUILD_INFO.version)).toBeInTheDocument();
    expect(screen.getByText(BUILD_INFO.commitHash)).toBeInTheDocument();
    expect(screen.getByText(new Date(BUILD_INFO.builtAt).toLocaleString("en"))).toBeInTheDocument();
  });

  describe("reset app data", () => {
    afterEach(() => {
      vi.useRealTimers();
      vi.restoreAllMocks();
    });

    it("does not show the confirm modal initially", () => {
      renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

      expect(screen.queryByText("Reset app data?")).not.toBeInTheDocument();
    });

    it("opens the confirm modal when the reset button is clicked", async () => {
      const user = userEvent.setup();
      renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

      await user.click(screen.getByText("Reset app data"));

      expect(screen.getByText("Reset app data?")).toBeInTheDocument();
    });

    it("does not clear any store when the reset is cancelled", async () => {
      const user = userEvent.setup();
      const clearSettings = vi.spyOn(useSettings.persist, "clearStorage");
      renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

      await user.click(screen.getByText("Reset app data"));
      await user.click(screen.getByText("Cancel"));

      expect(clearSettings).not.toHaveBeenCalled();
      expect(screen.queryByText("Reset app data?")).not.toBeInTheDocument();
    });

    it("clears all stores, shows a notification, and schedules a reload when confirmed", async () => {
      const user = userEvent.setup();
      const clearSettings = vi.spyOn(useSettings.persist, "clearStorage");
      const clearRuns = vi.spyOn(useRunsStore.persist, "clearStorage");
      const clearGoal = vi.spyOn(useGoalStore.persist, "clearStorage");
      // Intercept only the reload's own setTimeout call so it never actually
      // fires in jsdom, while leaving userEvent's internal timers untouched.
      const originalSetTimeout = globalThis.setTimeout;
      const setTimeoutSpy = vi.spyOn(globalThis, "setTimeout").mockImplementation(((
        handler: TimerHandler,
        delay?: number,
        ...args: unknown[]
      ) => {
        if (delay === 1200) return 0;
        return originalSetTimeout(handler, delay, ...args);
      }) as typeof setTimeout);

      renderWithProviders(<SettingsDrawer opened onClose={vi.fn()} />);

      await user.click(screen.getByText("Reset app data"));
      await user.click(screen.getByText("Yes, delete everything"));

      expect(clearSettings).toHaveBeenCalledTimes(1);
      expect(clearRuns).toHaveBeenCalledTimes(1);
      expect(clearGoal).toHaveBeenCalledTimes(1);
      expect(notifySuccess).toHaveBeenCalledWith(
        expect.objectContaining({ title: "App data reset" }),
      );
      expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 1200);
    });
  });
});
