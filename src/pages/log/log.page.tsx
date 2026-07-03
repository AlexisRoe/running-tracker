import { groupRunsByMonth } from "@features/runs/runs.utils";
import { useRuns } from "@features/runs/use-runs.hook";
import { Container, Stack, Text, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { RunList } from "./run-list.component";

export function LogPage() {
  const { t } = useTranslation();
  const runs = useRuns();
  const groups = groupRunsByMonth(runs.value);

  return (
    <Container>
      <Stack gap="md">
        <Title>{t("log.title")}</Title>
        {groups.length === 0 ? (
          <Stack gap={4} align="center" mt="xl">
            <Title order={3}>{t("log.emptyTitle")}</Title>
            <Text c="dimmed">{t("log.empty")}</Text>
          </Stack>
        ) : (
          <RunList groups={groups} onRemove={runs.remove} />
        )}
      </Stack>
    </Container>
  );
}
