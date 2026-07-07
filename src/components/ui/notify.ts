import { notifications } from "@mantine/notifications";

/** Content and timing for a toast notification. */
interface NotifyOptions {
  /** Optional bold heading. */
  title?: string;
  /** Notification body text. */
  message: string;
  /** Auto-close delay in ms, or false to keep it open until dismissed. */
  autoClose?: number | false;
}

/** Shows a green success toast. */
export function notifySuccess(options: NotifyOptions) {
  notifications.show({ color: "green", ...options });
}

/** Shows a red error toast. */
export function notifyError(options: NotifyOptions) {
  notifications.show({ color: "red", ...options });
}

/** Shows a blue informational toast. */
export function notifyInfo(options: NotifyOptions) {
  notifications.show({ color: "blue", ...options });
}

/** Shows a yellow warning toast. */
export function notifyWarning(options: NotifyOptions) {
  notifications.show({ color: "yellow", ...options });
}
