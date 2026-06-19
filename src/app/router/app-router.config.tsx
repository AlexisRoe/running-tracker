import { HomePage } from "@pages/home/home.page";
import { NotFoundPage } from "@pages/not-found/not-found.page";
import { AppShell } from "@widgets/app-shell/app-shell.component";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
