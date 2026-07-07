import { createBrowserRouter } from "react-router";
import { AppShell } from "@/components/app-shell/app-shell.component";
import { APP_ROUTES } from "@/config/constants.const";
import { GoalPage } from "@/pages/goal.page";
import { HomePage } from "@/pages/home.page";
import { LogPage } from "@/pages/log.page";
import { NotFoundPage } from "@/pages/not-found.page";
import { SettingsPage } from "@/pages/settings.page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: APP_ROUTES.log.slice(1), element: <LogPage /> },
      { path: APP_ROUTES.goal.slice(1), element: <GoalPage /> },
      { path: APP_ROUTES.settings.slice(1), element: <SettingsPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
