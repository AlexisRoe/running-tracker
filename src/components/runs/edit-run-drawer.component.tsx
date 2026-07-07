import { Button, Drawer, Group, Space, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { RunFormFields } from "@/components/runs/run-form-fields.component";
import { ConfirmModal } from "@/components/ui/confirm-modal.component";
import { useEditRunForm } from "@/hooks/use-edit-run-form.hook";
import type { RunningEvent } from "@/types/runs.model";

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
  const form = useEditRunForm(run, onClose);
  const [confirmOpened, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);

  return (
    <Stack gap="xl" pt="md">
      <RunFormFields
        distance={form.distance}
        onDistanceChange={form.setDistance}
        where={form.where}
        onWhereChange={form.setWhere}
        date={form.date}
        onDateChange={form.setDate}
      />
      <Group justify="space-between" mt="md">
        <Button variant="subtle" color="red" onClick={openConfirm}>
          {t("log.editDrawer.delete")}
        </Button>
        <Button onClick={form.save} disabled={form.distance === ""}>
          {t("log.editDrawer.save")}
        </Button>
      </Group>

      <ConfirmModal
        opened={confirmOpened}
        onClose={closeConfirm}
        onConfirm={form.remove}
        title={t("log.deleteConfirm.title")}
        message={t("log.deleteConfirm.message")}
        confirmLabel={t("log.deleteConfirm.confirm")}
        cancelLabel={t("log.deleteConfirm.cancel")}
      />
      <Space h="2rem" />
    </Stack>
  );
}
