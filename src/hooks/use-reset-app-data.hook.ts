import { useTranslation } from "react-i18next";
import { notifySuccess } from "@/components/ui/notify";
import { useGoalStore } from "@/stores/goal.store";
import { useRunsStore } from "@/stores/runs.store";
import { useSettings } from "@/stores/settings.store";

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
