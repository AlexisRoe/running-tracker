import { ValidationError } from "@/config/validation.error";
import { useGoalStore } from "@/stores/goal.store";
import type { Goal } from "@/types/goal.model";
import { countInclusiveDays, isWithinTimeframe, toGoalEnd, toGoalStart } from "@/utils/goal.utils";
import { isNumber } from "@/utils/validation.utils";

/** Raw goal input accepted by {@link UseGoal.set}, validated before it is stored. */
interface SetGoalInput {
  /** Goal start day (Date or Unix ms). */
  start: Date | number;
  /** Goal end day (Date or Unix ms). */
  end: Date | number;
  /** Target distance in km; validated to be a positive number. */
  distance: unknown;
}

/** Goal state plus derived values and mutators exposed to the UI. */
interface UseGoal {
  /** The stored goal (a blank sentinel when none is set). */
  value: Goal;
  /** Whether a real goal has been set (not the blank sentinel). */
  isSet: boolean;
  /** Whether a set goal's date range currently includes now. */
  isActive: boolean;
  /** Km/day needed to hit the goal over its full span, or null when unset. */
  requiredDistancePerDay: number | null;
  /** Validates and persists a new goal; throws ValidationError on bad input. */
  set(input: SetGoalInput): void;
  /** Clears the goal back to the blank state. */
  reset(): void;
}

/** Reads the stored goal and exposes derived progress values plus validated set/reset actions. */
export function useGoal(): UseGoal {
  const { goal, setGoal, resetGoal } = useGoalStore();

  const isSet = goal.state !== "_blank";
  const isActive = isSet && isWithinTimeframe(goal.start, goal.end, Date.now());
  const requiredDistancePerDay = isSet
    ? goal.distance / countInclusiveDays(goal.start, goal.end)
    : null;

  const set = (input: SetGoalInput) => {
    if (!isNumber(input.distance) || input.distance <= 0) {
      throw new ValidationError(
        "Goal distance must be a number greater than 0",
        "7C1B9D3E-4F2A-4C11-9E7D-3A5B6C7D8E01",
      );
    }

    const start = toGoalStart(input.start);
    const end = toGoalEnd(input.end);

    if (!isNumber(start) || !isNumber(end)) {
      throw new ValidationError(
        "Goal start/end must be a valid date",
        "7C1B9D3E-4F2A-4C11-9E7D-3A5B6C7D8E02",
      );
    }

    if (end <= start) {
      throw new ValidationError(
        "Goal end date must be after the start date",
        "7C1B9D3E-4F2A-4C11-9E7D-3A5B6C7D8E03",
      );
    }

    setGoal({ start, end, distance: input.distance });
  };

  return { value: goal, isSet, isActive, requiredDistancePerDay, set, reset: resetGoal };
}
