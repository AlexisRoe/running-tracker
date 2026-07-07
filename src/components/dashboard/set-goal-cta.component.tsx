import { Button, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconTargetArrow } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface SetGoalCtaProps {
  /** Called when the user taps the button to start setting a goal. */
  onSetGoal(): void;
}

/** Shown on the dashboard when no goal is set yet. */
export function SetGoalCta({ onSetGoal }: SetGoalCtaProps) {
  const { t } = useTranslation();

  return (
    <Paper radius="lg" p="xl">
      <Stack align="center" gap="sm">
        <ThemeIcon variant="light" size={80} radius="xl">
          <IconTargetArrow size={44} stroke={1.5} />
        </ThemeIcon>
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
