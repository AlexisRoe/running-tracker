import type { RunningEvent } from "@features/runs/runs.model";
import { ActionIcon, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconHome, IconTrash, IconTrees } from "@tabler/icons-react";
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

  const WhereIcon = run.where === "outdoor" ? IconTrees : IconHome;

  return (
    <Card padding="sm">
      <Group justify="space-between" wrap="nowrap">
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon variant="light" size="lg" radius="md">
            <WhereIcon size={18} stroke={1.8} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text fw={600} size="sm">
              {dateLabel}
            </Text>
            <Text size="xs" c="dimmed">
              {run.distance} km · {t(`appShell.addDrawer.${run.where}`)}
            </Text>
          </Stack>
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
