import { useGoal } from "@features/goal/use-goal.hook";
import { useRuns } from "@features/runs/use-runs.hook";
import { Button, Drawer, Group, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { RunFormFields } from "@pages/log/run-form-fields.component";
import { ValidationError } from "@shared/errors/validation.error";
import { notifyError, notifySuccess, notifyWarning } from "@shared/ui/notification/notify";
import { IconCalendarOff } from "@tabler/icons-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface AddDrawerProps {
  opened: boolean;
  onClose(): void;
}

export function AddDrawer({ opened, onClose }: AddDrawerProps) {
  const { t } = useTranslation();
  const runs = useRuns();
  const goal = useGoal();
  const [distance, setDistance] = useState<number | string>("");
  const [where, setWhere] = useState<"indoor" | "outdoor">("indoor");
  const [today, setToday] = useState(new Date());

  const reset = () => {
    setDistance("");
    setWhere("indoor");
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
    reset();
    onClose();

    if (goal.requiredDistancePerDay !== null) {
      const expected = goal.requiredDistancePerDay;
      const met = distanceRan >= expected;
      const notify = met ? notifySuccess : notifyWarning;

      notify({
        title: t(
          met ? "appShell.addDrawer.result.goodTitle" : "appShell.addDrawer.result.badTitle",
        ),
        message: t("appShell.addDrawer.result.body", {
          distance: distanceRan.toFixed(2),
          expected: expected.toFixed(2),
        }),
      });
    }
  };

  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="bottom"
      size="md"
      title={t("appShell.addDrawer.title")}
      padding="md"
      transitionProps={{ duration: 0 }}
    >
      {goal.isActive ? (
        <Stack gap="xl" pt="md">
          <RunFormFields
            distance={distance}
            onDistanceChange={setDistance}
            where={where}
            onWhereChange={setWhere}
            date={today}
            onDateChange={setToday}
            focusDistanceOnMount={opened}
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
