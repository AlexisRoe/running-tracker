import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, Tooltip } from "@mantine/core";
import { formatDistance } from "@shared/lib/distance.utils";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCalendar,
  IconInfoCircle,
  IconMapPin,
  IconMinus,
  IconRun,
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
  info: string;
}

function StatTile({ icon: Icon, label, value, sub, info }: StatTileProps) {
  return (
    <Paper radius="lg" p="md">
      <Stack gap={6}>
        <Tooltip
          label={info}
          withArrow
          multiline
          maw={220}
          events={{ hover: true, focus: true, touch: true }}
        >
          <Group gap="xs" wrap="nowrap" tabIndex={0}>
            <ThemeIcon variant="light" size="md" radius="md">
              <Icon size={16} stroke={2} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
              {label}
            </Text>
            <IconInfoCircle size={12} stroke={2} opacity={0.5} />
          </Group>
        </Tooltip>
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

  const goalPeriodPercent =
    metrics.totalDays > 0 ? Math.round((metrics.daysElapsed / metrics.totalDays) * 100) : 0;

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
          value={t("dashboard.stats.ofDays", {
            left: metrics.daysLeft,
            total: metrics.totalDays,
          })}
          sub={t("dashboard.stats.ofDaysPercent", { percent: goalPeriodPercent })}
          info={t("dashboard.stats.help.daysLeft")}
        />
        <StatTile
          icon={IconRun}
          label={t("dashboard.stats.runningDays")}
          value={`${metrics.daysWithRuns} / ${metrics.daysElapsed}`}
          sub={t("dashboard.stats.runningDaysSub", { percent: runningDaysPercent })}
          info={t("dashboard.stats.help.runningDays")}
        />
        <StatTile
          icon={IconMapPin}
          label={t("dashboard.stats.location")}
          value={`${metrics.indoorCount} / ${metrics.outdoorCount}`}
          sub={t("dashboard.stats.locationSub", {
            outdoor: formatDistance(metrics.outdoorDistance),
            indoor: formatDistance(metrics.indoorDistance),
          })}
          info={t("dashboard.stats.help.location")}
        />
        <StatTile
          icon={IconTrendingUp}
          label={t("dashboard.stats.required")}
          value={t("dashboard.stats.perDay", {
            km: formatDistance(metrics.requiredPerRemainingDay),
          })}
          info={t("dashboard.stats.help.required")}
        />
      </SimpleGrid>
    </Stack>
  );
}
