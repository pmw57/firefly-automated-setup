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
}

export interface CampaignSetupNote {
  stepId: string;
  content: import('./core').StructuredContent;
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
  isCoOp?: boolean;
  isPvP?: boolean;
  playerCount?: number;
  maxPlayerCount?: number;
  soloTimerAdjustment?: string;
  challengeOptions?: ChallengeOption[];
  advancedRule?: AdvancedRuleDef;
  rules?: SetupRule[];
  requiredFlag?: string;
  requiredSetupCardId?: string;
  incompatibleSetupCardIds?: string[];
  sortOrder?: number;
  campaignSetupNotes?: string[];
  rating?: number;
}