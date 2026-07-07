import { Container, Space, Stack, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { GoalProgress } from "@/components/dashboard/goal-progress.component";
import { PaceChart } from "@/components/dashboard/pace-chart.component";
import { ScheduleBanner } from "@/components/dashboard/schedule-banner.component";
import { SetGoalCta } from "@/components/dashboard/set-goal-cta.component";
import { StatsGrid } from "@/components/dashboard/stats-grid.component";
import { YearlyWeeks } from "@/components/dashboard/yearly-weeks.component";
import { APP_ROUTES } from "@/config/constants.const";
import { useDashboard } from "@/hooks/use-dashboard.hook";
import { useYearlyWeeks } from "@/hooks/use-yearly-weeks.hook";

/** Dashboard route: shows goal progress and stats, or a set-goal prompt when no goal exists. */
export function HomePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isGoalSet, metrics, paceSeries } = useDashboard();
  const yearlyWeeks = useYearlyWeeks();

  return (
    <Container pt="md">
      <Stack gap="md">
        <Title>{t("dashboard.title")}</Title>

        {isGoalSet && metrics ? (
          <>
            <ScheduleBanner metrics={metrics} />
            <GoalProgress metrics={metrics} />
            <StatsGrid metrics={metrics} />
            <PaceChart data={paceSeries} />
            <YearlyWeeks
              year={yearlyWeeks.year}
              weeks={yearlyWeeks.weeks}
              canGoPrev={yearlyWeeks.canGoPrev}
              canGoNext={yearlyWeeks.canGoNext}
              onPrevYear={yearlyWeeks.goPrev}
              onNextYear={yearlyWeeks.goNext}
            />
          </>
        ) : (
          <SetGoalCta onSetGoal={() => navigate(APP_ROUTES.goal)} />
        )}

        <Space h="md" />
      </Stack>
    </Container>
  );
}
