import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import { IconTargetArrow } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface SetGoalCtaProps {
  onSetGoal(): void;
}

/** Shown on the dashboard when no goal is set yet. */
export function SetGoalCta({ onSetGoal }: SetGoalCtaProps) {
  const { t } = useTranslation();

  return (
    <Paper withBorder radius="md" p="xl">
      <Stack align="center" gap="sm">
        <IconTargetArrow size={48} stroke={1.5} />
        <Title order={3}>{t("dashboard.cta.title")}</Title>
        <Text c="dimmed" ta="center">
          {t("dashboard.cta.body")}
        </Text>
        <Button onClick={onSetGoal} mt="xs">
          {t("dashboard.cta.button")}
        </Button>
      </Stack>
    </Paper>
  );
}
