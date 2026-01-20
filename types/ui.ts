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
  infoMessages: JobSetupMessage[];
  overrideMessages: JobSetupMessage[];
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
  infoRules: SpecialRule[];
  overrideRules: SpecialRule[];
  hasRimDecks: boolean;
}

export interface AllianceReaverDetails {
  infoRules: SpecialRule[];
  overrideRules: SpecialRule[];
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
  infoRules: SpecialRule[];
  overrideRules: SpecialRule[];
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
  infoRules: SpecialRule[];
  overrideRules: SpecialRule[];
  primePanels: SpecialRule[];
  hasStartWithAlertCard?: boolean;
  disablePriming?: boolean;
}

export interface DraftRuleDetails {
  infoRules: SpecialRule[];
  overrideRules: SpecialRule[];
  draftPanelsBefore: SpecialRule[];
  draftPanelsAfter: SpecialRule[];
  draftShipsBefore: SpecialRule[];
  draftShipsAfter: SpecialRule[];
  draftPlacementBefore: SpecialRule[];
  draftPlacementAfter: SpecialRule[];
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