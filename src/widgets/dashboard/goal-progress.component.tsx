import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { Group, Paper, RingProgress, Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface GoalProgressProps {
  metrics: DashboardMetrics;
}

/** Ring of km run vs. km still open, toward the total goal distance. */
export function GoalProgress({ metrics }: GoalProgressProps) {
  const { t } = useTranslation();
  const { distanceRun, distanceOpen, goalDistance } = metrics;

  const percent = goalDistance > 0 ? Math.min(100, (distanceRun / goalDistance) * 100) : 0;

  return (
    <Paper withBorder radius="md" p="md">
      <Group wrap="nowrap">
        <RingProgress
          size={120}
          thickness={12}
          roundCaps
          sections={[{ value: percent, color: "brand" }]}
          label={
            <Text ta="center" fw={700} size="lg">
              {Math.round(percent)}%
            </Text>
          }
        />
        <Stack gap={2}>
          <Text fw={700} size="xl">
            {t("dashboard.stats.progressValue", { run: distanceRun, goal: goalDistance })}
          </Text>
          <Text c="dimmed" size="sm">
            {t("dashboard.stats.open", { km: distanceOpen })}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
