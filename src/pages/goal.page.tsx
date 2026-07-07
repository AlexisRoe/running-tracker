import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/ui/confirm-modal.component";
import { DistanceInput } from "@/components/ui/distance-input.component";
import { useGoalForm } from "@/hooks/use-goal-form.hook";
import { formatDistance } from "@/utils/distance.utils";

interface GoalSummaryRowProps {
  /** Uppercase caption for the row. */
  label: string;
  /** Formatted value shown beneath the label. */
  value: string;
}

/** A labeled value row in the goal's read-only summary view. */
function GoalSummaryRow({ label, value }: GoalSummaryRowProps) {
  return (
    <Stack gap={2}>
      <Text size="xs" c="dimmed" tt="uppercase" fw={600} style={{ letterSpacing: "0.04em" }}>
        {label}
      </Text>
      <Text fw={700} size="lg">
        {value}
      </Text>
    </Stack>
  );
}

/** Goal route: view the current goal's summary, or create/edit/clear it. */
export function GoalPage() {
  const { t, i18n } = useTranslation();
  const form = useGoalForm();
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);

  const { start, end, distance } = form.fields;

  return (
    <Container pt="md">
      <Stack gap="lg">
        <Title mb="sm">{t("goal.title")}</Title>

        {form.mode === "view" && form.isSet ? (
          <>
            <Stack gap="md">
              <GoalSummaryRow
                label={t("goal.startDate")}
                value={new Date(form.summary.start).toLocaleDateString(i18n.language)}
              />
              <GoalSummaryRow
                label={t("goal.endDate")}
                value={new Date(form.summary.end).toLocaleDateString(i18n.language)}
              />
              <GoalSummaryRow
                label={t("goal.distance")}
                value={t("goal.summary.distanceValue", {
                  km: formatDistance(form.summary.distance),
                })}
              />
              {form.summary.requiredDistancePerDay !== null && (
                <GoalSummaryRow
                  label={t("goal.summary.pace")}
                  value={t("goal.summary.paceValue", {
                    km: formatDistance(form.summary.requiredDistancePerDay),
                  })}
                />
              )}
            </Stack>
            <Group justify="flex-end" mt="xl">
              <Button size="lg" onClick={form.startEdit}>
                {t("goal.edit")}
              </Button>
            </Group>
          </>
        ) : (
          <>
            <DateInput
              ref={form.startRef}
              label={t("goal.startDate")}
              value={start}
              onChange={form.changeStart}
              highlightToday
            />
            <DateInput
              label={t("goal.endDate")}
              value={end}
              onChange={form.changeEnd}
              error={form.dateError}
              highlightToday
            />
            <DistanceInput
              label={t("goal.distance")}
              value={distance}
              onChange={form.changeDistance}
            />
            <Stack mt="xl" gap="lg">
              <Button fullWidth onClick={form.save} disabled={form.saveDisabled} ml="auto">
                {form.isSet ? t("goal.saveChanges") : t("goal.save")}
              </Button>
              {form.isSet && (
                <Group grow>
                  <Button variant="outline" color="red" onClick={openConfirm}>
                    {t("goal.clearGoal")}
                  </Button>
                  <Button variant="outline" onClick={form.cancel}>
                    {t("goal.cancel")}
                  </Button>
                </Group>
              )}
            </Stack>
          </>
        )}
      </Stack>

      <ConfirmModal
        opened={confirmOpened}
        onClose={closeConfirm}
        onConfirm={form.clear}
        title={t("goal.clearConfirm.title")}
        message={t("goal.clearConfirm.message")}
        confirmLabel={t("goal.clearConfirm.confirm")}
        cancelLabel={t("goal.clearConfirm.cancel")}
      />
    </Container>
  );
}
