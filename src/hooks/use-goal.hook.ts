import { ValidationError } from "@/config/validation.error";
import { useGoalStore } from "@/stores/goal.store";
import type { Goal } from "@/types/goal.model";
import { countInclusiveDays, isWithinTimeframe, toGoalEnd, toGoalStart } from "@/utils/goal.utils";
import { isNumber } from "@/utils/validation.utils";

interface SetGoalInput {
  start: Date | number;
  end: Date | number;
  distance: unknown;
}

interface UseGoal {
  value: Goal;
  isSet: boolean;
  isActive: boolean;
  requiredDistancePerDay: number | null;
  set(input: SetGoalInput): void;
  reset(): void;
}

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
