import { ActionIcon, Group, Image, Title } from "@mantine/core";
import { IconSettings } from "@tabler/icons-react";

interface AppHeaderProps {
  onSettingsClick(): void;
}

export function AppHeader({ onSettingsClick }: AppHeaderProps) {
  return (
    <Group h="100%" px={25} pt={60} justify="space-between">
      <Group gap="xs">
        <Image src="/assets/icons/big-logo.png" alt="" h={28} w={28} fit="contain" />
        <Title order={4}>Running Tracker</Title>
      </Group>
      <ActionIcon variant="default" size="lg" onClick={onSettingsClick} aria-label="Open settings">
        <IconSettings size={18} />
      </ActionIcon>
    </Group>
  );
}
