import { ValidationError } from "@shared/errors/validation.error";
import { isNumber } from "@shared/lib/validation.utils";
import type { RunningEvent, RunWhere } from "./runs.model";
import { useRunsStore } from "./runs.store";
import { isRunWhere } from "./runs.utils";

interface AddRunInput {
  distance: unknown;
  where?: unknown;
  date?: number;
}

interface UpdateRunInput {
  distance?: unknown;
  where?: unknown;
  date?: number;
}

interface UseRuns {
  value: RunningEvent[];
  add(input: AddRunInput): void;
  update(id: string, input: UpdateRunInput): void;
  remove(id: string): void;
}

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
