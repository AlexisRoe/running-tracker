import { useTranslation } from "react-i18next";
import { notifySuccess } from "@/components/ui/notify";
import { RESET_RELOAD_DELAY_MS } from "@/config/constants.const";
import { useGoalStore } from "@/stores/goal.store";
import { useRunsStore } from "@/stores/runs.store";
import { useSettings } from "@/stores/settings.store";

/** Provides an action that clears all persisted app data, notifies, then reloads the app. */
export function useResetAppData() {
  const { t } = useTranslation();

  const resetAppData = () => {
    useSettings.persist.clearStorage();
    useRunsStore.persist.clearStorage();
    useGoalStore.persist.clearStorage();

    notifySuccess({
      title: t("settings.resetData.notification.title"),
      message: t("settings.resetData.notification.body"),
    });

    setTimeout(() => window.location.reload(), RESET_RELOAD_DELAY_MS);
  };

  return { resetAppData };
}
