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
import { useTranslation } from "react-i18next";
import { DistanceInput } from "@/components/ui/distance-input.component";
import { useAddRunForm } from "@/hooks/use-add-run-form.hook";
import { isRunWhere } from "@/utils/runs.utils";

interface AddDrawerProps {
  /** Whether the drawer is open. */
  opened: boolean;
  /** Called when the drawer requests to close. */
  onClose(): void;
}

/** Bottom drawer for logging a new run, with success/miss feedback against the goal pace. */
export function AddDrawer({ opened, onClose }: AddDrawerProps) {
  const { t } = useTranslation();
  const form = useAddRunForm({ onClose });

  return (
    <Drawer
      opened={opened}
      onClose={form.close}
      position="bottom"
      size="md"
      title={t("appShell.addDrawer.title")}
      padding="md"
      trapFocus={true}
      transitionProps={{
        duration: 200,
        transition: "slide-up",
        onEntered: () => form.inputRef.current?.focus(),
      }}
    >
      {form.isValidRange ? (
        <Stack gap="xl" pt="md">
          <DistanceInput
            label={t("appShell.addDrawer.distance")}
            value={form.distance}
            onChange={form.setDistance}
            ref={form.inputRef}
          />
          <SegmentedControl
            fullWidth
            value={form.where}
            onChange={(value) => isRunWhere(value) && form.setWhere(value)}
            data={[
              { label: t("appShell.addDrawer.indoor"), value: "indoor" },
              { label: t("appShell.addDrawer.outdoor"), value: "outdoor" },
            ]}
          />
          <DateInput
            label={t("appShell.addDrawer.trainingDay")}
            value={form.date}
            maxDate={form.maxDate}
            minDate={form.minDate}
            onChange={form.changeDate}
          />
          <Group justify="flex-end" mt="md">
            <Button onClick={form.save} disabled={form.distance === ""}>
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
