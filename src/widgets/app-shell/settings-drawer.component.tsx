import { Drawer, Text } from "@mantine/core";

interface SettingsDrawerProps {
  opened: boolean;
  onClose(): void;
}

export function SettingsDrawer({ opened, onClose }: SettingsDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      title="Settings"
      padding="md"
      transitionProps={{ duration: 0 }}
    >
      <Text c="dimmed" size="sm">
        Settings content coming soon.
      </Text>
    </Drawer>
  );
}
