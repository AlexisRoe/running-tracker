import { ActionIcon, Group, Image, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface AppHeaderProps {
  onSettingsClick(): void;
}

export function AppHeader({ onSettingsClick }: AppHeaderProps) {
  const { t } = useTranslation();

  return (
    <Group h="100%" px={25} pt={60} justify="space-between">
      <Group gap="xs">
        <Image src="/assets/icons/big-logo.png" alt="" h={28} w={28} fit="contain" />
        <Title order={4}>{t("appShell.header.title")}</Title>
      </Group>
      <ActionIcon
        variant="default"
        size="lg"
        onClick={onSettingsClick}
        aria-label={t("appShell.header.openSettings")}
      >
        <IconSettings size={18} />
      </ActionIcon>
    </Group>
  );
}
