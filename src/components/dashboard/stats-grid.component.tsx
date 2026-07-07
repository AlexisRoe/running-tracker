import { Flip } from "@gfazioli/mantine-flip";
import {
  Box,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  UnstyledButton,
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
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
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSharedHeight } from "@/hooks/use-shared-height.hook";
import type { DashboardMetrics } from "@/types/dashboard.model";
import {
  computeHeadlineTrend,
  computeStatPercents,
  type HeadlineTrendState,
} from "@/utils/dashboard.utils";
import { formatDistance } from "@/utils/distance.utils";

interface StatsGridProps {
  /** Computed dashboard metrics driving the headline card and stat tiles. */
  metrics: DashboardMetrics;
}

interface StatTileProps {
  /** Icon shown at the top of the tile. */
  icon: TablerIcon;
  /** Short uppercase caption for the statistic. */
  label: string;
  /** Primary value text (front face). */
  value: string;
  /** Optional secondary line under the value (front face). */
  sub?: string;
  /** Explanatory text shown on the flipped (back) face. */
  info: string;
  /** Position of this tile among its siblings, used for shared-height reporting. */
  index: number;
  /** Pixel height applied to the tile (the shared max across siblings). */
  height: number;
  /** Reports this tile's natural height so siblings can align. */
  onMeasure: (index: number, height: number) => void;
}

// Fallback floor used only until the real measurement below settles (and as
// a minimum for very short content) — not the governing size otherwise.
const STAT_TILE_MIN_HEIGHT = 130;
const HEADLINE_CARD_MIN_HEIGHT = 160;

interface FlipCardProps {
  /** Pixel height applied to both faces (they are absolutely positioned). */
  height: number;
  /** Reports the taller of the two faces' natural heights to the caller. */
  onMeasure: (height: number) => void;
  /** Accessible label for the front face's flip button. */
  frontAriaLabel: string;
  /** Accessible label for the back face's flip button. */
  backAriaLabel: string;
  /** Content of the front (summary) face. */
  front: ReactNode;
  /** Content of the back (details) face. */
  back: ReactNode;
}

/** A tappable card whose two faces flip between a summary and its details. */
// Flip's front/back faces are position: absolute, so they can't report or
// derive their own height — a fixed pixel height must be passed in. Rather
// than guess a constant (which either clips the longest translated back-face
// text on narrow phones, or leaves a lot of dead space on wider screens),
// both faces measure their own natural height and report it up via
// onMeasure; the height actually applied comes from the caller, so cards
// that share a grid can be kept in sync (see useSharedHeight).
function FlipCard({
  height,
  onMeasure,
  frontAriaLabel,
  backAriaLabel,
  front,
  back,
}: FlipCardProps) {
  const frontSize = useElementSize<HTMLDivElement>();
  const backSize = useElementSize<HTMLDivElement>();
  const naturalHeight = Math.max(frontSize.height, backSize.height);

  useEffect(() => {
    onMeasure(naturalHeight);
  }, [naturalHeight, onMeasure]);

  return (
    <Flip h={height}>
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
            <Paper radius="lg" h={height} style={{ overflow: "hidden" }}>
              <Box p="md" ref={frontSize.ref}>
                {front}
              </Box>
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
            <Paper radius="lg" h={height} style={{ overflow: "hidden" }}>
              <Box p="md" ref={backSize.ref}>
                {back}
              </Box>
            </Paper>
          </UnstyledButton>
        </Flip.Target>
      </Flip.Back>
    </Flip>
  );
}

