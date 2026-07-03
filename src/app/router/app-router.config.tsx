import { HomePage } from "@pages/home/home.page";
import { LogPage } from "@pages/log/log.page";
import { NotFoundPage } from "@pages/not-found/not-found.page";
import { APP_ROUTES } from "@shared/config/constants.const";
import { AppShell } from "@widgets/app-shell/app-shell.component";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: APP_ROUTES.log.slice(1), element: <LogPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
