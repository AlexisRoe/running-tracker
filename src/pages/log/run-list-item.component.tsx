import type { RunningEvent } from "@features/runs/runs.model";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import { IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

interface RunListItemProps {
  run: RunningEvent;
  onRemove(id: string): void;
}

export function RunListItem({ run, onRemove }: RunListItemProps) {
  const { t, i18n } = useTranslation();

  const dateLabel = new Date(run.date).toLocaleDateString(i18n.language, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <Card withBorder padding="md">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="xs" wrap="nowrap">
          <Text fw={700}>{dateLabel}</Text>
          <Text size="sm" c="dimmed">
            {run.distance} km · {t(`appShell.addDrawer.${run.where}`)}
          </Text>
        </Group>
        <ActionIcon
          variant="subtle"
          color="red"
          aria-label={t("log.deleteRun")}
          onClick={() => onRemove(run.id)}
        >
          <IconTrash size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
