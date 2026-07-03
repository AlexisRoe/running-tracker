import { Drawer, Text } from "@mantine/core";

interface AddDrawerProps {
  opened: boolean;
  onClose(): void;
}

export function AddDrawer({ opened, onClose }: AddDrawerProps) {
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="md"
      title="Add Run"
      padding="md"
      transitionProps={{ duration: 0 }}
    >
      <Text c="dimmed" size="sm">
        Add-run form coming soon.
      </Text>
    </Drawer>
  );
}
