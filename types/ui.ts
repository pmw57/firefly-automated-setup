import { JobMode, NavMode, AllianceSetupMode, PrimeMode, DraftMode, LeaderSetupMode, RuleSourceType, CreateAlertTokenStackRule } from './rules';
import { StructuredContent, SpecialRule } from './core';

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

export type JobSetupMessage = SpecialRule;

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
  caperDrawCount?: number;
  isContactListOverridden?: boolean;
  jobDrawMode: JobMode;
  isSharedHandMode?: boolean;
}

export interface NavDeckSetupDetails {
  forceReshuffle: boolean;
  clearerSkies: boolean;
  showStandardRules: boolean;
  isSolo: boolean;
  isHighPlayerCount: boolean;
  specialRules: SpecialRule[];
  hasRimDecks: boolean;
}

export interface ConflictOptionDetails {
  value: number | string;
  label: string;
}
export interface ResourceConflict {
  story: ConflictOptionDetails;
  setupCard: ConflictOptionDetails;
}

export interface TokenStack {
  count: number;
  title: string;
  description?: string;
  rule: CreateAlertTokenStackRule;
}

export interface ResourceDetails {
  credits: number;
  fuel: number;
  parts: number;
  warrants: number;
  goalTokens: number;
  
  isFuelDisabled: boolean;
  isPartsDisabled: boolean;

  tokenStacks: TokenStack[];

  creditModifications: { description: string; value: string }[];
  conflict?: ResourceConflict;
  specialRules: SpecialRule[];
  boardSetupRules: SpecialRule[];
  componentAdjustmentRules: SpecialRule[];
  creditModificationSource?: RuleSourceType;
  creditModificationDescription?: string;
  fuelModificationSource?: RuleSourceType;
  partsModificationSource?: RuleSourceType;
  fuelModificationDescription?: string;
  partsModificationDescription?: string;
  smugglersBluesVariantAvailable: boolean;
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
  standardAlliancePlacement: string;
  standardReaverPlacement: string;
  allianceOverride?: SpecialRule;
  reaverOverride?: SpecialRule;
  // FIX: Add final resolved placement strings to satisfy legacy tests.
  alliancePlacement: string;
  reaverPlacement: string;
}

export interface DraftRuleDetails {
  specialRules: SpecialRule[];
  isHavenDraft: boolean;
  isBrowncoatDraft: boolean;
  specialStartSector: string | null;
  conflictMessage: StructuredContent | null;
  startOutsideAllianceSpace?: boolean;
  excludeNewCanaanPlacement?: boolean;
  isWantedLeaderMode?: boolean;
  havenPlacementRules?: SpecialRule | null;
}

export interface HeaderDetails {
  setupName: string;
  storyName: string | null;
  soloMode: 'Expanded' | 'Classic' | null;
}