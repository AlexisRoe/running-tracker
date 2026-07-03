import type { PacePoint } from "@features/dashboard/dashboard.model";
import { LineChart } from "@mantine/charts";
import { Paper, Text } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface PaceChartProps {
  data: PacePoint[];
}

/** Ideal vs. actual cumulative distance over the trailing 30 days. */
export function PaceChart({ data }: PaceChartProps) {
  const { t, i18n } = useTranslation();

  const chartData = data.map((point) => ({
    label: new Date(point.date).toLocaleDateString(i18n.language, {
      day: "2-digit",
      month: "2-digit",
    }),
    ideal: point.ideal,
    actual: point.actual,
  }));

  return (
    <Paper withBorder radius="md" p="md">
      <Text fw={600} mb="sm">
        {t("dashboard.chart.title")}
      </Text>
      <LineChart
        h={220}
        data={chartData}
        dataKey="label"
        withDots={false}
        curveType="monotone"
        valueFormatter={(value) => `${value} km`}
        xAxisProps={{ interval: "preserveStartEnd", minTickGap: 24 }}
        series={[
          { name: "ideal", label: t("dashboard.chart.ideal"), color: "gray.5" },
          { name: "actual", label: t("dashboard.chart.actual"), color: "brand.6" },
        ]}
      />
    </Paper>
  );
}
