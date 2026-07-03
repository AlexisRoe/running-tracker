import { notifications } from "@mantine/notifications";
import {
  notifyError,
  notifyInfo,
  notifySuccess,
  notifyWarning,
} from "@shared/ui/notification/notify";
import { describe, expect, it, vi } from "vitest";

vi.mock("@mantine/notifications", () => ({
  notifications: { show: vi.fn() },
}));

describe("notify helpers", () => {
  it("notifySuccess shows a green notification with the passed options", () => {
    notifySuccess({ title: "Saved", message: "All good" });

    expect(notifications.show).toHaveBeenCalledWith({
      color: "green",
      title: "Saved",
      message: "All good",
    });
  });

  it("notifyError shows a red notification with the passed options", () => {
    notifyError({ message: "Something broke" });

    expect(notifications.show).toHaveBeenCalledWith({
      color: "red",
      message: "Something broke",
    });
  });

  it("notifyInfo shows a blue notification with the passed options", () => {
    notifyInfo({ message: "FYI" });

    expect(notifications.show).toHaveBeenCalledWith({
      color: "blue",
      message: "FYI",
    });
  });

  it("notifyWarning shows a yellow notification with the passed options", () => {
    notifyWarning({ message: "Heads up" });

    expect(notifications.show).toHaveBeenCalledWith({
      color: "yellow",
      message: "Heads up",
    });
  });
});
