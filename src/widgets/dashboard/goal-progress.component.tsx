import type { DashboardMetrics } from "@features/dashboard/dashboard.model";
import { Group, Paper, RingProgress, Stack, Text } from "@mantine/core";
import { formatDistance } from "@shared/lib/distance.utils";
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
    <Paper
      radius="lg"
      p="md"
      style={{
        background: "linear-gradient(135deg, var(--mantine-color-brand-6), #d43d00 110%)",
        color: "var(--mantine-color-white)",
      }}
    >
      <Group wrap="nowrap">
        <RingProgress
          size={124}
          thickness={12}
          roundCaps
          rootColor="rgba(255, 255, 255, 0.25)"
          sections={[{ value: percent, color: "white" }]}
          label={
            <Text ta="center" fw={700} size="lg" c="white">
              {Math.round(percent)}%
            </Text>
          }
        />
        <Stack gap={2}>
          <Text
            size="xs"
            fw={700}
            tt="uppercase"
            style={{ letterSpacing: "0.08em", opacity: 0.85 }}
          >
            {t("dashboard.stats.progress")}
          </Text>
          <Text fw={700} fz={26} lh={1.15}>
            {t("dashboard.stats.progressValue", {
              run: formatDistance(distanceRun),
              goal: formatDistance(goalDistance),
            })}
          </Text>
          <Text size="sm" style={{ opacity: 0.85 }}>
            {t("dashboard.stats.open", { km: formatDistance(distanceOpen) })}
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
}
