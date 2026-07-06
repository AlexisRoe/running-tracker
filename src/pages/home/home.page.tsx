import { useDashboard } from "@features/dashboard/use-dashboard.hook";
import { useYearlyWeeks } from "@features/dashboard/use-yearly-weeks.hook";
import { Container, Space, Stack, Title } from "@mantine/core";
import { APP_ROUTES } from "@shared/config/constants.const";
import { GoalProgress } from "@widgets/dashboard/goal-progress.component";
import { PaceChart } from "@widgets/dashboard/pace-chart.component";
import { ScheduleBanner } from "@widgets/dashboard/schedule-banner.component";
import { SetGoalCta } from "@widgets/dashboard/set-goal-cta.component";
import { StatsGrid } from "@widgets/dashboard/stats-grid.component";
import { YearlyWeeks } from "@widgets/dashboard/yearly-weeks.component";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

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
