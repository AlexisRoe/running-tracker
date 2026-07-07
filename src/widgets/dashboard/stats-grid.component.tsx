import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { Flip } from "@gfazioli/mantine-flip";
import { Group, Paper, SimpleGrid, Stack, Text, ThemeIcon, UnstyledButton } from "@mantine/core";
import { formatDistance } from "@shared/lib/distance.utils";
import {
  IconArrowDownRight,
  IconArrowUpRight,
  IconCalendar,
  IconMapPin,
  IconMinus,
  IconRun,
  IconTrendingUp,
  type TablerIcon,
} from "@tabler/icons-react";
import type { ReactNode } from "react";
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

// Flip's front/back faces are position: absolute (no intrinsic height), so a
// fixed height is required. Sized to fit the longest translated info string
// (German) at size="xs" without clipping.
const STAT_TILE_HEIGHT = 130;
const HEADLINE_CARD_HEIGHT = 160;

interface FlipCardProps {
  height: number;
  frontAriaLabel: string;
  backAriaLabel: string;
  front: ReactNode;
  back: ReactNode;
}

function FlipCard({ height, frontAriaLabel, backAriaLabel, front, back }: FlipCardProps) {
  return (
    <Flip h={height} lazyBack>
      <Flip.Front>
        <Flip.Target>
          <UnstyledButton
            type="button"
            display="block"
            w="100%"
            h={height}
            style={{ cursor: "pointer" }}
            aria-label={frontAriaLabel}
          >
            <Paper radius="lg" p="md" h={height} style={{ overflow: "hidden" }}>
              {front}
            </Paper>
          </UnstyledButton>
        </Flip.Target>
      </Flip.Front>

      <Flip.Back>
        <Flip.Target>
          <UnstyledButton
            type="button"
            display="block"
            w="100%"
            h={height}
            style={{ cursor: "pointer" }}
            aria-label={backAriaLabel}
          >
            <Paper radius="lg" p="md" h={height} style={{ overflow: "hidden" }}>
              {back}
            </Paper>
          </UnstyledButton>
        </Flip.Target>
      </Flip.Back>
    </Flip>
  );
}

function StatTile({ icon: Icon, label, value, sub, info }: StatTileProps) {
  const { t } = useTranslation();

  return (
    <FlipCard
      height={STAT_TILE_HEIGHT}
      frontAriaLabel={t("dashboard.stats.flipToDetails", { label })}
      backAriaLabel={t("dashboard.stats.flipToSummary", { label })}
      front={
        <Stack gap={6}>
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon variant="light" size="md" radius="md">
              <Icon size={16} stroke={2} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
              {label}
            </Text>
          </Group>
          <Text fw={700} size="lg" lh={1.2} mt={6}>
            {value}
          </Text>
          {sub && (
            <Text size="xs" c="dimmed">
              {sub}
            </Text>
          )}
        </Stack>
      }
      back={
        <Stack gap={6}>
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon variant="light" size="md" radius="md">
              <Icon size={16} stroke={2} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
              {label}
            </Text>
          </Group>
          <Text size="xs" mt={6}>
            {info}
          </Text>
        </Stack>
      }
    />
  );
}

interface HeadlineCardProps {
  metrics: DashboardMetrics;
}

function HeadlineCard({ metrics }: HeadlineCardProps) {
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

  return (
    <FlipCard
      height={HEADLINE_CARD_HEIGHT}
      frontAriaLabel={t("dashboard.headline.flipToDetails")}
      backAriaLabel={t("dashboard.headline.flipToSummary")}
      front={
        <Stack gap={2}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
            {t("dashboard.headline.label")}
          </Text>
          <Text fw={700} fz={44} lh={1} mt={8} style={{ fontVariantNumeric: "tabular-nums" }}>
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
      }
      back={
        <Stack gap={6}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
            {t("dashboard.headline.label")}
          </Text>
          <Text size="xs">{t("dashboard.headline.help")}</Text>
        </Stack>
      }
    />
  );
}

/** Headline "km/day to reach goal" plus the supporting statistics tiles. */
export function StatsGrid({ metrics }: StatsGridProps) {
  const { t } = useTranslation();

  const runningDaysPercent =
    metrics.daysElapsed > 0 ? Math.round((metrics.daysWithRuns / metrics.daysElapsed) * 100) : 0;

  const goalPeriodPercent =
    metrics.totalDays > 0 ? Math.round((metrics.daysElapsed / metrics.totalDays) * 100) : 0;

  return (
    <Stack gap="md">
      <HeadlineCard metrics={metrics} />

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
