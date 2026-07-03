import { ActionIcon, Group } from "@mantine/core";
import { APP_ROUTES } from "@shared/config/constants.const";
import { IconHome, IconList, IconPlus, IconSettings, IconTarget } from "@tabler/icons-react";
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
        size="xl"
        aria-label={t("appShell.footer.dashboard")}
        onClick={() => navigate(APP_ROUTES.home)}
      >
        <IconHome size={26} />
      </ActionIcon>

      <ActionIcon
        variant="subtle"
        size="xl"
        aria-label={t("appShell.footer.goal")}
        onClick={() => navigate(APP_ROUTES.goal)}
      >
        <IconTarget size={26} />
      </ActionIcon>

      <ActionIcon
        variant="filled"
        radius="xl"
        size={60}
        onClick={onAddClick}
        aria-label={t("appShell.footer.addRun")}
      >
        <IconPlus size={30} />
      </ActionIcon>

      <ActionIcon
        variant="subtle"
        size="xl"
        aria-label={t("appShell.footer.log")}
        onClick={() => navigate(APP_ROUTES.log)}
      >
        <IconList size={26} />
      </ActionIcon>

      <ActionIcon
        variant="subtle"
        size="xl"
        aria-label={t("appShell.footer.settings")}
        onClick={() => navigate(APP_ROUTES.settings)}
      >
        <IconSettings size={26} />
      </ActionIcon>
    </Group>
  );
}