/** A single dashboard statistic as a flip card: value on the front, help text on the back. */
function StatTile({
  icon: Icon,
  label,
  value,
  sub,
  info,
  index,
  height,
  onMeasure,
}: StatTileProps) {
  const { t } = useTranslation();
  const handleMeasure = useCallback(
    (measured: number) => onMeasure(index, measured),
    [index, onMeasure],
  );

  return (
    <FlipCard
      height={height}
      onMeasure={handleMeasure}
      frontAriaLabel={t("dashboard.stats.flipToDetails", { label })}
      backAriaLabel={t("dashboard.stats.flipToSummary", { label })}
      front={
        <Stack gap={6} pb={4}>
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
        <Stack gap={6} pb={4}>
          <Group gap="xs" wrap="nowrap">
            <ThemeIcon variant="light" size="md" radius="md">
              <Icon size={16} stroke={2} />
            </ThemeIcon>
            <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
              {label}
            </Text>
          </Group>
          <Text size="xs" mt={6} lh={1.5}>
            {info}
          </Text>
        </Stack>
      }
    />
  );
}

interface HeadlineCardProps {
  /** Computed dashboard metrics; supplies the required pace and baseline. */
  metrics: DashboardMetrics;
}

/** Prominent "km/day needed to reach the goal" card, with a trend vs. the original baseline. */
function HeadlineCard({ metrics }: HeadlineCardProps) {
  const { t } = useTranslation();
  const [height, setHeight] = useState(HEADLINE_CARD_MIN_HEIGHT);
  const handleMeasure = useCallback(
    (measured: number) => setHeight(Math.max(measured, HEADLINE_CARD_MIN_HEIGHT)),
    [],
  );

  const trend = computeHeadlineTrend(metrics);

  const trendColor: Record<HeadlineTrendState, string> = {
    faster: "red",
    easier: "teal",
    onPlan: "dimmed",
  };
  const trendIcon: Record<HeadlineTrendState, TablerIcon> = {
    faster: IconArrowUpRight,
    easier: IconArrowDownRight,
    onPlan: IconMinus,
  };
  const TrendIcon = trendIcon[trend.state];
  const trendText =
    trend.state === "onPlan"
      ? t("dashboard.headline.onPlan")
      : t(`dashboard.headline.${trend.state}`, { km: formatDistance(trend.deltaKm) });

  return (
    <FlipCard
      height={height}
      onMeasure={handleMeasure}
      frontAriaLabel={t("dashboard.headline.flipToDetails")}
      backAriaLabel={t("dashboard.headline.flipToSummary")}
      front={
        <Stack gap={2} pb={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
            {t("dashboard.headline.label")}
          </Text>
          <Text fw={700} fz={44} lh={1} mt={8} style={{ fontVariantNumeric: "tabular-nums" }}>
            {formatDistance(metrics.requiredPerRemainingDay)}
            <Text span fz="md" c="dimmed" fw={500} ml={6}>
              km/day
            </Text>
          </Text>
          <Group gap={4} c={trendColor[trend.state]} mt={4}>
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
        <Stack gap={6} pb={4}>
          <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
            {t("dashboard.headline.label")}
          </Text>
          <Text size="xs" lh={1.5}>
            {t("dashboard.headline.help")}
          </Text>
        </Stack>
      }
    />
  );
}

/** Headline "km/day to reach goal" plus the supporting statistics tiles. */
export function StatsGrid({ metrics }: StatsGridProps) {
  const { t } = useTranslation();
  const { height: statTileHeight, report: reportStatTileHeight } = useSharedHeight(
    4,
    STAT_TILE_MIN_HEIGHT,
  );

  const { runningDaysPercent, goalPeriodPercent } = computeStatPercents(metrics);

  return (
    <Stack gap="md">
      <HeadlineCard metrics={metrics} />

      <SimpleGrid cols={2} spacing="sm">
        <StatTile
          index={0}
          height={statTileHeight}
          onMeasure={reportStatTileHeight}
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
          index={1}
          height={statTileHeight}
          onMeasure={reportStatTileHeight}
          icon={IconRun}
          label={t("dashboard.stats.runningDays")}
          value={`${metrics.daysWithRuns} / ${metrics.daysElapsed}`}
          sub={t("dashboard.stats.runningDaysSub", { percent: runningDaysPercent })}
          info={t("dashboard.stats.help.runningDays")}
        />
        <StatTile
          index={2}
          height={statTileHeight}
          onMeasure={reportStatTileHeight}
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
          index={3}
          height={statTileHeight}
          onMeasure={reportStatTileHeight}
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
