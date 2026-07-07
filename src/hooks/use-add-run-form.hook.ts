import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { fireConfetti } from "@/components/ui/confetti";
import { notifyError, notifySuccess, notifyWarning } from "@/components/ui/notify";
import { ValidationError } from "@/config/validation.error";
import { useGoal } from "@/hooks/use-goal.hook";
import { useRuns } from "@/hooks/use-runs.hook";
import type { RunWhere } from "@/types/runs.model";
import { formatDistance } from "@/utils/distance.utils";
import { evaluateRunAgainstGoal } from "@/utils/runs.utils";

/** Add-run form state, derived date bounds, and the save/close actions. */
interface UseAddRunForm {
  /** Current distance value in km (or "" while empty). */
  distance: number | string;
  /** Sets the distance value. */
  setDistance(value: number | string): void;
  /** Current run location. */
  where: RunWhere;
  /** Sets the run location. */
  setWhere(value: RunWhere): void;
  /** Currently selected training day. */
  date: Date;
  /** Updates the training day (falling back to today when cleared). */
  changeDate(value: string | null): void;
  /** Ref for the distance input, focused when the drawer finishes opening. */
  inputRef: React.RefObject<HTMLInputElement | null>;
  /** Whether a goal is set and today falls within its period (else show the empty state). */
  isValidRange: boolean;
  /** Earliest selectable training day (the goal start). */
  minDate: Date;
  /** Latest selectable training day (today, capped at the goal end). */
  maxDate: Date;
  /** Validates and records the run, notifies against the goal pace, and closes on success. */
  save(): void;
  /** Resets the fields and closes the drawer. */
  close(): void;
}

/** Owns the add-run form state plus the validate/record/notify/confetti orchestration. */
export function useAddRunForm({ onClose }: { onClose(): void }): UseAddRunForm {
  const { t } = useTranslation();
  const runs = useRuns();
  const goal = useGoal();
  const [distance, setDistance] = useState<number | string>("");
  const [where, setWhere] = useState<RunWhere>("indoor");
  const [date, setDate] = useState(() => new Date());
  const inputRef = useRef<HTMLInputElement | null>(null);

  const reset = () => {
    setDistance("");
    setWhere("indoor");
    setDate(new Date());
  };

  const close = () => {
    reset();
    onClose();
  };

  const changeDate = (value: string | null) => {
    setDate(value ? new Date(value) : new Date());
  };

  const save = () => {
    try {
      runs.add({ distance, where, date: date.getTime() });
    } catch (err) {
      if (err instanceof ValidationError) {
        notifyError({ message: err.message });
        return;
      }
      throw err;
    }

    const distanceRan = Number(distance);
    close();

    if (goal.requiredDistancePerDay !== null) {
      const { met, expected } = evaluateRunAgainstGoal(distanceRan, goal.requiredDistancePerDay);
      const notify = met ? notifySuccess : notifyWarning;

      if (met) {
        fireConfetti();
      }

      notify({
        title: t(
          met ? "appShell.addDrawer.result.goodTitle" : "appShell.addDrawer.result.badTitle",
        ),
        message: t("appShell.addDrawer.result.body", {
          distance: formatDistance(distanceRan),
          expected: formatDistance(expected),
        }),
      });
    }
  };

  const now = Date.now();
  const minDate = new Date(goal.value.start);
  const maxDate = date.getTime() > goal.value.end ? new Date(goal.value.end) : date;
  const isValidRange = goal.isSet && now >= goal.value.start;

  return {
    distance,
    setDistance,
    where,
    setWhere,
    date,
    changeDate,
    inputRef,
    isValidRange,
    minDate,
    maxDate,
    save,
    close,
  };
}
