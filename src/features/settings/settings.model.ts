export enum Theme {
  Light = "light",
  Dark = "dark",
  System = "system",
}

export enum CampaignStatus {
  /** A goal is defined but the current day is not inside the goal */
  NotStartedYet = "planned",
  /** Current day is inisde the campaign */
  Running = "running",
  /** The campaign is in the past */
  Expired = "expired",
  /** Goal (campaign) is not defined yet */
  NotdefinedYet = "not-defined",
  /** An error happened during valiation */
  Error = "error",
  /** Everything else */
  Unknown = "unknown",
}

export interface Goal {
  /** Start date in unix timestamp in milliseconds */
  start: number;
  /** End date in unix timestamp in milliseconds */
  end: number;
  /** Unix timestamp when the goal is changed */
  updated: number;
  /** Target distance in km to achieve */
  distance: number;
}

/** Depending if the goal is defined (not null) and current */
export type ExtendedGoal =
  | {
      status: CampaignStatus.Expired | CampaignStatus.NotStartedYet | CampaignStatus.Running;
      goal: Goal;
    }
  | {
      status: CampaignStatus.NotdefinedYet | CampaignStatus.Error;
      goal: null;
    }
  | {
      status: CampaignStatus.Unknown;
      goal: Goal;
    };

export interface AppSettings {
  /** App style for Mantine */
  theme: Theme;
  /** Definition of a goal */
  goal: Goal | null;
}
