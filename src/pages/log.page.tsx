import { Container, Stack, Text, Title } from "@mantine/core";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { EditRunDrawer } from "@/components/runs/edit-run-drawer.component";
import { RunList } from "@/components/runs/run-list.component";
import { useRuns } from "@/hooks/use-runs.hook";
import type { RunningEvent } from "@/types/runs.model";
import { groupRunsByYearAndMonth } from "@/utils/runs.utils";

export function LogPage() {
  const { t } = useTranslation();
  const runs = useRuns();
  const groups = groupRunsByYearAndMonth(runs.value);
  const [editing, setEditing] = useState<RunningEvent | null>(null);

  return (
    <Container pt="md">
      <Stack gap="md">
        <Title>{t("log.title")}</Title>
        {groups.length === 0 ? (
          <Stack gap={4} align="center" mt="xl">
            <Title order={3}>{t("log.emptyTitle")}</Title>
            <Text c="dimmed">{t("log.empty")}</Text>
          </Stack>
        ) : (
          <RunList groups={groups} onEdit={setEditing} />
        )}
      </Stack>
      <EditRunDrawer run={editing} onClose={() => setEditing(null)} />
    </Container>
  );
}
