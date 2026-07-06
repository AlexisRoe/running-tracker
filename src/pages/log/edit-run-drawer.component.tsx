import type { RunningEvent, RunWhere } from "@features/runs/runs.model";
import { useRuns } from "@features/runs/use-runs.hook";
import { Button, Drawer, Group, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { RunFormFields } from "@pages/log/run-form-fields.component";
import { ValidationError } from "@shared/errors/validation.error";
import { ConfirmModal } from "@shared/ui/confirm-modal/confirm-modal.component";
import { notifyError } from "@shared/ui/notification/notify";
import { useState } from "react";
import { useTranslation } from "react-i18next";

interface EditRunDrawerProps {
  run: RunningEvent | null;
  onClose(): void;
}

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
  run: RunningEvent;
  onClose(): void;
}

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
    </Stack>
  );
}
