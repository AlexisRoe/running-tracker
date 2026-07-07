import { SegmentedControl } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useTranslation } from "react-i18next";
import { DistanceInput } from "@/components/ui/distance-input.component";
import type { RunWhere } from "@/types/runs.model";

interface RunFormFieldsProps {
  /** Current distance value in km (or "" while empty). */
  distance: number | string;
  /** Called when the distance changes. */
  onDistanceChange(value: number | string): void;
  /** Current run location. */
  where: RunWhere;
  /** Called when the location changes. */
  onWhereChange(value: RunWhere): void;
  /** Current run date. */
  date: Date;
  /** Called when the date changes. */
  onDateChange(value: Date): void;
  /** Focus the distance input shortly after mount. */
  focusDistanceOnMount?: boolean;
}

/** Shared distance / location / date inputs used by the add and edit run forms. */
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
