import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
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
import { useCallback, useEffect, useState } from "react";
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
  index: number;
  height: number;
  onMeasure: (index: number, height: number) => void;
}

// Fallback floor used only until the real measurement below settles (and as
// a minimum for very short content) — not the governing size otherwise.
const STAT_TILE_MIN_HEIGHT = 130;
const HEADLINE_CARD_MIN_HEIGHT = 160;

// Each FlipCard measures and sizes itself independently (see below), so
// siblings with marginally different content (e.g. a shorter sub-label)
// would otherwise end up at different heights — unlike plain auto-height
// Papers, a grid can't stretch an item that already has an explicit pixel
// height to match its row. This tracks every stat tile's own natural height
// and hands back the shared max, so the four tiles in the grid stay aligned.
function useSharedHeight(count: number, minHeight: number) {
  const [heights, setHeights] = useState<number[]>(() => new Array(count).fill(0));

  const report = useCallback((index: number, measured: number) => {
    setHeights((prev) => (prev[index] === measured ? prev : prev.with(index, measured)));
  }, []);

  return { height: Math.max(...heights, minHeight), report };
}

interface FlipCardProps {
  height: number;
  onMeasure: (height: number) => void;
  frontAriaLabel: string;
  backAriaLabel: string;
  front: ReactNode;
  back: ReactNode;
}

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
  metrics: DashboardMetrics;
}

function HeadlineCard({ metrics }: HeadlineCardProps) {
  const { t } = useTranslation();
  const [height, setHeight] = useState(HEADLINE_CARD_MIN_HEIGHT);
  const handleMeasure = useCallback(
    (measured: number) => setHeight(Math.max(measured, HEADLINE_CARD_MIN_HEIGHT)),
    [],
  );

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

  const runningDaysPercent =
    metrics.daysElapsed > 0 ? Math.round((metrics.daysWithRuns / metrics.daysElapsed) * 100) : 0;

  const goalPeriodPercent =
    metrics.totalDays > 0 ? Math.round((metrics.daysElapsed / metrics.totalDays) * 100) : 0;

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
