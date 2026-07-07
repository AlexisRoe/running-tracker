import { ActionIcon, Card, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { IconPencil, IconTreadmill, IconTrees } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import type { RunningEvent } from "@/types/runs.model";
import { formatDistance } from "@/utils/distance.utils";

interface RunListItemProps {
  run: RunningEvent;
  onEdit(run: RunningEvent): void;
}

export function RunListItem({ run, onEdit }: RunListItemProps) {
  const { t, i18n } = useTranslation();

  const dateLabel = new Date(run.date).toLocaleDateString(i18n.language, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const WhereIcon = run.where === "outdoor" ? IconTrees : IconTreadmill;

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
              {formatDistance(run.distance)} km · {t(`appShell.addDrawer.${run.where}`)}
            </Text>
          </Stack>
        </Group>
        <ActionIcon variant="subtle" aria-label={t("log.editRun")} onClick={() => onEdit(run)}>
          <IconPencil size={18} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
