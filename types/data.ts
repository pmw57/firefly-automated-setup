
import { SETUP_CARD_IDS } from '../data/ids';
import { GameMode, Expansions } from './common';
import { SetupRule } from './rules';

export type ExpansionId = 'base' | 'breakin_atmo' | 'big_damn_heroes' | 'blue' | 'kalidasa' | 'pirates' | 'crime' | 'coachworks' | 'tenth' | 'aces_eights' | 'white_lightning' | 'cantankerous' | 'huntingdons_bolt' | 'black_market' | 'still_flying' | 'community' | 'local_color';

export interface ExpansionIconConfig {
  type: 'sprite' | 'text' | 'svg';
  value: string;
}

export type ExpansionCategory = 'core_mechanics' | 'map' | 'variants' | 'independent';

export interface ExpansionDef {
  id: ExpansionId;
  label: string;
  description: string;
  themeColor: 'steelBlue' | 'black' | 'darkSlateBlue' | 'deepBrown' | 'rebeccaPurple' | 'cordovan' | 'darkOliveGreen' | 'saddleBrown' | 'teal' | 'dark' | 'cyan' | 'tan' | 'mediumPurple' | 'gamblingGreen';
  icon: ExpansionIconConfig;
  page_10th?: number;
  category: ExpansionCategory;
  hidden?: boolean;
  rules?: SetupRule[];
  isSupplyHeavy?: boolean;
}

export interface SetupCardStep {
  id: string;
  title: string;
  page?: number | string;
  manual?: string;
  overrides?: import('./ui').StepOverrides;
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
  sourceUrl?: string;
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
  disabledDescription?: string;
}

export interface CampaignSetupNote {
  stepId: string;
  content: import('./core').StructuredContent;
}

export type StoryTag =
  | 'classic_heist'
  | 'smugglers_run'
  | 'jailbreak'
  | 'criminal_enterprise'
  | 'faction_war'
  | 'survival'
  | 'character'
  | 'reputation'
  | 'mystery'
  | 'doing_the_job'
  | 'against_the_black'
  | 'verse_variant'
  | 'community'
  | 'solo'
  | 'coop'
  | 'pvp';

// The lightweight manifest used for lists and filtering
export interface StoryCardManifest {
  title: string;
  intro: string;
  setupDescription?: string; // Kept for grid view footer
  requiredExpansion?: keyof Expansions;
  additionalRequirements?: (keyof Expansions)[];
  sourceUrl?: string;
  isSolo?: boolean;
  isCoOp?: boolean;
  isPvP?: boolean;
  playerCount?: number | number[];
  maxPlayerCount?: number;
  requiredFlag?: string;
  requiredSetupCardId?: string;
  incompatibleSetupCardIds?: string[];
  sortOrder?: number;
  rating?: number;
  tags?: StoryTag[];
  
  // Metadata for Advanced Rules (needed for list filtering/display)
  advancedRule?: AdvancedRuleDef;
  
  // Metadata for Goals (needed for list display/counters)
  goals?: StoryCardGoal[];
  
  // Minimal Challenge Options metadata (id/label) needed for UI
  challengeOptions?: ChallengeOption[];
  
  // Solo Timer text (needed for dossier display without loading rules)
  soloTimerAdjustment?: string;
}

// The full definition used for game logic
export interface StoryCardDef extends StoryCardManifest {
  rules?: SetupRule[];
  campaignSetupNotes?: string[];
  noJobsMessage?: { title: string; description: string; };
}
