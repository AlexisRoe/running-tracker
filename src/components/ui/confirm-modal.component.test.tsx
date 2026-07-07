import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ConfirmModal } from "@/components/ui/confirm-modal.component";
import { renderWithProviders } from "@/test/render-with-providers";

describe("ConfirmModal", () => {
  it("renders the title and message when opened", () => {
    renderWithProviders(
      <ConfirmModal
        opened
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Reset app data?"
        message="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );

    expect(screen.getByText("Reset app data?")).toBeInTheDocument();
    expect(screen.getByText("This cannot be undone.")).toBeInTheDocument();
  });

  it("does not render content when closed", () => {
    renderWithProviders(
      <ConfirmModal
        opened={false}
        onClose={vi.fn()}
        onConfirm={vi.fn()}
        title="Reset app data?"
        message="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );

    expect(screen.queryByText("Reset app data?")).not.toBeInTheDocument();
  });

  it("calls onConfirm and onClose when the confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    renderWithProviders(
      <ConfirmModal
        opened
        onClose={onClose}
        onConfirm={onConfirm}
        title="Reset app data?"
        message="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );

    await user.click(screen.getByText("Delete"));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls only onClose when the cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    renderWithProviders(
      <ConfirmModal
        opened
        onClose={onClose}
        onConfirm={onConfirm}
        title="Reset app data?"
        message="This cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
      />,
    );

    await user.click(screen.getByText("Cancel"));

    expect(onConfirm).not.toHaveBeenCalled();
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
