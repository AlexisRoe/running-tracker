import { Button, Group, Modal, Text } from "@mantine/core";

interface ConfirmModalProps {
  opened: boolean;
  onClose(): void;
  onConfirm(): void;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
}

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
