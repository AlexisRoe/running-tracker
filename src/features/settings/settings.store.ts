import { create } from "zustand";
import { persist } from "zustand/middleware";
import { type AppSettings, CampaignStatus, type ExtendedGoal, Theme } from "./settings.model";

type EnumObject = Record<string, string>;

const isString = (i: unknown): i is string => typeof i === "string";
const isEnum = <T extends EnumObject>(i: unknown, e: T): i is T[keyof T] =>
  isString(i) && Object.values(e).includes(i);

type AppSettingsAction = {
  updateTheme: (theme: AppSettings["theme"]) => void;
  updateGoal: (goal: AppSettings["goal"]) => void;
};

type Store = AppSettings & AppSettingsAction;

const useSettings = create<Store>()(
  persist(
    (set) => ({
      theme: Theme.System,
      goal: null,
      updateTheme: (theme) => set((_state) => ({ theme })),
      updateGoal: (goal) => set((_state) => ({ goal })),
    }),
    { name: "runner-tracking-settings-store" },
  ),
);

export const useTheme = (): {
  theme: AppSettings["theme"];
  update: (input: unknown) => void;
} => {
  const { theme, updateTheme } = useSettings();
  const update = (i: unknown): void => updateTheme(isEnum(i, Theme) ? i : Theme.System);

  return { theme, update };
};

export function determineGoal(input: AppSettings["goal"]): ExtendedGoal {
  if (input === null) {
    return {
      status: CampaignStatus.NotdefinedYet,
      goal: null,
    };
  }

  const now = Date.now();

  if (now < input.start) {
    return {
      status: CampaignStatus.NotStartedYet,
      goal: input,
    };
  }

  if (input.start >= now && now <= input.end) {
    return {
      status: CampaignStatus.Running,
      goal: input,
    };
  }

  if (now > input.end) {
    return {
      status: CampaignStatus.Expired,
      goal: input,
    };
  }

  return {
    status: CampaignStatus.Unknown,
    goal: input,
  };
}

export const useGoal = (): {
  goal: ExtendedGoal;
  update: AppSettingsAction["updateGoal"];
} => {
  const { updateGoal, goal } = useSettings();

  return {
    goal: determineGoal(goal),
    update: updateGoal,
  };
};
