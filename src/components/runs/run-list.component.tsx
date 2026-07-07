import { Accordion, Stack } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { RunListItem } from "@/components/runs/run-list-item.component";
import type { RunningEvent } from "@/types/runs.model";
import { formatDistance } from "@/utils/distance.utils";
import type { YearGroup } from "@/utils/runs.utils";
import { capitalize } from "@/utils/string.utils";

interface RunListProps {
  /** Runs grouped by year then month, newest-first, as produced by groupRunsByYearAndMonth. */
  groups: YearGroup[];
  /** Called with the run the user chose to edit. */
  onEdit(run: RunningEvent): void;
}

/** Collapsible year → month → run log of all recorded runs. */
export function RunList({ groups, onEdit }: RunListProps) {
  const { t, i18n } = useTranslation();
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonthStart = new Date(currentYear, now.getMonth(), 1).getTime();

  return (
    <Accordion
      multiple
      defaultValue={[String(currentYear)]}
      variant="separated"
      styles={{ item: { border: "none" } }}
    >
      {groups.map((yearGroup) => (
        <Accordion.Item key={yearGroup.year} value={String(yearGroup.year)}>
          <Accordion.Control>{yearGroup.year}</Accordion.Control>
          <Accordion.Panel>
            <Accordion
              multiple
              variant="separated"
              defaultValue={yearGroup.year === currentYear ? [String(currentMonthStart)] : []}
              styles={{ item: { border: "none" }, content: { padding: "0.5rem" } }}
            >
              {yearGroup.months.map((monthGroup) => (
                <Accordion.Item key={monthGroup.monthStart} value={String(monthGroup.monthStart)}>
                  <Accordion.Control>
                    {t("log.monthTotal", {
                      month: capitalize(
                        new Date(monthGroup.monthStart).toLocaleDateString(i18n.language, {
                          month: "long",
                        }),
                      ),
                      km: formatDistance(monthGroup.totalDistance),
                    })}
                  </Accordion.Control>
                  <Accordion.Panel>
                    <Stack gap="xs">
                      {monthGroup.runs.map((run) => (
                        <RunListItem key={run.id} run={run} onEdit={onEdit} />
                      ))}
                    </Stack>
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
