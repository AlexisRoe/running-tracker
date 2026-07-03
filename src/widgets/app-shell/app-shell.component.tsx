import { AppShell as MantineAppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AddDrawer } from "@widgets/app-shell/add-drawer.component";
import { AppFooter } from "@widgets/app-shell/app-footer.component";
import { AppHeader } from "@widgets/app-shell/app-header.component";
import { GoalDrawer } from "@widgets/app-shell/goal-drawer.component";
import { SettingsDrawer } from "@widgets/app-shell/settings-drawer.component";
import { Outlet } from "react-router";

export function AppShell() {
  const [settingsOpened, { open: openSettings, close: closeSettings }] = useDisclosure(false);
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);
  const [goalOpened, { open: openGoal, close: closeGoal }] = useDisclosure(false);

  return (
    <MantineAppShell header={{ height: 108 }} footer={{ height: 100 }} padding="25px">
      <MantineAppShell.Header>
        <AppHeader onSettingsClick={openSettings} onGoalClick={openGoal} />
      </MantineAppShell.Header>
      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
      <MantineAppShell.Footer>
        <AppFooter onAddClick={openAdd} />
      </MantineAppShell.Footer>
      <SettingsDrawer opened={settingsOpened} onClose={closeSettings} />
      <AddDrawer opened={addOpened} onClose={closeAdd} />
      <GoalDrawer opened={goalOpened} onClose={closeGoal} />
    </MantineAppShell>
  );
}
