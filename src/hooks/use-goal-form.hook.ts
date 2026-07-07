import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { notifyError, notifyInfo, notifySuccess } from "@/components/ui/notify";
import { GOAL_NOTIFICATION_AUTO_CLOSE_MS } from "@/config/constants.const";
import { ValidationError } from "@/config/validation.error";
import { useGoal } from "@/hooks/use-goal.hook";
import { formatDistance } from "@/utils/distance.utils";
import { addOneYearMinusOneDay, computeGoalPace } from "@/utils/goal.utils";

/** Whether the goal form is showing the read-only summary or the editable inputs. */
type GoalFormMode = "view" | "edit";

/** The goal form's editable field values (null/empty until filled in). */
interface GoalFields {
  /** Selected start date, or null if unset. */
  start: Date | null;
  /** Selected end date, or null if unset. */
  end: Date | null;
  /** Entered target distance in km, or "" while empty. */
  distance: number | string;
}

/** Read-only view of the stored goal for the summary display. */
interface GoalSummary {
  /** Goal start day (Unix ms). */
  start: number;
  /** Goal end day (Unix ms). */
  end: number;
  /** Target distance in km. */
  distance: number;
  /** Km/day needed to hit the goal, or null when unavailable. */
  requiredDistancePerDay: number | null;
}

/** The goal form state, derived flags, and actions exposed to the page. */
interface UseGoalForm {
  /** Whether the summary (view) or the inputs (edit) are shown. */
  mode: GoalFormMode;
  /** Whether a real goal is currently stored. */
  isSet: boolean;
  /** The stored goal's values for the read-only summary. */
  summary: GoalSummary;
  /** Current editable field values. */
  fields: GoalFields;
  /** Ref for the start-date input, focused when entering edit mode. */
  startRef: React.RefObject<HTMLInputElement | null>;
  /** Validation message when end is on/before start, else null. */
  dateError: string | null;
  /** Whether the fields differ from the snapshot taken when editing began. */
  isDirty: boolean;
  /** Whether the Save button should be disabled (incomplete, invalid, or unchanged). */
  saveDisabled: boolean;
  /** Switches to edit mode, seeding the form from the stored goal. */
  startEdit(): void;
  /** Updates the start date, auto-filling the end date unless it was touched. */
  changeStart(value: string | null): void;
  /** Updates the end date and marks it as manually touched. */
  changeEnd(value: string | null): void;
  /** Updates the target distance. */
  changeDistance(value: number | string): void;
  /** Validates and persists the goal, notifies, and returns to view mode. */
  save(): void;
  /** Discards edits and returns to view mode. */
  cancel(): void;
  /** Clears the stored goal, notifies, and returns to a blank edit form. */
  clear(): void;
}

/** Maps the current stored goal into editable form fields (blanks when no goal is set). */
function fieldsFromGoal(goal: ReturnType<typeof useGoal>): GoalFields {
  return {
    start: goal.isSet ? new Date(goal.value.start) : null,
    end: goal.isSet ? new Date(goal.value.end) : null,
    distance: goal.isSet ? goal.value.distance : "",
  };
}

/** Owns the goal view/edit state machine, derived validation, and save/clear/cancel actions. */
export function useGoalForm(): UseGoalForm {
  const { t, i18n } = useTranslation();
  const goal = useGoal();
  const [mode, setMode] = useState<GoalFormMode>(goal.isSet ? "view" : "edit");
  const [fields, setFields] = useState<GoalFields>(() => fieldsFromGoal(goal));
  const [snapshot, setSnapshot] = useState<GoalFields>(fields);
  const [endTouched, setEndTouched] = useState(false);
  const startRef = useRef<HTMLInputElement>(null);

  const { start, end, distance } = fields;

  useEffect(() => {
    if (mode === "edit") {
      startRef.current?.focus();
    }
  }, [mode]);

  const dateError = start && end && end.getTime() <= start.getTime() ? t("goal.dateError") : null;
  const isDirty =
    start?.getTime() !== snapshot.start?.getTime() ||
    end?.getTime() !== snapshot.end?.getTime() ||
    String(distance) !== String(snapshot.distance);
  const saveDisabled = !start || !end || !!dateError || distance === "" || !isDirty;

  const startEdit = () => {
    const initial = fieldsFromGoal(goal);
    setFields(initial);
    setSnapshot(initial);
    setEndTouched(false);
    setMode("edit");
  };

  const changeStart = (value: string | null) => {
    const newStart = value ? new Date(value) : null;
    setFields((prev) => ({
      ...prev,
      start: newStart,
      end: newStart && !endTouched ? addOneYearMinusOneDay(newStart) : prev.end,
    }));
  };

  const changeEnd = (value: string | null) => {
    setEndTouched(true);
    setFields((prev) => ({ ...prev, end: value ? new Date(value) : null }));
  };

  const changeDistance = (value: number | string) => {
    setFields((prev) => ({ ...prev, distance: value }));
  };

  const save = () => {
    if (!start || !end || dateError) return;

    try {
      goal.set({ start, end, distance });
    } catch (err) {
      if (err instanceof ValidationError) {
        notifyError({ message: err.message });
        return;
      }
      throw err;
    }

    const { days, perDay } = computeGoalPace(start, end, Number(distance));

    notifySuccess({
      title: t("goal.setNotification.title"),
      message: t("goal.setNotification.body", {
        start: start.toLocaleDateString(i18n.language),
        end: end.toLocaleDateString(i18n.language),
        days,
        distance: formatDistance(Number(distance)),
        perDay: formatDistance(perDay),
      }),
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE_MS,
    });

    setMode("view");
  };

  const cancel = () => {
    setMode("view");
  };

  const clear = () => {
    goal.reset();
    const blank: GoalFields = { start: null, end: null, distance: "" };
    setFields(blank);
    setSnapshot(blank);
    setEndTouched(false);

    notifyInfo({
      title: t("goal.clearNotification.title"),
      message: t("goal.clearNotification.body"),
      autoClose: GOAL_NOTIFICATION_AUTO_CLOSE_MS,
    });

    setMode("edit");
  };

  return {
    mode,
    isSet: goal.isSet,
    summary: {
      start: goal.value.start,
      end: goal.value.end,
      distance: goal.value.distance,
      requiredDistancePerDay: goal.requiredDistancePerDay,
    },
    fields,
    startRef,
    dateError,
    isDirty,
    saveDisabled,
    startEdit,
    changeStart,
    changeEnd,
    changeDistance,
    save,
    cancel,
    clear,
  };
}
