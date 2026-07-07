import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmModal } from "@/components/ui/confirm-modal.component";
import { DistanceInput } from "@/components/ui/distance-input.component";
import { notifyError, notifyInfo, notifySuccess } from "@/components/ui/notify";
import { GOAL_NOTIFICATION_AUTO_CLOSE_MS } from "@/config/constants.const";
import { ValidationError } from "@/config/validation.error";
import { useGoal } from "@/hooks/use-goal.hook";
import { formatDistance } from "@/utils/distance.utils";
import {
  addOneYearMinusOneDay,
  countInclusiveDays,
  toGoalEnd,
  toGoalStart,
} from "@/utils/goal.utils";

/** The goal form's editable field values (null/empty until filled in). */
interface GoalFields {
  /** Selected start date, or null if unset. */
  start: Date | null;
  /** Selected end date, or null if unset. */
  end: Date | null;
  /** Entered target distance in km, or "" while empty. */
  distance: number | string;
}

/** Maps the current stored goal into editable form fields (blanks when no goal is set). */
function fieldsFromGoal(goal: ReturnType<typeof useGoal>): GoalFields {
  return {
    start: goal.isSet ? new Date(goal.value.start) : null,
    end: goal.isSet ? new Date(goal.value.end) : null,
    distance: goal.isSet ? goal.value.distance : "",
  };
}

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
  const goal = useGoal();
  const [mode, setMode] = useState<"view" | "edit">(goal.isSet ? "view" : "edit");
  const [fields, setFields] = useState<GoalFields>(() => fieldsFromGoal(goal));
  const [snapshot, setSnapshot] = useState<GoalFields>(fields);
  const [endTouched, setEndTouched] = useState(false);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);
  const startInputRef = useRef<HTMLInputElement>(null);

  const { start, end, distance } = fields;

  useEffect(() => {
    if (mode === "edit") {
      startInputRef.current?.focus();
    }
  }, [mode]);

  const dateError = start && end && end.getTime() <= start.getTime() ? t("goal.dateError") : null;
  const isDirty =
    start?.getTime() !== snapshot.start?.getTime() ||
    end?.getTime() !== snapshot.end?.getTime() ||
    String(distance) !== String(snapshot.distance);
  const saveDisabled = !start || !end || !!dateError || distance === "" || !isDirty;

  const startEdit = () => {
    const initial = fieldsFromGoal(goal);
    setFields(initial);
    setSnapshot(initial);
    setEndTouched(false);
    setMode("edit");
  };

  const handleStartChange = (value: string | null) => {
    const newStart = value ? new Date(value) : null;
    setFields((prev) => ({
      ...prev,
      start: newStart,
      end: newStart && !endTouched ? addOneYearMinusOneDay(newStart) : prev.end,
    }));
  };

  const handleEndChange = (value: string | null) => {
    setEndTouched(true);
    setFields((prev) => ({ ...prev, end: value ? new Date(value) : null }));
  };

  const handleDistanceChange = (value: number | string) => {
    setFields((prev) => ({ ...prev, distance: value }));
  };

  const handleSave = () => {
    if (!start || !end || dateError) return;

    try {
      goal.set({ start, end, distance });
    } catch (err) {
      if (err instanceof ValidationError) {
        notifyError({ message: err.message });
        return;
      }
      throw err;
    }

    const days = countInclusiveDays(toGoalStart(start), toGoalEnd(end));
    const perDay = Number(distance) / days;

    notifySuccess({
      title: t("goal.setNotification.title"),
      message: t("goal.setNotification.body", {
        start: start.toLocaleDateString(i18n.language),
        end: end.toLocaleDateString(i18n.language),
        days,
        distance: formatDistance(Number(distance)),
        perDay: formatDistance(perDay),
      }),
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE_MS,
    });

    setMode("view");
  };

  const handleCancel = () => {
    setMode("view");
  };

  const handleClearConfirmed = () => {
    goal.reset();
    setFields({ start: null, end: null, distance: "" });
    setSnapshot({ start: null, end: null, distance: "" });
    setEndTouched(false);

    notifyInfo({
      title: t("goal.clearNotification.title"),
      message: t("goal.clearNotification.body"),
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE_MS,
    });

    setMode("edit");
  };

  return (
    <Container pt="md">
      <Stack gap="lg">
        <Title mb="sm">{t("goal.title")}</Title>

        {mode === "view" && goal.isSet ? (
          <>
            <Stack gap="md">
              <GoalSummaryRow
                label={t("goal.startDate")}
                value={new Date(goal.value.start).toLocaleDateString(i18n.language)}
              />
              <GoalSummaryRow
                label={t("goal.endDate")}
                value={new Date(goal.value.end).toLocaleDateString(i18n.language)}
              />
              <GoalSummaryRow
                label={t("goal.distance")}
                value={t("goal.summary.distanceValue", { km: formatDistance(goal.value.distance) })}
              />
              {goal.requiredDistancePerDay !== null && (
                <GoalSummaryRow
                  label={t("goal.summary.pace")}
                  value={t("goal.summary.paceValue", {
                    km: formatDistance(goal.requiredDistancePerDay),
                  })}
                />
              )}
            </Stack>
            <Group justify="flex-end" mt="xl">
              <Button size="lg" onClick={startEdit}>
                {t("goal.edit")}
              </Button>
            </Group>
          </>
        ) : (
          <>
            <DateInput
              ref={startInputRef}
              label={t("goal.startDate")}
              value={start}
              onChange={handleStartChange}
              highlightToday
            />
            <DateInput
              label={t("goal.endDate")}
              value={end}
              onChange={handleEndChange}
              error={dateError}
              highlightToday
            />
            <DistanceInput
              label={t("goal.distance")}
              value={distance}
              onChange={handleDistanceChange}
            />
            <Stack mt="xl" gap="lg">
              <Button fullWidth onClick={handleSave} disabled={saveDisabled} ml="auto">
                {goal.isSet ? t("goal.saveChanges") : t("goal.save")}
              </Button>
              {goal.isSet && (
                <Group grow>
                  <Button variant="outline" color="red" onClick={openConfirm}>
                    {t("goal.clearGoal")}
                  </Button>
                  <Button variant="outline" onClick={handleCancel}>
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
        onConfirm={handleClearConfirmed}
        title={t("goal.clearConfirm.title")}
        message={t("goal.clearConfirm.message")}
        confirmLabel={t("goal.clearConfirm.confirm")}
        cancelLabel={t("goal.clearConfirm.cancel")}
      />
    </Container>
  );
}
