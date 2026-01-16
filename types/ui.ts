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
  mainContent?: StructuredContent;
  mainContentPosition?: 'before' | 'after';
  showNoJobsMessage?: boolean;
  primeContactsInstruction?: StructuredContent;
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

// FIX: Add missing export for AllianceReaverDetails. This type is used by `getAllianceReaverDetails` but was not defined.
export interface AllianceReaverDetails {
  specialRules: SpecialRule[];
  standardAlliancePlacement: string;
  standardReaverPlacement: string;
  allianceOverride: SpecialRule | undefined;
  reaverOverride: SpecialRule | undefined;
  alliancePlacement: string;
  reaverPlacement: string;
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
  primePanels: SpecialRule[];
  hasStartWithAlertCard?: boolean;
  disablePriming?: boolean;
}

export interface DraftRuleDetails {
  specialRules: SpecialRule[];
  draftPanels: SpecialRule[];
  draftAnnotations: StructuredContent[];
  placementAnnotations: StructuredContent[];
  isHavenDraft: boolean;
  isBrowncoatDraft: boolean;
  specialStartSector: string | null;
  placementRegionRestriction: string | null;
  conflictMessage: StructuredContent | null;
  havenPlacementRules?: SpecialRule | null;
  playerBadges: Record<number, string>;
}

export interface HeaderDetails {
  setupName: string;
  storyName: string | null;
  soloMode: 'Expanded' | 'Classic' | null;
}