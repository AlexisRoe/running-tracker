import { Button, Drawer, Group, Space, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { RunFormFields } from "@/components/runs/run-form-fields.component";
import { ConfirmModal } from "@/components/ui/confirm-modal.component";
import { notifyError } from "@/components/ui/notify";
import { ValidationError } from "@/config/validation.error";
import { useRuns } from "@/hooks/use-runs.hook";
import type { RunningEvent, RunWhere } from "@/types/runs.model";

interface EditRunDrawerProps {
  /** The run being edited; the drawer is open while this is non-null. */
  run: RunningEvent | null;
  /** Called when the drawer requests to close. */
  onClose(): void;
}

/** Bottom drawer that hosts the edit form for a selected run. */
export function EditRunDrawer({ run, onClose }: EditRunDrawerProps) {
  const { t } = useTranslation();

  return (
    <Drawer
      opened={run !== null}
      onClose={onClose}
      position="bottom"
      size="md"
      title={t("log.editDrawer.title")}
      padding="md"
      transitionProps={{ duration: 0 }}
    >
      {run && <EditRunForm key={run.id} run={run} onClose={onClose} />}
    </Drawer>
  );
}

interface EditRunFormProps {
  /** The run whose values seed and are saved by the form. */
  run: RunningEvent;
  /** Called after a successful save or delete to close the drawer. */
  onClose(): void;
}

/** Form to edit or delete a single run, with validation and a delete confirmation. */
function EditRunForm({ run, onClose }: EditRunFormProps) {
  const { t } = useTranslation();
  const runs = useRuns();
  const [distance, setDistance] = useState<number | string>(run.distance);
  const [where, setWhere] = useState<RunWhere>(run.where);
  const [date, setDate] = useState(new Date(run.date));
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);

  const handleSave = () => {
    try {
      runs.update(run.id, { distance, where, date: date.getTime() });
    } catch (err) {
      if (err instanceof ValidationError) {
        notifyError({ message: err.message });
        return;
      }
      throw err;
    }

    onClose();
  };

  const handleDelete = () => {
    runs.remove(run.id);
    onClose();
  };

  return (
    <Stack gap="xl" pt="md">
      <RunFormFields
        distance={distance}
        onDistanceChange={setDistance}
        where={where}
        onWhereChange={setWhere}
        date={date}
        onDateChange={setDate}
      />
      <Group justify="space-between" mt="md">
        <Button variant="subtle" color="red" onClick={openConfirm}>
          {t("log.editDrawer.delete")}
        </Button>
        <Button onClick={handleSave} disabled={distance === ""}>
          {t("log.editDrawer.save")}
        </Button>
      </Group>

      <ConfirmModal
        opened={confirmOpened}
        onClose={closeConfirm}
        onConfirm={handleDelete}
        title={t("log.deleteConfirm.title")}
        message={t("log.deleteConfirm.message")}
        confirmLabel={t("log.deleteConfirm.confirm")}
        cancelLabel={t("log.deleteConfirm.cancel")}
      />
      <Space h="2rem" />
    </Stack>
  );
}
