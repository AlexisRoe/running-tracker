import { useState } from "react";
import { notifyError } from "@/components/ui/notify";
import { ValidationError } from "@/config/validation.error";
import { useRuns } from "@/hooks/use-runs.hook";
import type { RunningEvent, RunWhere } from "@/types/runs.model";

/** Edit-run form state plus the save/delete actions. */
interface UseEditRunForm {
  /** Current distance value in km (or "" while empty). */
  distance: number | string;
  /** Sets the distance value. */
  setDistance(value: number | string): void;
  /** Current run location. */
  where: RunWhere;
  /** Sets the run location. */
  setWhere(value: RunWhere): void;
  /** Current run date. */
  date: Date;
  /** Sets the run date. */
  setDate(value: Date): void;
  /** Validates and applies the edits, closing on success. */
  save(): void;
  /** Deletes the run and closes. */
  remove(): void;
}

/** Owns the edit-run form state, seeded from the run, plus validated save/delete actions. */
export function useEditRunForm(run: RunningEvent, onClose: () => void): UseEditRunForm {
  const runs = useRuns();
  const [distance, setDistance] = useState<number | string>(run.distance);
  const [where, setWhere] = useState<RunWhere>(run.where);
  const [date, setDate] = useState(() => new Date(run.date));

  const save = () => {
    try {
      runs.update(run.id, { distance, where, date: date.getTime() });
    } catch (err) {
      if (err instanceof ValidationError) {
        notifyError({ message: err.message });
        return;
      }
      throw err;
    }

    onClose();
  };

  const remove = () => {
    runs.remove(run.id);
    onClose();
  };

  return { distance, setDistance, where, setWhere, date, setDate, save, remove };
}
