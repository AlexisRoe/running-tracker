import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { Alert } from "@mantine/core";
import { formatDistance } from "@shared/lib/distance.utils";
import { IconAlertTriangle, IconThumbUp } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface ScheduleBannerProps {
  metrics: DashboardMetrics;
}

/**
 * The motivational banner: red "Run faster!!!" when behind schedule, green
 * "Good Job." when on or ahead of it (and a final verdict once the goal ends).
 */
export function ScheduleBanner({ metrics }: ScheduleBannerProps) {
  const { t } = useTranslation();
  const { schedule, isFinished, distanceOpen } = metrics;

  const behind = isFinished ? distanceOpen > 0 : schedule.state === "behind";
  const km = Math.abs(schedule.deltaKm);
  const days = Math.abs(schedule.deltaDays);

  let body: string;
  if (isFinished) {
    body = behind
      ? t("dashboard.banner.finishedMissedBody", { km: formatDistance(distanceOpen) })
      : t("dashboard.banner.finishedMetBody", { distance: formatDistance(metrics.goalDistance) });
  } else if (schedule.state === "behind") {
    body = t("dashboard.banner.behindBody", { km: formatDistance(km), days });
  } else if (schedule.state === "ahead") {
    body = t("dashboard.banner.aheadBody", { km: formatDistance(km), days });
  } else {
    body = t("dashboard.banner.onTrackBody");
  }

  return (
    <Alert
      variant="light"
      color={behind ? "red" : "teal"}
      icon={behind ? <IconAlertTriangle /> : <IconThumbUp />}
      title={behind ? t("dashboard.banner.behindTitle") : t("dashboard.banner.goodTitle")}
    >
      {body}
    </Alert>
  );
}
