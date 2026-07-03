import { Drawer, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface AddDrawerProps {
  opened: boolean;
  onClose(): void;
}

export function AddDrawer({ opened, onClose }: AddDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="md"
      title={t("appShell.addDrawer.title")}
      padding="md"
      transitionProps={{ duration: 0 }}
    >
      <Text c="dimmed" size="sm">
        {t("appShell.addDrawer.comingSoon")}
      </Text>
    </Drawer>
  );
}
