import { ActionIcon, Button, Group } from "@mantine/core";
import { APP_ROUTES } from "@shared/config/constants.const";
import { IconHome, IconList, IconPlus } from "@tabler/icons-react";
import { useNavigate } from "react-router";

interface AppFooterProps {
  onAddClick(): void;
}

export function AppFooter({ onAddClick }: AppFooterProps) {
  const navigate = useNavigate();

  return (
    <Group px={25} pt={12} pb={35} justify="space-between" align="center" wrap="nowrap">
      <ActionIcon
        variant="subtle"
        size="lg"
        aria-label="Dashboard"
        onClick={() => navigate(APP_ROUTES.home)}
      >
        <IconHome size={20} />
      </ActionIcon>

      <Button
        size="lg"
        radius="xl"
        onClick={onAddClick}
        aria-label="Add run"
        leftSection={<IconPlus size={20} />}
      >
        Add
      </Button>

      <ActionIcon
        variant="subtle"
        size="lg"
        aria-label="Log"
        onClick={() => navigate(APP_ROUTES.log)}
      >
        <IconList size={20} />
      </ActionIcon>
    </Group>
  );
}
