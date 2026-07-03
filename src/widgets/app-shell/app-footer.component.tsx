import { ActionIcon, Button, Group } from "@mantine/core";
import { APP_ROUTES } from "@shared/config/constants.const";
import { IconHome, IconList, IconPlus } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

interface AppFooterProps {
  onAddClick(): void;
}

export function AppFooter({ onAddClick }: AppFooterProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Group px="md" pt="xs" pb="lg" justify="space-between" align="center" wrap="nowrap">
      <ActionIcon
        variant="subtle"
        size="lg"
        aria-label={t("appShell.footer.dashboard")}
        onClick={() => navigate(APP_ROUTES.home)}
      >
        <IconHome size={20} />
      </ActionIcon>

      <Button
        size="lg"
        radius="xl"
        onClick={onAddClick}
        aria-label={t("appShell.footer.addRun")}
        leftSection={<IconPlus size={20} />}
      >
        {t("appShell.footer.add")}
      </Button>

      <ActionIcon
        variant="subtle"
        size="lg"
        aria-label={t("appShell.footer.log")}
        onClick={() => navigate(APP_ROUTES.log)}
      >
        <IconList size={20} />
      </ActionIcon>
    </Group>
  );
}
