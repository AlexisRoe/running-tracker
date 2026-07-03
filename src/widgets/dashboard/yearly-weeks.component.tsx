import type { WeekCell } from "@features/dashboard/dashboard.model";
import { Box, Group, Paper, Text, Tooltip } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface YearlyWeeksProps {
  weeks: WeekCell[];
}

// Level 0 (no runs) recedes to a neutral border tone; 1-4 climb the brand ramp.
const LEVEL_COLORS: Record<WeekCell["level"], string> = {
  0: "var(--mantine-color-default-border)",
  1: "var(--mantine-color-brand-2)",
  2: "var(--mantine-color-brand-4)",
  3: "var(--mantine-color-brand-6)",
  4: "var(--mantine-color-brand-8)",
};

const CELL = 14;

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

/** GitHub-style heatmap of weekly running volume across the current year. */
export function YearlyWeeks({ weeks }: YearlyWeeksProps) {
  const { t } = useTranslation();
  const first = weeks[0];
  const year = first ? new Date(first.weekStart).getFullYear() : "";

  return (
    <Paper withBorder radius="md" p="md">
      <Text fw={600} mb="sm">
        {t("dashboard.weeks.title", { year })}
      </Text>

      <Box style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {weeks.map((week) => (
          <Tooltip
            key={week.weekStart}
            label={t("dashboard.weeks.tooltip", { week: week.weekNumber, km: week.distance })}
            withArrow
          >
            <Box
              aria-label={t("dashboard.weeks.tooltip", {
                week: week.weekNumber,
                km: week.distance,
              })}
              w={CELL}
              h={CELL}
              style={{ backgroundColor: LEVEL_COLORS[week.level], borderRadius: 3, flex: "none" }}
            />
          </Tooltip>
        ))}
      </Box>

      <Group gap={4} mt="sm" justify="flex-end">
        <Text size="xs" c="dimmed">
          {t("dashboard.weeks.less")}
        </Text>
        {([0, 1, 2, 3, 4] as const).map((level) => (
          <Cell key={level} color={LEVEL_COLORS[level]} />
        ))}
        <Text size="xs" c="dimmed">
          {t("dashboard.weeks.more")}
        </Text>
      </Group>
    </Paper>
  );
}
