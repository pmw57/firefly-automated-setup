

import { JobMode, NavMode, AllianceSetupMode, PrimeMode, DraftMode, LeaderSetupMode } from './rules';

export type ThemeColor = 'steelBlue' | 'black' | 'darkSlateBlue' | 'deepBrown' | 'rebeccaPurple' | 'cordovan' | 'darkOliveGreen' | 'saddleBrown' | 'teal' | 'dark' | 'cyan' | 'tan' | 'mediumPurple' | 'gamblingGreen';

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

export interface SpecialRule {
    source: 'story' | 'setupCard' | 'expansion' | 'warning' | 'info';
    title: string;
    content: StructuredContent;
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