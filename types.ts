
export type ExpansionId = 'breakin_atmo' | 'big_damn_heroes' | 'blue' | 'kalidasa' | 'pirates' | 'crime' | 'coachworks' | 'tenth' | 'black_market' | 'still_flying' | 'community';

export interface Expansions {
  breakin_atmo: boolean;
  big_damn_heroes: boolean;
  blue: boolean;
  kalidasa: boolean;
  pirates: boolean;
  crime: boolean; 
  coachworks: boolean;
  tenth: boolean;
  black_market: boolean;
  still_flying: boolean;
  community: boolean;
}

export type ThemeColor = 'orangeRed' | 'steelBlue' | 'black' | 'darkSlateBlue' | 'deepBrown' | 'rebeccaPurple' | 'cordovan' | 'darkOliveGreen' | 'saddleBrown' | 'teal' | 'dark';

export interface ExpansionIconConfig {
  type: 'sprite' | 'text';
  value: string; // Background position for sprite, or text content
}

export interface ExpansionDef {
  id: ExpansionId;
  label: string;
  description: string;
  themeColor: ThemeColor;
  icon: ExpansionIconConfig;
}

export interface StepOverrides {
  startingCredits?: number;
  rimNavMode?: boolean;
  browncoatNavMode?: boolean;
  browncoatJobMode?: boolean;
  browncoatDraftMode?: boolean;
  timesJobMode?: boolean;
  forceReshuffle?: boolean;
  allianceHighAlertJobMode?: boolean;
  buttonsJobMode?: boolean;
  extraCruisers?: boolean;
  wantedLeaderMode?: boolean;
  awfulCrowdedAllianceMode?: boolean;
  awfulJobMode?: boolean;
  blitzPrimeMode?: boolean;
  clearerSkiesNavMode?: boolean;
  noAlertTokens?: boolean;
}

export interface SetupContentData {
  type: 'core' | 'dynamic';
  id?: string;        // For core steps
  elementId?: string; // For dynamic steps
  title: string;
}

export interface ContentMap {
  [key: string]: SetupContentData;
}

export interface SetupCardStep {
  id: string;
  overrides?: StepOverrides;
}

export interface SetupCardDef {
  id: string;
  label: string;
  description?: string;
  requiredExpansion?: keyof Expansions;
  iconOverride?: string;
  steps: SetupCardStep[];
}

export interface StoryCardConfig {
  jobDrawMode?: 'standard' | 'draft_choice' | 'caper_start' | 'wind_takes_us' | 'no_jobs';
  primingMultiplier?: number;
  startingCreditsBonus?: number;
  noStartingFuelParts?: boolean;
  forbiddenStartingContact?: string;
  allowedStartingContacts?: string[];
  shipPlacementMode?: 'persephone';
  startWithWarrant?: boolean;
  placeAllianceAlertsInAllianceSpace?: boolean;
  addBorderSpaceHavens?: boolean;
  removePiracyJobs?: boolean;
  placeMixedAlertTokens?: boolean;
  // New flags
  smugglersBluesSetup?: boolean;
  startAtLondinium?: boolean;
  startWithAlertCard?: boolean;
  startOutsideAllianceSpace?: boolean;
  createAlertTokenStackMultiplier?: number;
  sharedHandSetup?: boolean;
  // Community flags
  startingCreditsOverride?: number;
  customStartingFuel?: number;
  startingWarrantCount?: number;
  removeRiver?: boolean;
  allianceSpaceOffLimits?: boolean;
  startAtSector?: string;
  removeJobDecks?: boolean;
  nandiCrewDiscount?: boolean;
}

export interface StoryCardDef {
  title: string;
  intro: string;
  setupDescription?: string;
  requiredExpansion?: keyof Expansions;
  additionalRequirements?: (keyof Expansions)[];
  setupConfig?: StoryCardConfig;
  sourceUrl?: string;
}

export interface GameState {
  playerCount: number;
  playerNames: string[];
  setupCardId: string;
  setupCardName: string;
  selectedStoryCard: string;
  expansions: Expansions;
}

export interface Step {
  type: 'core' | 'dynamic' | 'final';
  id: string;
  data?: SetupContentData;
  overrides?: StepOverrides;
}

export interface DiceResult {
  player: string;
  roll: number;
  isWinner?: boolean;
}

export interface DraftState {
  rolls: DiceResult[];
  draftOrder: string[];
  placementOrder: string[];
}