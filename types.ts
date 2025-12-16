

export type ExpansionId = 'base' | 'breakin_atmo' | 'big_damn_heroes' | 'blue' | 'kalidasa' | 'pirates' | 'crime' | 'coachworks' | 'tenth' | 'black_market' | 'still_flying' | 'community';

export interface Expansions {
  base: boolean;
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
  type: 'sprite' | 'text' | 'svg';
  value: string; // Background position for sprite, text content, or SVG path d attribute
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
  flyingSoloNavMode?: boolean;
}

export interface SetupContentData {
  type: 'core' | 'dynamic' | 'setup';
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
  mode?: GameMode;
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
  lonelySmugglerSetup?: boolean;
  startAtLondinium?: boolean;
  startWithAlertCard?: boolean;
  startWithGoalToken?: boolean;
  startOutsideAllianceSpace?: boolean;
  createAlertTokenStackMultiplier?: number;
  sharedHandSetup?: boolean;
  primeContactDecks?: boolean;
  placeReaverAlertsInMotherlodeAndUroboros?: boolean;
  // Community flags
  startingCreditsOverride?: number;
  customStartingFuel?: number;
  startingWarrantCount?: number;
  removeRiver?: boolean;
  allianceSpaceOffLimits?: boolean;
  startAtSector?: string;
  removeJobDecks?: boolean;
  nandiCrewDiscount?: boolean;
  // Solo specific flags
  soloCrewDraft?: boolean;
  soloGameTimer?: boolean;
  disableSoloTimer?: boolean;
}

export interface StoryCardGoal {
  title: string;
  description: string;
}

export interface ChallengeOption {
  id: string;
  label: string;
}

export interface AdvancedRuleDef {
  id: string;
  title: string;
  description?: string;
}

export interface StoryCardDef {
  title: string;
  intro: string;
  setupDescription?: string;
  requiredExpansion?: keyof Expansions;
  additionalRequirements?: (keyof Expansions)[];
  setupConfig?: StoryCardConfig;
  sourceUrl?: string;
  goals?: StoryCardGoal[];
  isSolo?: boolean;
  challengeOptions?: ChallengeOption[];
  advancedRule?: AdvancedRuleDef;
}

export type GameEdition = 'original' | 'tenth';
export type GameMode = 'multiplayer' | 'solo';

export interface TimerConfig {
    mode: 'standard' | 'unpredictable';
    unpredictableSelectedIndices: number[]; // Indices of the [1,1,2,2,3,4] array
    randomizeUnpredictable: boolean;
}

export interface SoloOptions {
  noSureThings: boolean;
  shesTrouble: boolean;
  recipeForUnpleasantness: boolean;
}

export type DisgruntledDieOption = 'standard' | 'disgruntle' | 'auto_fail' | 'success_at_cost';

export interface OptionalRules {
    disgruntledDie: DisgruntledDieOption;
    optionalShipUpgrades: boolean;
}

export interface GameState {
  gameEdition: GameEdition;
  gameMode: GameMode;
  playerCount: number;
  playerNames: string[];
  setupCardId: string;
  setupCardName: string;
  secondarySetupId?: string; // Used for Flying Solo to track the "Board Setup"
  selectedStoryCard: string;
  selectedGoal?: string;
  challengeOptions: Record<string, boolean>; // ID -> isEnabled
  timerConfig: TimerConfig;
  soloOptions: SoloOptions;
  optionalRules: OptionalRules;
  expansions: Expansions;
  isCampaign: boolean;
  campaignStoriesCompleted: number;
}

export interface Step {
  type: 'core' | 'dynamic' | 'final' | 'setup';
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