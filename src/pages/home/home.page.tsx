import { useDashboard } from "@features/dashboard/use-dashboard.hook";
import { Container, Space, Stack, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { GoalDrawer } from "@widgets/app-shell/goal-drawer.component";
import { GoalProgress } from "@widgets/dashboard/goal-progress.component";
import { PaceChart } from "@widgets/dashboard/pace-chart.component";
import { ScheduleBanner } from "@widgets/dashboard/schedule-banner.component";
import { SetGoalCta } from "@widgets/dashboard/set-goal-cta.component";
import { StatsGrid } from "@widgets/dashboard/stats-grid.component";
import { YearlyWeeks } from "@widgets/dashboard/yearly-weeks.component";
import { useTranslation } from "react-i18next";

export function HomePage() {
  const { t } = useTranslation();
  const { isGoalSet, metrics, paceSeries, weeks } = useDashboard();
  const [goalOpened, { open: openGoal, close: closeGoal }] = useDisclosure(false);

  return (
    <Container>
      <Stack gap="md">
        <Title>{t("dashboard.title")}</Title>

        {isGoalSet && metrics ? (
          <>
            <ScheduleBanner metrics={metrics} />
            <GoalProgress metrics={metrics} />
            <StatsGrid metrics={metrics} />
            <PaceChart data={paceSeries} />
          </>
        ) : (
          <SetGoalCta onSetGoal={openGoal} />
        )}

        <YearlyWeeks weeks={weeks} />
        <Space h="md" />
      </Stack>

      <GoalDrawer opened={goalOpened} onClose={closeGoal} />
    </Container>
  );
}
