import { countInclusiveDays, toGoalEnd, toGoalStart } from "@features/goal/goal.utils";
import { useGoal } from "@features/goal/use-goal.hook";
import { Button, Container, Group, NumberInput, Stack, Title } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { DistanceInput } from "@shared/components/distance-input.component";
import { ValidationError } from "@shared/errors/validation.error";
import { notifyError, notifyInfo, notifySuccess } from "@shared/ui/notification/notify";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const GOAL_NOTIFICATION_AUTO_CLOSE = 8000;

export function GoalPage() {
  const { t, i18n } = useTranslation();
  const goal = useGoal();
  const [start, setStart] = useState<Date | null>(goal.isSet ? new Date(goal.value.start) : null);
  const [end, setEnd] = useState<Date | null>(goal.isSet ? new Date(goal.value.end) : null);
  const [distance, setDistance] = useState<number | string>(goal.isSet ? goal.value.distance : "");

  const dateError = start && end && end.getTime() <= start.getTime() ? t("goal.dateError") : null;

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
  };

  const handleReset = () => {
    goal.reset();
    setStart(null);
    setEnd(null);
    setDistance("");

    notifyInfo({
      title: t("goal.resetNotification.title"),
      message: t("goal.resetNotification.body"),
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE,
    });
  };

  return (
    <Container pt="md">
      <Stack gap="lg">
        <Title mb="sm">{t("goal.title")}</Title>
        <DateInput
          label={t("goal.startDate")}
          value={start}
          onChange={(value) => setStart(value ? new Date(value) : null)}
        />
        <DateInput
          label={t("goal.endDate")}
          value={end}
          onChange={(value) => setEnd(value ? new Date(value) : null)}
          error={dateError}
        />
        <DistanceInput label={t("goal.distance")} value={distance} onChange={setDistance} />
        <Group justify="space-between" mt="xl">
          {goal.isSet && (
            <Button variant="subtle" color="red" onClick={handleReset}>
              {t("goal.reset")}
            </Button>
          )}
          <Button size="lg" onClick={handleSave} disabled={!start || !end || !!dateError} ml="auto">
            {t("goal.save")}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
}
