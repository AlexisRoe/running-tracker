import { theme } from "@app/providers/theme.config";
import { MantineProvider } from "@mantine/core";
import { HomePage } from "@pages/home/home.page";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppShell } from "@widgets/app-shell/app-shell.component";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";

function renderAppShell() {
  const router = createMemoryRouter(
    [{ path: "/", element: <AppShell />, children: [{ index: true, element: <HomePage /> }] }],
    { initialEntries: ["/"] },
  );
  render(
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>,
  );
}

describe("AppShell", () => {
  it("renders routed content and the footer", () => {
    renderAppShell();

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByLabelText("Add run")).toBeInTheDocument();
  });

  it("opens the add drawer when the Add button is clicked", async () => {
    const user = userEvent.setup();
    renderAppShell();

    await user.click(screen.getByLabelText("Add run"));

    expect(screen.getByText("Add Run")).toBeInTheDocument();
  });
});
