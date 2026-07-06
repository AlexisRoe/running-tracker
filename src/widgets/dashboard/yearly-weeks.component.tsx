import type { WeekCell } from "@features/dashboard/dashboard.model";
import { ActionIcon, Box, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { formatDistance } from "@shared/lib/distance.utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface YearlyWeeksProps {
  year: number;
  weeks: WeekCell[];
  canGoPrev: boolean;
  canGoNext: boolean;
  onPrevYear: () => void;
  onNextYear: () => void;
}

// Level 0 (no runs) recedes to a neutral border tone; 1-5 climb the brand ramp.
const LEVEL_COLORS: Record<WeekCell["level"], string> = {
  0: "var(--mantine-color-default-border)",
  1: "var(--mantine-color-brand-2)",
  2: "var(--mantine-color-brand-4)",
  3: "var(--mantine-color-brand-6)",
  4: "var(--mantine-color-brand-7)",
  5: "var(--mantine-color-brand-9)",
};

// Applied to cells outside the active goal's date range so they read as "dimmed".
const OUT_OF_PERIOD_FILTER = "brightness(0.55)";

const CELL = 20;

function Cell({ color, ariaLabel }: { color: string; ariaLabel?: string }) {
  return (
    <Box
      aria-label={ariaLabel}
      w={CELL}
      h={CELL}
      style={{ backgroundColor: color, borderRadius: 3, flex: "none" }}
    />
  );
}

/** Swatch-by-swatch breakdown shown inside the legend tooltip. */
function LegendExplanation() {
  const { t } = useTranslation();

  return (
    <Stack gap={6} py={2}>
      <Text size="xs" fw={600}>
        {t("dashboard.weeks.legendTitle")}
      </Text>
      <Stack gap={4}>
        {([0, 1, 2, 3, 4, 5] as const).map((level) => (
          <Group key={level} gap={8} wrap="nowrap">
            <Box
              w={12}
              h={12}
              style={{ backgroundColor: LEVEL_COLORS[level], borderRadius: 3, flex: "none" }}
            />
            <Text size="xs">
              {t("dashboard.weeks.legendRow", { count: level === 5 ? "5+" : level })}
            </Text>
          </Group>
        ))}
      </Stack>
    </Stack>
  );
}

/** GitHub-style heatmap of weekly running volume across a given year. */
export function YearlyWeeks({
  year,
  weeks,
  canGoPrev,
  canGoNext,
  onPrevYear,
  onNextYear,
}: YearlyWeeksProps) {
  const { t } = useTranslation();

  return (
    <Paper radius="lg" p="md">
      <Group justify="space-between" mb="sm">
        <Text fw={600}>{t("dashboard.weeks.title", { year })}</Text>
        <Group gap={4}>
          {canGoPrev && (
            <ActionIcon
              variant="subtle"
              aria-label={t("dashboard.weeks.prevYear")}
              onClick={onPrevYear}
            >
              <IconChevronLeft size={18} />
            </ActionIcon>
          )}
          {canGoNext && (
            <ActionIcon
              variant="subtle"
              aria-label={t("dashboard.weeks.nextYear")}
              onClick={onNextYear}
            >
              <IconChevronRight size={18} />
            </ActionIcon>
          )}
        </Group>
      </Group>

      <Box mt="lg" style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {weeks.map((week) => (
          <Tooltip
            key={week.weekStart}
            label={t("dashboard.weeks.tooltip", {
              week: week.weekNumber,
              count: week.runCount,
              km: formatDistance(week.distance),
            })}
            withArrow
          >
            <Box
              aria-label={t("dashboard.weeks.tooltip", {
                week: week.weekNumber,
                count: week.runCount,
                km: formatDistance(week.distance),
              })}
              w={CELL}
              h={CELL}
              style={{
                backgroundColor: LEVEL_COLORS[week.level],
                borderRadius: 3,
                flex: "none",
                filter: week.inGoalPeriod ? undefined : OUT_OF_PERIOD_FILTER,
              }}
            />
          </Tooltip>
        ))}
      </Box>

      <Tooltip
        label={<LegendExplanation />}
        withArrow
        events={{ hover: true, focus: true, touch: true }}
      >
        <Group gap={4} mt="lg" justify="flex-end" tabIndex={0} style={{ cursor: "help" }}>
          <Text size="xs" c="dimmed">
            {t("dashboard.weeks.less")}
          </Text>
          {([0, 1, 2, 3, 4, 5] as const).map((level) => (
            <Cell key={level} color={LEVEL_COLORS[level]} />
          ))}
          <Text size="xs" c="dimmed">
            {t("dashboard.weeks.more")}
          </Text>
        </Group>
      </Tooltip>
    </Paper>
  );
}
