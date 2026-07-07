import {
  Button,
  Drawer,
  Group,
  SegmentedControl,
  Space,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { IconCalendarOff } from "@tabler/icons-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { fireConfetti } from "@/components/ui/confetti";
import { DistanceInput } from "@/components/ui/distance-input.component";
import { notifyError, notifySuccess, notifyWarning } from "@/components/ui/notify";
import { ValidationError } from "@/config/validation.error";
import { useGoal } from "@/hooks/use-goal.hook";
import { useRuns } from "@/hooks/use-runs.hook";
import { formatDistance } from "@/utils/distance.utils";

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

  const inputRef = useRef<HTMLInputElement | null>(null);

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

      if (met) {
        fireConfetti();
      }

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

  const minDate = new Date(goal.value.start);
  const maxDate = today.getTime() > goal.value.end ? new Date(goal.value.end) : today;

  const handleAdjustDate = (value: string | null) => {
    setToday(value ? new Date(value) : new Date());
  };

  const now = DEFAULT_ADD_VALUES.Today.getTime();
  const startDate = goal.value.start;
  const isValidRange = goal.isSet && now >= startDate;

  return (
    <Drawer
      opened={opened}
      onClose={handleClose}
      position="bottom"
      size="md"
      title={t("appShell.addDrawer.title")}
      padding="md"
      trapFocus={true}
      transitionProps={{
        duration: 200,
        transition: "slide-up",
        onEntered: () => inputRef.current?.focus(),
      }}
    >
      {isValidRange ? (
        <Stack gap="xl" pt="md">
          <DistanceInput
            label={t("appShell.addDrawer.distance")}
            value={distance}
            onChange={setDistance}
            ref={inputRef}
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
            maxDate={maxDate}
            minDate={minDate}
            onChange={handleAdjustDate}
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={handleSave} disabled={distance === ""}>
              {t("appShell.addDrawer.save")}
            </Button>
          </Group>
          <Space h="2rem" />
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
          <Space h="2rem" />
        </Stack>
      )}
    </Drawer>
  );
}
