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
  value: string;
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
  value?: number;
}

export type RuleSourceType = 'story' | 'setupCard' | 'expansion' | 'optionalRule' | 'challenge';

export interface BaseRule {
  type: string;
  source: RuleSourceType;
  sourceName: string;
  condition?: (state: GameState) => boolean;
}

export interface SetJobModeRule extends BaseRule { type: 'setJobMode'; mode: JobMode; }
export interface SetJobContactsRule extends BaseRule { type: 'setJobContacts'; contacts: string[]; }
export interface ForbidContactRule extends BaseRule { type: 'forbidContact'; contact: string; }
export interface AllowContactsRule extends BaseRule { type: 'allowContacts'; contacts: string[]; }
export interface PrimeContactsRule extends BaseRule { type: 'primeContacts'; }
export interface CreateAlertTokenStackRule extends BaseRule { type: 'createAlertTokenStack'; multiplier: number; }
export interface SetAllianceModeRule extends BaseRule { type: 'setAllianceMode'; mode: AllianceSetupMode; }
export interface SetNavModeRule extends BaseRule { type: 'setNavMode'; mode: NavMode; }
export interface SetPrimeModeRule extends BaseRule { type: 'setPrimeMode'; mode: PrimeMode; }
export interface SetDraftModeRule extends BaseRule { type: 'setDraftMode'; mode: DraftMode; }
export interface SetLeaderSetupRule extends BaseRule { type: 'setLeaderSetup'; mode: LeaderSetupMode; }
export interface SetShipPlacementRule extends BaseRule { type: 'setShipPlacement'; location: 'persephone' | 'londinium' | 'border_of_murphy' | 'outside_alliance'; }
export interface AddSpecialRule extends BaseRule { type: 'addSpecialRule'; category: 'jobs' | 'allianceReaver' | 'draft' | 'nav' | 'prime' | 'resources' | 'soloTimer'; rule: Omit<SpecialRule, 'source'>; }

export interface AddFlagRule extends BaseRule { type: 'addFlag'; flag: string; }

export interface ModifyPrimeRule extends BaseRule {
  type: 'modifyPrime';
  multiplier?: number;
  modifier?: { add: number };
}

export interface ModifyResourceRule extends BaseRule {
  type: 'modifyResource';
  resource: ResourceType;
  method: EffectMethod;
  value?: number;
  description: string;
}

export type SetupRule = 
  | SetJobModeRule
  | SetJobContactsRule
  | ForbidContactRule
  | AllowContactsRule
  | PrimeContactsRule
  | CreateAlertTokenStackRule
  | SetAllianceModeRule
  | SetNavModeRule
  | SetPrimeModeRule
  | SetDraftModeRule
  | SetLeaderSetupRule
  | SetShipPlacementRule
  | AddSpecialRule
  | AddFlagRule
  | ModifyPrimeRule
  | ModifyResourceRule;

export interface StepOverrides {
    jobMode?: JobMode;
    navMode?: NavMode;
    allianceMode?: AllianceSetupMode;
    primeMode?: PrimeMode;
    draftMode?: DraftMode;
    leaderSetup?: LeaderSetupMode;
}

export interface SetupContentData {
  type: 'core' | 'dynamic' | 'setup';
  title: string;
  id?: string;
}

export interface SetupContentTemplate {
  type: 'core' | 'dynamic';
}

export interface SetupCardStep {
  id: string;
  title: string;
  page?: number | string;
  manual?: string;
  overrides?: StepOverrides;
}

export type SetupCardId = typeof SETUP_CARD_IDS[keyof typeof SETUP_CARD_IDS];

export interface SetupCardDef {
  id: SetupCardId | string;
  label: string;
  description?: string;
  requiredExpansion?: keyof Expansions;
  iconOverride?: string;
  steps: SetupCardStep[];
  mode?: GameMode;
  rules?: SetupRule[];
  isCombinable?: boolean;
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
  sourceUrl?: string;
  goals?: StoryCardGoal[];
  isSolo?: boolean;
  challengeOptions?: ChallengeOption[];
  advancedRule?: AdvancedRuleDef;
  rules?: SetupRule[];
}

export type GameEdition = 'original' | 'tenth';
export type GameMode = 'multiplayer' | 'solo';

export interface TimerConfig {
    mode: 'standard' | 'unpredictable';
    unpredictableSelectedIndices: number[];
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
  secondarySetupId?: SetupCardId | string;
  selectedStoryCard: string;
  selectedGoal?: string;
  challengeOptions: Record<string, boolean>;
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
  page?: number | string;
  manual?: string;
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
  specialRules: SpecialRule[];
}

export interface ConflictOptionDetails {
  value: number | string;
  label: string;
}
export interface ResourceConflict {
  story: ConflictOptionDetails;
  setupCard: ConflictOptionDetails;
}

export interface ResourceDetails {
  credits: number;
  fuel: number;
  parts: number;
  warrants: number;
  goalTokens: number;
  
  isFuelDisabled: boolean;
  isPartsDisabled: boolean;

  creditModifications: { description: string; value: string }[];
  conflict?: ResourceConflict;
}


export interface PrimeDetails {
  baseDiscard: number;
  effectiveMultiplier: number;
  finalCount: number;
  isHighSupplyVolume: boolean;
  isBlitz: boolean;
  specialRules: SpecialRule[];
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