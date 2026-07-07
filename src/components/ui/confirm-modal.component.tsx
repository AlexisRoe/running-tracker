import { Button, Group, Modal, Text } from "@mantine/core";

interface ConfirmModalProps {
  /** Whether the modal is open. */
  opened: boolean;
  /** Called when the modal is dismissed or cancelled. */
  onClose(): void;
  /** Called when the user confirms; the modal closes afterward. */
  onConfirm(): void;
  /** Modal heading. */
  title: string;
  /** Body text describing the action being confirmed. */
  message: string;
  /** Label for the confirm (destructive) button. */
  confirmLabel: string;
  /** Label for the cancel button. */
  cancelLabel: string;
}

/** Generic confirm/cancel modal for a destructive or irreversible action. */
export function ConfirmModal({
  opened,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel,
  cancelLabel,
}: ConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={title}
      centered
      transitionProps={{ duration: 0 }}
    >
      <Text size="sm">{message}</Text>
      <Group justify="flex-end" mt="lg">
        <Button variant="default" onClick={onClose}>
          {cancelLabel}
        </Button>
        <Button color="red" onClick={handleConfirm}>
          {confirmLabel}
        </Button>
      </Group>
    </Modal>
  );
}
