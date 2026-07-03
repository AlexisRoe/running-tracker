import { useGoal } from "@features/goal/use-goal.hook";
import { Button, Card, Drawer, Group, NumberInput, Space, Stack, Text } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { notifications } from "@mantine/notifications";
import { ValidationError } from "@shared/errors/validation.error";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface GoalDrawerProps {
  opened: boolean;
  onClose(): void;
}

export function GoalDrawer({ opened, onClose }: GoalDrawerProps) {
  const { t } = useTranslation();
  const goal = useGoal();
  const [start, setStart] = useState<Date | null>(goal.isSet ? new Date(goal.value.start) : null);
  const [end, setEnd] = useState<Date | null>(goal.isSet ? new Date(goal.value.end) : null);
  const [distance, setDistance] = useState<number | string>(goal.isSet ? goal.value.distance : "");

  const dateError =
    start && end && end.getTime() <= start.getTime() ? t("appShell.goalDrawer.dateError") : null;

  const now = Date.now();
  const status = !goal.isSet
    ? "notSet"
    : now < goal.value.start
      ? "notStarted"
      : now > goal.value.end
        ? "ended"
        : "running";

  const handleSave = () => {
    if (!start || !end || dateError) return;

    try {
      goal.set({ start, end, distance });
    } catch (err) {
      if (err instanceof ValidationError) {
        notifications.show({ color: "red", message: err.message });
        return;
      }
      throw err;
    }
  };

  const handleReset = () => {
    goal.reset();
    setStart(null);
    setEnd(null);
    setDistance("");
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
        <Card withBorder padding="sm">
          <Text size="sm">{t(`appShell.goalDrawer.status.${status}`)}</Text>
          {goal.isSet && goal.requiredDistancePerDay !== null && (
            <Text size="sm" c="dimmed">
              {t("appShell.goalDrawer.perDay", { value: goal.requiredDistancePerDay.toFixed(2) })}
            </Text>
          )}
        </Card>

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
