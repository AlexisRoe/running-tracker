import { notifications } from "@mantine/notifications";

interface NotifyOptions {
  title?: string;
  message: string;
  autoClose?: number | false;
}

export function notifySuccess(options: NotifyOptions) {
  notifications.show({ color: "green", ...options });
}

export function notifyError(options: NotifyOptions) {
  notifications.show({ color: "red", ...options });
}

export function notifyInfo(options: NotifyOptions) {
  notifications.show({ color: "blue", ...options });
}

export function notifyWarning(options: NotifyOptions) {
  notifications.show({ color: "yellow", ...options });
}
