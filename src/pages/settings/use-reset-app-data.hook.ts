import { useGoalStore } from "@features/goal/goal.store";
import { useRunsStore } from "@features/runs/runs.store";
import { useSettings } from "@features/settings/settings.store";
import { notifySuccess } from "@shared/ui/notification/notify";
import { useTranslation } from "react-i18next";

const RELOAD_DELAY_MS = 1200;

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

    setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
  };

  return { resetAppData };
}
