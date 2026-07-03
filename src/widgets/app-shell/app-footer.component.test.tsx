import { theme } from "@app/providers/theme.config";
import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppFooter } from "@widgets/app-shell/app-footer.component";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it, vi } from "vitest";

function renderFooter(onAddClick = vi.fn()) {
  const router = createMemoryRouter(
    [
      { path: "/", element: <AppFooter onAddClick={onAddClick} /> },
      { path: "/log", element: <div>Log Page</div> },
      { path: "/goal", element: <div>Goal Page</div> },
      { path: "/settings", element: <div>Settings Page</div> },
    ],
    { initialEntries: ["/"] },
  );
  render(
    <MantineProvider theme={theme}>
      <RouterProvider router={router} />
    </MantineProvider>,
  );
  return { onAddClick };
}

describe("AppFooter", () => {
  it("renders Dashboard, Goal, Add, Log, and Settings buttons", () => {
    renderFooter();

    expect(screen.getByLabelText("Dashboard")).toBeInTheDocument();
    expect(screen.getByLabelText("Set goal")).toBeInTheDocument();
    expect(screen.getByLabelText("Add run")).toBeInTheDocument();
    expect(screen.getByLabelText("Log")).toBeInTheDocument();
    expect(screen.getByLabelText("Open settings")).toBeInTheDocument();
  });

  it("navigates to /log when Log is clicked", async () => {
    const user = userEvent.setup();
    renderFooter();

    await user.click(screen.getByLabelText("Log"));

    expect(screen.getByText("Log Page")).toBeInTheDocument();
  });

  it("navigates to /goal when Goal is clicked", async () => {
    const user = userEvent.setup();
    renderFooter();

    await user.click(screen.getByLabelText("Set goal"));

    expect(screen.getByText("Goal Page")).toBeInTheDocument();
  });

  it("navigates to /settings when Settings is clicked", async () => {
    const user = userEvent.setup();
    renderFooter();

    await user.click(screen.getByLabelText("Open settings"));

    expect(screen.getByText("Settings Page")).toBeInTheDocument();
  });

  it("calls onAddClick when Add is clicked", async () => {
    const user = userEvent.setup();
    const { onAddClick } = renderFooter();

    await user.click(screen.getByLabelText("Add run"));

    expect(onAddClick).toHaveBeenCalledOnce();
  });
});
