import { Group, AppShell as MantineAppShell, Title } from "@mantine/core";
import { ThemeToggle } from "@widgets/app-shell/theme-toggle.component";
import { Outlet } from "react-router";

export function AppShell() {
  return (
    <MantineAppShell header={{ height: 56 }} padding="md">
      <MantineAppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Title order={4}>Running Tracker</Title>
          <ThemeToggle />
        </Group>
      </MantineAppShell.Header>
      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
    </MantineAppShell>
  );
}
