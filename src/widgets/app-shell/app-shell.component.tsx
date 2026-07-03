import { AppShell as MantineAppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AddDrawer } from "@widgets/app-shell/add-drawer.component";
import { AppFooter } from "@widgets/app-shell/app-footer.component";
import { Outlet } from "react-router";

export function AppShell() {
  const [addOpened, { open: openAdd, close: closeAdd }] = useDisclosure(false);

  return (
    <MantineAppShell footer={{ height: 80 }}>
      <MantineAppShell.Main>
        <Outlet />
      </MantineAppShell.Main>
      <MantineAppShell.Footer withBorder={false}>
        <AppFooter onAddClick={openAdd} />
      </MantineAppShell.Footer>
      <AddDrawer opened={addOpened} onClose={closeAdd} />
    </MantineAppShell>
  );
}
