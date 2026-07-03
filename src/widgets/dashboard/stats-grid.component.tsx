import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { Group, Paper, SimpleGrid, Stack, Text } from "@mantine/core";
import { IconArrowDownRight, IconArrowUpRight, IconMinus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface StatsGridProps {
  metrics: DashboardMetrics;
}

interface StatTileProps {
  label: string;
  value: string;
  sub?: string;
}

function StatTile({ label, value, sub }: StatTileProps) {
  return (
    <Paper withBorder radius="md" p="md">
      <Stack gap={2}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          {label}
        </Text>
        <Text fw={700} size="lg">
          {value}
        </Text>
        {sub && (
          <Text size="xs" c="dimmed">
            {sub}
          </Text>
        )}
      </Stack>
    </Paper>
  );
}

/** Headline "km/day to reach goal" plus the supporting statistics tiles. */
export function StatsGrid({ metrics }: StatsGridProps) {
  const { t } = useTranslation();

  const diff = metrics.requiredPerRemainingDay - metrics.baselinePerDay;
  const faster = diff > 0.05;
  const easier = diff < -0.05;

  const trendColor = faster ? "red" : easier ? "teal" : "dimmed";
  const TrendIcon = faster ? IconArrowUpRight : easier ? IconArrowDownRight : IconMinus;
  const trendText = faster
    ? t("dashboard.headline.faster", { km: Math.abs(diff).toFixed(1) })
    : easier
      ? t("dashboard.headline.easier", { km: Math.abs(diff).toFixed(1) })
      : t("dashboard.headline.onPlan");

  const scheduleValue =
    metrics.schedule.state === "behind"
      ? t("dashboard.stats.behindValue", { km: Math.abs(metrics.schedule.deltaKm) })
      : metrics.schedule.state === "ahead"
        ? t("dashboard.stats.aheadValue", { km: metrics.schedule.deltaKm })
        : t("dashboard.stats.onTrackValue");

  return (
    <Stack gap="md">
      <Paper withBorder radius="md" p="md">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
            {t("dashboard.headline.label")}
          </Text>
          <Text fw={700} fz={40} lh={1}>
            {metrics.requiredPerRemainingDay.toFixed(1)}
            <Text span fz="md" c="dimmed" fw={500} ml={6}>
              km/day
            </Text>
          </Text>
          <Group gap={4} c={trendColor} mt={4}>
            <TrendIcon size={16} />
            <Text size="sm">{trendText}</Text>
          </Group>
          <Text size="xs" c="dimmed">
            {t("dashboard.headline.baseline", { km: metrics.baselinePerDay.toFixed(1) })}
          </Text>
        </Stack>
      </Paper>

      <SimpleGrid cols={2} spacing="sm">
        <StatTile
          label={t("dashboard.stats.daysLeft")}
          value={`${metrics.daysLeft}`}
          sub={t("dashboard.stats.ofDays", { total: metrics.totalDays })}
        />
        <StatTile
          label={t("dashboard.stats.goal")}
          value={t("dashboard.stats.perTotal", { km: metrics.goalDistance })}
        />
        <StatTile
          label={t("dashboard.stats.runningDays")}
          value={`${metrics.daysWithRuns} / ${metrics.daysElapsed}`}
          sub={t("dashboard.stats.runningDaysSub", { rest: metrics.daysWithoutRuns })}
        />
        <StatTile
          label={t("dashboard.stats.location")}
          value={`${metrics.outdoorCount} / ${metrics.indoorCount}`}
          sub={t("dashboard.stats.locationSub", {
            outdoor: metrics.outdoorDistance,
            indoor: metrics.indoorDistance,
          })}
        />
        <StatTile
          label={t("dashboard.stats.baseline")}
          value={t("dashboard.stats.perDay", { km: metrics.baselinePerDay.toFixed(1) })}
        />
        <StatTile
          label={t("dashboard.stats.required")}
          value={t("dashboard.stats.perDay", { km: metrics.requiredPerRemainingDay.toFixed(1) })}
        />
        <StatTile label={t("dashboard.stats.schedule")} value={scheduleValue} />
        <StatTile
          label={t("dashboard.stats.progress")}
          value={t("dashboard.stats.progressValue", {
            run: metrics.distanceRun,
            goal: metrics.goalDistance,
          })}
          sub={t("dashboard.stats.open", { km: metrics.distanceOpen })}
        />
      </SimpleGrid>
    </Stack>
  );
}
