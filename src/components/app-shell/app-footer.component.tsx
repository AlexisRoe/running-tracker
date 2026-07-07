import { ActionIcon, Group } from "@mantine/core";
import {
  IconHome,
  IconList,
  IconPlus,
  IconSettings,
  IconTarget,
  type TablerIcon,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router";
import { APP_ROUTES } from "@/config/constants.const";

interface AppFooterProps {
  /** Called when the central add-run button is tapped. */
  onAddClick(): void;
}

interface FooterTabProps {
  /** Icon shown for the tab. */
  icon: TablerIcon;
  /** Accessible label for the tab. */
  label: string;
  /** Route the tab navigates to; also determines its active state. */
  route: string;
}

/** A single navigation tab in the footer, highlighted when its route is active. */
function FooterTab({ icon: Icon, label, route }: FooterTabProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const active = pathname === route;

  return (
    <ActionIcon
      variant={active ? "light" : "subtle"}
      color={active ? "brand" : "gray"}
      size="xl"
      aria-label={label}
      aria-current={active ? "page" : undefined}
      onClick={() => navigate(route)}
    >
      <Icon size={26} stroke={active ? 2.2 : 1.8} />
    </ActionIcon>
  );
}

/** Bottom navigation bar with route tabs and a central add-run button. */
export function AppFooter({ onAddClick }: AppFooterProps) {
  const { t } = useTranslation();

  return (
    <Group px="md" pt="xs" pb="lg" justify="space-between" align="center" wrap="nowrap">
      <FooterTab icon={IconHome} label={t("appShell.footer.dashboard")} route={APP_ROUTES.home} />
      <FooterTab icon={IconTarget} label={t("appShell.footer.goal")} route={APP_ROUTES.goal} />

      <ActionIcon
        variant="filled"
        radius="xl"
        size={60}
        onClick={onAddClick}
        aria-label={t("appShell.footer.addRun")}
        style={{
          background: "linear-gradient(135deg, var(--mantine-color-brand-5), #d43d00 120%)",
          boxShadow: "0 6px 16px rgba(228, 89, 0, 0.35)",
          marginTop: -18,
        }}
      >
        <IconPlus size={30} />
      </ActionIcon>

      <FooterTab icon={IconList} label={t("appShell.footer.log")} route={APP_ROUTES.log} />
      <FooterTab
        icon={IconSettings}
        label={t("appShell.footer.settings")}
        route={APP_ROUTES.settings}
      />
    </Group>
  );
}
