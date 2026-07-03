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
      <MantineAppShell.Footer
        withBorder={false}
        style={{
          boxShadow:
            "0 -1px 0 var(--mantine-color-default-border), 0 -8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <AppFooter onAddClick={openAdd} />
      </MantineAppShell.Footer>
      <AddDrawer opened={addOpened} onClose={closeAdd} />
    </MantineAppShell>
  );
}
