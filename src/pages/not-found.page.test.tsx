import { MantineProvider } from "@mantine/core";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { describe, expect, it } from "vitest";
import { theme } from "@/app/theme.config";
import { NotFoundPage } from "@/pages/not-found.page";

describe("NotFoundPage", () => {
  it("renders 404 messaging", () => {
    const router = createMemoryRouter([{ path: "/anything", element: <NotFoundPage /> }], {
      initialEntries: ["/anything"],
    });
    render(
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>,
    );

    expect(screen.getByText("404")).toBeInTheDocument();
  });

  it("navigates home when 'Go home' is clicked", async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: "/", element: <div>Home</div> },
        { path: "/anything", element: <NotFoundPage /> },
      ],
      { initialEntries: ["/anything"] },
    );
    render(
      <MantineProvider theme={theme}>
        <RouterProvider router={router} />
      </MantineProvider>,
    );

    await user.click(screen.getByText("Go home"));

    expect(screen.getByText("Home")).toBeInTheDocument();
  });
});
