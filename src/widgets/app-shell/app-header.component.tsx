import { ActionIcon, Group, Image, Title } from "@mantine/core";
import { IconSettings, IconTarget } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface AppHeaderProps {
  onSettingsClick(): void;
  onGoalClick(): void;
}

export function AppHeader({ onSettingsClick, onGoalClick }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <Group h="100%" px="md" pt="lg" justify="space-between">
      <Group gap="xs">
        <Image src="/assets/icons/app_transparent.png" alt="" h={36} w={36} fit="contain" />
        <Title order={4}>{t("appShell.header.title")}</Title>
      </Group>
      <Group gap="xs">
        <ActionIcon
          variant="subtle"
          size="xl"
          onClick={onGoalClick}
          aria-label={t("appShell.header.openGoal")}
        >
          <IconTarget size={24} />
        </ActionIcon>
        <ActionIcon
          variant="subtle"
          size="xl"
          onClick={onSettingsClick}
          aria-label={t("appShell.header.openSettings")}
        >
          <IconSettings size={24} />
        </ActionIcon>
      </Group>
    </Group>
  );
}
