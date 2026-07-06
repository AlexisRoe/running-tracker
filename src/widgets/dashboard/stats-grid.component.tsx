import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon } from "@mantine/core";
import { formatDistance } from "@shared/lib/distance.utils";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCalendar,
  IconClockHour4,
  IconFlag,
  IconGauge,
  IconMapPin,
  IconMinus,
  IconRun,
  IconTarget,
  IconTrendingUp,
  type TablerIcon,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface StatsGridProps {
  metrics: DashboardMetrics;
}

interface StatTileProps {
  icon: TablerIcon;
  label: string;
  value: string;
  sub?: string;
}

function StatTile({ icon: Icon, label, value, sub }: StatTileProps) {
  return (
    <Paper radius="lg" p="md">
      <Stack gap={6}>
        <Group gap="xs" wrap="nowrap">
          <ThemeIcon variant="light" size="md" radius="md">
            <Icon size={16} stroke={2} />
          </ThemeIcon>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
            {label}
          </Text>
        </Group>
        <Text fw={700} size="lg" lh={1.2}>
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
    ? t("dashboard.headline.faster", { km: formatDistance(Math.abs(diff)) })
    : easier
      ? t("dashboard.headline.easier", { km: formatDistance(Math.abs(diff)) })
      : t("dashboard.headline.onPlan");

  const runningDaysPercent =
    metrics.daysElapsed > 0 ? Math.round((metrics.daysWithRuns / metrics.daysElapsed) * 100) : 0;

  const scheduleValue =
    metrics.schedule.state === "behind"
      ? t("dashboard.stats.behindValue", { km: formatDistance(Math.abs(metrics.schedule.deltaKm)) })
      : metrics.schedule.state === "ahead"
        ? t("dashboard.stats.aheadValue", { km: formatDistance(metrics.schedule.deltaKm) })
        : t("dashboard.stats.onTrackValue");

  return (
    <Stack gap="md">
      <Paper radius="lg" p="md">
        <Stack gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
            {t("dashboard.headline.label")}
          </Text>
          <Text fw={700} fz={44} lh={1} style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatDistance(metrics.requiredPerRemainingDay)}
            <Text span fz="md" c="dimmed" fw={500} ml={6}>
              km/day
            </Text>
          </Text>
          <Group gap={4} c={trendColor} mt={4}>
            <TrendIcon size={16} />
            <Text size="sm" fw={500}>
              {trendText}
            </Text>
          </Group>
          <Text size="xs" c="dimmed">
            {t("dashboard.headline.baseline", { km: formatDistance(metrics.baselinePerDay) })}
          </Text>
        </Stack>
      </Paper>

      <SimpleGrid cols={2} spacing="sm">
        <StatTile
          icon={IconCalendar}
          label={t("dashboard.stats.daysLeft")}
          value={`${metrics.daysLeft}`}
          sub={t("dashboard.stats.ofDays", { total: metrics.totalDays })}
        />
        <StatTile
          icon={IconClockHour4}
          label={t("dashboard.stats.schedule")}
          value={scheduleValue}
        />
        <StatTile
          icon={IconRun}
          label={t("dashboard.stats.runningDays")}
          value={`${metrics.daysWithRuns} / ${metrics.daysElapsed}`}
          sub={t("dashboard.stats.runningDaysSub", { percent: runningDaysPercent })}
        />

        <StatTile
          icon={IconGauge}
          label={t("dashboard.stats.baseline")}
          value={t("dashboard.stats.perDay", { km: formatDistance(metrics.baselinePerDay) })}
        />
        <StatTile
          icon={IconMapPin}
          label={t("dashboard.stats.location")}
          value={`${metrics.indoorCount} / ${metrics.outdoorCount}`}
          sub={t("dashboard.stats.locationSub", {
            outdoor: formatDistance(metrics.outdoorDistance),
            indoor: formatDistance(metrics.indoorDistance),
          })}
        />
        <StatTile
          icon={IconTrendingUp}
          label={t("dashboard.stats.required")}
          value={t("dashboard.stats.perDay", {
            km: formatDistance(metrics.requiredPerRemainingDay),
          })}
        />
      </SimpleGrid>
    </Stack>
  );
}
