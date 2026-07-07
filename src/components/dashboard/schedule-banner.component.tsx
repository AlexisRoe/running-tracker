import { Alert } from "@mantine/core";
import { IconAlertTriangle, IconThumbUp } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { DashboardMetrics } from "@/types/dashboard.model";
import { resolveScheduleBanner } from "@/utils/dashboard.utils";

interface ScheduleBannerProps {
  /** Computed dashboard metrics; supplies the schedule state and remaining distance. */
  metrics: DashboardMetrics;
}

/**
 * The motivational banner: red "Run faster!!!" when behind schedule, green
 * "Good Job." when on or ahead of it (and a final verdict once the goal ends).
 */
export function ScheduleBanner({ metrics }: ScheduleBannerProps) {
  const { t } = useTranslation();
  const banner = resolveScheduleBanner(metrics);

  return (
    <Alert
      variant="light"
      color={banner.behind ? "red" : "teal"}
      icon={banner.behind ? <IconAlertTriangle /> : <IconThumbUp />}
      title={t(banner.titleKey)}
    >
      {t(banner.bodyKey, banner.bodyParams)}
    </Alert>
  );
}
