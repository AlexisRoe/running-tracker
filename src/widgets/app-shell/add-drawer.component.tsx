import { useGoal } from "@features/goal/use-goal.hook";
import { useRuns } from "@features/runs/use-runs.hook";
import {
  Button,
  Drawer,
  Group,
  SegmentedControl,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { DistanceInput } from "@shared/components/distance-input.component";
import { ValidationError } from "@shared/errors/validation.error";
import { formatDistance } from "@shared/lib/distance.utils";
import { notifyError, notifySuccess, notifyWarning } from "@shared/ui/notification/notify";
import { IconCalendarOff } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddDrawerProps {
  opened: boolean;
  onClose(): void;
}

enum Where {
  Indoor = "indoor",
  OutDoor = "outdoor",
}

export function AddDrawer({ opened, onClose }: AddDrawerProps) {
  const DEFAULT_ADD_VALUES = {
    Distance: "",
    Where: Where.Indoor,
    Today: new Date(),
  };

  const { t } = useTranslation();
  const runs = useRuns();
  const goal = useGoal();
  const [distance, setDistance] = useState<number | string>(DEFAULT_ADD_VALUES.Distance);
  const [where, setWhere] = useState<Where>(DEFAULT_ADD_VALUES.Where);
  const [today, setToday] = useState(DEFAULT_ADD_VALUES.Today);

  const reset = () => {
    setDistance(DEFAULT_ADD_VALUES.Distance);
    setWhere(DEFAULT_ADD_VALUES.Where);
    setToday(DEFAULT_ADD_VALUES.Today);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleSave = () => {
    try {
      runs.add({ distance, where, date: today.getTime() });
    } catch (err) {
      if (err instanceof ValidationError) {
        notifyError({ message: err.message });
        return;
      }
      throw err;
    }

    const distanceRan = Number(distance);
    handleClose();

    if (goal.requiredDistancePerDay !== null) {
      const expected = goal.requiredDistancePerDay;
      const met = distanceRan >= expected;
      const notify = met ? notifySuccess : notifyWarning;

      notify({
        title: t(
          met ? "appShell.addDrawer.result.goodTitle" : "appShell.addDrawer.result.badTitle",
        ),
        message: t("appShell.addDrawer.result.body", {
          distance: formatDistance(distanceRan),
          expected: formatDistance(expected),
        }),
      });
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      position="bottom"
      size="md"
      title={t("appShell.addDrawer.title")}
      padding="md"
      transitionProps={{ duration: 0 }}
    >
      {goal.isActive ? (
        <Stack gap="xl" pt="md">
          <DistanceInput
            label={t("appShell.addDrawer.distance")}
            value={distance}
            onChange={setDistance}
            focusOnStart={opened}
          />
          <SegmentedControl
            fullWidth
            value={where}
            onChange={(v) => setWhere(v === Where.OutDoor ? Where.OutDoor : Where.Indoor)}
            data={[
              { label: t("appShell.addDrawer.indoor"), value: Where.Indoor },
              { label: t("appShell.addDrawer.outdoor"), value: Where.OutDoor },
            ]}
          />
          <DateInput
            label={t("appShell.addDrawer.trainingDay")}
            value={today}
            onChange={(value) => setToday(value ? new Date(value) : new Date())}
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleSave} disabled={distance === ""}>
              {t("appShell.addDrawer.save")}
            </Button>
          </Group>
        </Stack>
      ) : (
        <Stack align="center" gap="sm" py="xl">
          <ThemeIcon variant="light" size={80} radius="xl">
            <IconCalendarOff size={44} stroke={1.5} />
          </ThemeIcon>
          <Title order={3}>{t("appShell.addDrawer.empty.title")}</Title>
          <Text c="dimmed" ta="center">
            {t("appShell.addDrawer.empty.body")}
          </Text>
        </Stack>
      )}
    </Drawer>
  );
}
