import { SETUP_CARD_IDS } from './data/ids';

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
  page_10th?: number;
}

export type JobMode = 
  | 'standard' 
  | 'no_jobs' 
  | 'times_jobs' 
  | 'high_alert_jobs' 
  | 'buttons_jobs' 
  | 'awful_jobs' 
  | 'rim_jobs' 
  | 'draft_choice' 
  | 'caper_start' 
  | 'wind_takes_us';

export type NavMode = 'standard' | 'browncoat' | 'rim' | 'flying_solo' | 'clearer_skies' | 'standard_reshuffle';
export type PrimeMode = 'standard' | 'blitz';
export type DraftMode = 'standard' | 'browncoat';
export type LeaderSetupMode = 'standard' | 'wanted';
export type AllianceSetupMode = 'standard' | 'awful_crowded' | 'no_alerts' | 'extra_cruisers';

export interface StepOverrides {
  startingCredits?: number;
  jobMode?: JobMode;
  navMode?: NavMode;
  primeMode?: PrimeMode;
  draftMode?: DraftMode;
  leaderSetup?: LeaderSetupMode;
  allianceMode?: AllianceSetupMode;
}

// --- New Effect System Types ---
export type ResourceType = 'credits' | 'fuel' | 'parts' | 'warrants' | 'goalTokens';
export type EffectMethod = 'set' | 'add' | 'disable';

export interface EffectSource {
  source: 'story' | 'setupCard' | 'expansion' | 'optionalRule' | 'challenge';
  name: string;
}

export interface Effect {
  type: string;
  source: EffectSource;
  description: string;
}

export interface ModifyResourceEffect extends Effect {
  type: 'modifyResource';
  resource: ResourceType;
  method: EffectMethod;
  value?: number; // Not needed for 'disable'
}
// --- End New Effect System Types ---

// The final data object for a step in the flow.
export interface SetupContentData {
  type: 'core' | 'dynamic' | 'setup';
  id?: string;
  elementId?: string;
  title: string;
}

// A template for step data stored in `data/steps.ts`.
export interface SetupContentTemplate {
  type: 'core' | 'dynamic' | 'setup';
  id?: string;
  elementId?: string;
}

export interface ContentMap {
  [key: string]: SetupContentTemplate;
}

export interface SetupCardStep {
  id: string;
  title: string;
  overrides?: StepOverrides;
  page?: number | string;
  manual?: string;
}

// Stricter type for SetupCard IDs derived from constants
export type SetupCardId = typeof SETUP_CARD_IDS[keyof typeof SETUP_CARD_IDS];

export interface SetupCardDef {
  id: SetupCardId | string; // Allow string for flexibility, but prefer SetupCardId
  label: string;
  description?: string;
  requiredExpansion?: keyof Expansions;
  iconOverride?: string;
  steps: SetupCardStep[];
  mode?: GameMode;
  overrides?: StepOverrides;
  effects?: ModifyResourceEffect[];
}

export type StoryFlag = 
  | 'placeAllianceAlertsInAllianceSpace'
  | 'addBorderSpaceHavens'
  | 'removePiracyJobs'
  | 'placeMixedAlertTokens'
  | 'smugglersBluesSetup'
  | 'lonelySmugglerSetup'
  | 'startAtLondinium'
  | 'startWithAlertCard'
  | 'startOutsideAllianceSpace'
  | 'sharedHandSetup'
  | 'primeContactDecks'
  | 'placeReaverAlertsInMotherlodeAndUroboros'
  | 'removeRiver'
  | 'allianceSpaceOffLimits'
  | 'removeJobDecks'
  | 'nandiCrewDiscount'
  | 'soloCrewDraft'
  | 'soloGameTimer'
  | 'disableSoloTimer';

export interface StoryCardConfig {
  jobDrawMode?: JobMode;
  primingMultiplier?: number;
  primeModifier?: { add: number };
  createAlertTokenStackMultiplier?: number;

  shipPlacementMode?: 'persephone';
  startAtSector?: string;
  
  forbiddenStartingContact?: string;
  allowedStartingContacts?: string[];
  
  flags?: StoryFlag[];
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
  effects?: ModifyResourceEffect[];
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
    resolveConflictsManually: boolean;
    highVolumeSupply: boolean;
}

export interface GameState {
  gameEdition: GameEdition;
  gameMode: GameMode;
  playerCount: number;
  playerNames: string[];
  setupCardId: SetupCardId | string;
  setupCardName: string;
  secondarySetupId?: SetupCardId | string; // Used for Flying Solo
  selectedStoryCard: string;
  selectedGoal?: string;
  challengeOptions: Record<string, boolean>; // ID -> isEnabled
  timerConfig: TimerConfig;
  soloOptions: SoloOptions;
  optionalRules: OptionalRules;
  expansions: Expansions;
  isCampaign: boolean;
  campaignStoriesCompleted: number;
  finalStartingCredits: number | null;
}

export interface Step {
  type: 'core' | 'dynamic' | 'final' | 'setup';
  id: string;
  data?: SetupContentData;
  overrides?: StepOverrides;
  page?: number | string;
  manual?: string;
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

// --- New Types for Refactored Logic & Structured Content ---
export type StructuredContentPart =
  | string
  | { type: 'strong'; content: string }
  | { type: 'action'; content: string }
  | { type: 'br' }
  | { type: 'list'; items: StructuredContent[] }
  | { type: 'numbered-list'; items: StructuredContent[] }
  | { type: 'paragraph'; content: StructuredContent }
  | { type: 'warning-box'; content: StructuredContent }
  | { type: 'sub-list'; items: { ship: string }[] };

export type StructuredContent = StructuredContentPart[];

export interface JobSetupMessage {
  source: 'story' | 'setupCard' | 'warning' | 'info' | 'expansion';
  title: string;
  content: StructuredContent;
}

export interface JobConflict {
  story: { value: string; label: string };
  setupCard: { value: string; label: string };
}

export interface JobSetupDetails {
  contacts: string[];
  cardsToDraw?: number;
  isSingleContactChoice: boolean;
  messages: JobSetupMessage[];
  showStandardContactList: boolean;
  totalJobCards: number;
}

export interface NavDeckSetupDetails {
  forceReshuffle: boolean;
  clearerSkies: boolean;
  showStandardRules: boolean;
  isSolo: boolean;
  isHighPlayerCount: boolean;
}

export interface ResourceConflict {
  story: { value: number, source: EffectSource };
  setupCard: { value: number, source: EffectSource };
}

export interface ResourceDetails {
  credits: number;
  fuel: number;
  parts: number;
  warrants: number;
  goalTokens: number;
  
  isFuelDisabled: boolean;
  isPartsDisabled: boolean;

  conflict?: ResourceConflict;
  creditModifications: { description: string; value: string }[];
}


export interface PrimeDetails {
  baseDiscard: number;
  effectiveMultiplier: number;
  finalCount: number;
  isHighSupplyVolume: boolean;
  isBlitz: boolean;
  isSlayingTheDragon: boolean;
}

export interface SpecialRule {
    source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
    title: string;
    content: StructuredContent;
}

export interface AllianceReaverDetails {
  specialRules: SpecialRule[];
  alliancePlacement: string;
  reaverPlacement: string;
}

export interface DraftRuleDetails {
  specialRules: SpecialRule[];
  isHavenDraft: boolean;
  isBrowncoatDraft: boolean;
  specialStartSector: string | null;
  conflictMessage: StructuredContent | null;
}

export interface HeaderDetails {
  setupName: string;
  storyName: string | null;
  soloMode: 'Expanded' | 'Classic' | null;
}