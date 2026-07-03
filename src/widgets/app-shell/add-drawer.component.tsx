import { useGoal } from "@features/goal/use-goal.hook";
import { useRuns } from "@features/runs/use-runs.hook";
import { Button, Drawer, Group, NumberInput, SegmentedControl, Stack } from "@mantine/core";
import { ValidationError } from "@shared/errors/validation.error";
import { notifyError, notifySuccess, notifyWarning } from "@shared/ui/notification/notify";
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

  const reset = () => {
    setDistance("");
    setWhere("indoor");
  };

  const handleSave = () => {
    try {
      runs.add({ distance, where });
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
      <Stack gap="md">
        <NumberInput
          label={t("appShell.addDrawer.distance")}
          value={distance}
          onChange={setDistance}
          min={0}
          suffix=" km"
          autoFocus
        />
        <SegmentedControl
          fullWidth
          value={where}
          onChange={(value) => setWhere(value as "indoor" | "outdoor")}
          data={[
            { label: t("appShell.addDrawer.indoor"), value: "indoor" },
            { label: t("appShell.addDrawer.outdoor"), value: "outdoor" },
          ]}
        />
        <Group justify="flex-end" mt="md">
          <Button onClick={handleSave} disabled={distance === ""}>
            {t("appShell.addDrawer.save")}
          </Button>
        </Group>
      </Stack>
    </Drawer>
  );
}
