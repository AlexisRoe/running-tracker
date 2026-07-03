import { screen } from "@testing-library/react";
import { AddDrawer } from "@widgets/app-shell/add-drawer.component";
import { describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "../../test/render-with-providers";

describe("AddDrawer", () => {
  it("renders the drawer content when opened", () => {
    renderWithProviders(<AddDrawer opened onClose={vi.fn()} />);

    expect(screen.getByText("Add Run")).toBeInTheDocument();
  });

  it("does not render drawer content when closed", () => {
    renderWithProviders(<AddDrawer opened={false} onClose={vi.fn()} />);

    expect(screen.queryByText("Add Run")).not.toBeInTheDocument();
  });
});
