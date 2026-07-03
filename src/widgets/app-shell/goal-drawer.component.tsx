import { countInclusiveDays, toGoalEnd, toGoalStart } from "@features/goal/goal.utils";
import { useGoal } from "@features/goal/use-goal.hook";
import { Button, Drawer, Group, NumberInput, Space, Stack } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { ValidationError } from "@shared/errors/validation.error";
import { notifyError, notifyInfo, notifySuccess } from "@shared/ui/notification/notify";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const GOAL_NOTIFICATION_AUTO_CLOSE = 8000;

interface GoalDrawerProps {
  opened: boolean;
  onClose(): void;
}

export function GoalDrawer({ opened, onClose }: GoalDrawerProps) {
  const { t, i18n } = useTranslation();
  const goal = useGoal();
  const [start, setStart] = useState<Date | null>(goal.isSet ? new Date(goal.value.start) : null);
  const [end, setEnd] = useState<Date | null>(goal.isSet ? new Date(goal.value.end) : null);
  const [distance, setDistance] = useState<number | string>(goal.isSet ? goal.value.distance : "");

  const dateError =
    start && end && end.getTime() <= start.getTime() ? t("appShell.goalDrawer.dateError") : null;

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
      title: t("appShell.goalDrawer.setNotification.title"),
      message: t("appShell.goalDrawer.setNotification.body", {
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
      title: t("appShell.goalDrawer.resetNotification.title"),
      message: t("appShell.goalDrawer.resetNotification.body"),
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE,
    });
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      title={t("appShell.goalDrawer.title")}
      padding="md"
      transitionProps={{ duration: 0 }}
    >
      <Stack gap="md">
        <DateInput
          label={t("appShell.goalDrawer.startDate")}
          value={start}
          onChange={(value) => setStart(value ? new Date(value) : null)}
        />
        <DateInput
          label={t("appShell.goalDrawer.endDate")}
          value={end}
          onChange={(value) => setEnd(value ? new Date(value) : null)}
          error={dateError}
        />
        <NumberInput
          label={t("appShell.goalDrawer.distance")}
          value={distance}
          onChange={setDistance}
          min={0}
          suffix=" km"
        />
        <Group justify="space-between" mt="md">
          {goal.isSet && (
            <Button variant="subtle" color="red" onClick={handleReset}>
              {t("appShell.goalDrawer.reset")}
            </Button>
          )}
          <Button onClick={handleSave} disabled={!start || !end || !!dateError} ml="auto">
            {t("appShell.goalDrawer.save")}
          </Button>
        </Group>
      </Stack>
      <Space h="xl" />
    </Drawer>
  );
}
