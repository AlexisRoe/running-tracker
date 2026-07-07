import { ValidationError } from "@/config/validation.error";
import { useRunsStore } from "@/stores/runs.store";
import type { RunningEvent, RunWhere } from "@/types/runs.model";
import { isRunWhere } from "@/utils/runs.utils";
import { isNumber } from "@/utils/validation.utils";

/** Raw input for adding a run, validated by {@link UseRuns.add}. */
interface AddRunInput {
  /** Distance in km; validated to be a positive number. */
  distance: unknown;
  /** Where the run happened; defaults to "indoor" when omitted. */
  where?: unknown;
  /** Run timestamp (Unix ms); defaults to now when omitted. */
  date?: number;
}

/** Raw partial input for editing a run; only provided fields are changed. */
interface UpdateRunInput {
  /** New distance in km, if changing it. */
  distance?: unknown;
  /** New location, if changing it. */
  where?: unknown;
  /** New timestamp (Unix ms), if changing it. */
  date?: number;
}

/** The recorded runs plus validated add/update/remove actions. */
interface UseRuns {
  /** All recorded runs. */
  value: RunningEvent[];
  /** Validates and appends a new run; throws ValidationError on bad input. */
  add(input: AddRunInput): void;
  /** Validates and applies a partial update to the run with the given id. */
  update(id: string, input: UpdateRunInput): void;
  /** Deletes the run with the given id. */
  remove(id: string): void;
}

/** Reads recorded runs and exposes validated add/update/remove actions. */
export function useRuns(): UseRuns {
  const { events, addRun, updateRun, removeRun } = useRunsStore();

  const add = (input: AddRunInput) => {
    if (!isNumber(input.distance) || input.distance <= 0) {
      throw new ValidationError(
        "Run distance must be a number greater than 0",
        "2F4E6A8C-19B3-4D7E-A2C5-9F1B3D5E7A01",
      );
    }

    let where: RunWhere = "indoor";
    if (input.where !== undefined) {
      if (!isRunWhere(input.where)) {
        throw new ValidationError(
          "Run location must be 'indoor' or 'outdoor'",
          "2F4E6A8C-19B3-4D7E-A2C5-9F1B3D5E7A02",
        );
      }
      where = input.where;
    }

    addRun({
      date: input.date ?? Date.now(),
      where,
      distance: input.distance,
    });
  };

  const update = (id: string, input: UpdateRunInput) => {
    const patch: Partial<Omit<RunningEvent, "id">> = {};

    if (input.distance !== undefined) {
      if (!isNumber(input.distance) || input.distance <= 0) {
        throw new ValidationError(
          "Run distance must be a number greater than 0",
          "2F4E6A8C-19B3-4D7E-A2C5-9F1B3D5E7A03",
        );
      }
      patch.distance = input.distance;
    }

    if (input.where !== undefined) {
      if (!isRunWhere(input.where)) {
        throw new ValidationError(
          "Run location must be 'indoor' or 'outdoor'",
          "2F4E6A8C-19B3-4D7E-A2C5-9F1B3D5E7A04",
        );
      }
      patch.where = input.where;
    }

    if (input.date !== undefined) {
      patch.date = input.date;
    }

    updateRun(id, patch);
  };

  return { value: events, add, update, remove: removeRun };
}
