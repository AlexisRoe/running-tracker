import { SegmentedControl } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useTranslation } from "react-i18next";
import { DistanceInput } from "@/components/ui/distance-input.component";
import type { RunWhere } from "@/types/runs.model";

interface RunFormFieldsProps {
  distance: number | string;
  onDistanceChange(value: number | string): void;
  where: RunWhere;
  onWhereChange(value: RunWhere): void;
  date: Date;
  onDateChange(value: Date): void;
  focusDistanceOnMount?: boolean;
}

export function RunFormFields({
  distance,
  onDistanceChange,
  where,
  onWhereChange,
  date,
  onDateChange,
  focusDistanceOnMount,
}: RunFormFieldsProps) {
  const { t } = useTranslation();

  return (
    <>
      <DistanceInput
        label={t("appShell.addDrawer.distance")}
        value={distance}
        onChange={onDistanceChange}
        focusOnStart={focusDistanceOnMount}
      />
      <SegmentedControl
        fullWidth
        value={where}
        onChange={(value) => onWhereChange(value as RunWhere)}
        data={[
          { label: t("appShell.addDrawer.indoor"), value: "indoor" },
          { label: t("appShell.addDrawer.outdoor"), value: "outdoor" },
        ]}
      />
      <DateInput
        label={t("appShell.addDrawer.trainingDay")}
        value={date}
        onChange={(value) => onDateChange(value ? new Date(value) : new Date())}
      />
    </>
  );
}
