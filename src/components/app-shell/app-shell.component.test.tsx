import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { theme } from "@/app/theme.config";
import { AppShell } from "@/components/app-shell/app-shell.component";
import { HomePage } from "@/pages/home.page";

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

    expect(await screen.findByText("Add Run")).toBeInTheDocument();
  });
});
