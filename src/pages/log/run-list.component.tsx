import type { RunGroup } from "@features/runs/runs.utils";
import { Stack, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { RunListItem } from "./run-list-item.component";

interface RunListProps {
  groups: RunGroup[];
  onRemove(id: string): void;
}

export function RunList({ groups, onRemove }: RunListProps) {
  const { i18n } = useTranslation();

  return (
    <Stack gap="lg">
      {groups.map((group) => (
        <Stack gap="xs" key={group.monthStart}>
          <Text fw={600} tt="capitalize">
            {new Date(group.monthStart).toLocaleDateString(i18n.language, {
              month: "long",
              year: "numeric",
            })}
          </Text>
          <Stack gap="xs">
            {group.runs.map((run) => (
              <RunListItem key={run.id} run={run} onRemove={onRemove} />
            ))}
          </Stack>
        </Stack>
      ))}
    </Stack>
  );
}
