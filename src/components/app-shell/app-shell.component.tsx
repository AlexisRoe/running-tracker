import { AppShell as MantineAppShell } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "react-router";
import { AddDrawer } from "@/components/app-shell/add-drawer.component";
import { AppFooter } from "@/components/app-shell/app-footer.component";

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
