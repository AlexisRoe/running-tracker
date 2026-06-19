import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import { theme } from "@app/providers/theme.config";
import { router } from "@app/router/app-router.config";
import { RouterProvider } from "react-router";

export function AppProviders() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
