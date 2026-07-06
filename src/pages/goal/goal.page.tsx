import { countInclusiveDays, toGoalEnd, toGoalStart } from "@features/goal/goal.utils";
import { useGoal } from "@features/goal/use-goal.hook";
import { Button, Container, Group, Stack, Text, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useDisclosure } from "@mantine/hooks";
import { DistanceInput } from "@shared/components/distance-input.component";
import { ValidationError } from "@shared/errors/validation.error";
import { ConfirmModal } from "@shared/ui/confirm-modal/confirm-modal.component";
import { notifyError, notifyInfo, notifySuccess } from "@shared/ui/notification/notify";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

const GOAL_NOTIFICATION_AUTO_CLOSE = 1500;

interface GoalFields {
  start: Date | null;
  end: Date | null;
  distance: number | string;
}

function fieldsFromGoal(goal: ReturnType<typeof useGoal>): GoalFields {
  return {
    start: goal.isSet ? new Date(goal.value.start) : null,
    end: goal.isSet ? new Date(goal.value.end) : null,
    distance: goal.isSet ? goal.value.distance : "",
  };
}

function addOneYearMinusOneDay(date: Date): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + 1);
  result.setDate(result.getDate() - 1);
  return result;
}

interface GoalSummaryRowProps {
  label: string;
  value: string;
}

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
        distance: Number(distance).toFixed(2),
        perDay: perDay.toFixed(2),
      }),
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE,
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
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE,
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
                value={t("goal.summary.distanceValue", { km: goal.value.distance })}
              />
              {goal.requiredDistancePerDay !== null && (
                <GoalSummaryRow
                  label={t("goal.summary.pace")}
                  value={t("goal.summary.paceValue", {
                    km: goal.requiredDistancePerDay.toFixed(2),
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
            <Group justify="space-between" mt="xl">
              {goal.isSet && (
                <Group gap="sm">
                  <Button variant="subtle" color="red" onClick={openConfirm}>
                    {t("goal.clearGoal")}
                  </Button>
                  <Button variant="subtle" onClick={handleCancel}>
                    {t("goal.cancel")}
                  </Button>
                </Group>
              )}
              <Button size="lg" onClick={handleSave} disabled={saveDisabled} ml="auto">
                {goal.isSet ? t("goal.saveChanges") : t("goal.save")}
              </Button>
            </Group>
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
