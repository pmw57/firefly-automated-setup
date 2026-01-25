
import { SpecialRule, StructuredContent } from './core';
import { Expansions } from './common';

export type JobMode = 
  | 'shared_hand'
  | 'standard' 
  | 'no_jobs' 
  | 'hide_jobs'
  | 'times_jobs' 
  | 'high_alert_jobs' 
  | 'buttons_jobs' 
  | 'awful_jobs' 
  | 'rim_jobs' 
  | 'draft_choice' 
  | 'caper_start' 
  | 'wind_takes_us';

export type NavMode = 'standard' | 'browncoat' | 'rim' | 'flying_solo' | 'clearer_skies' | 'standard_reshuffle' | 'disabled';
export type PrimeMode = 'standard' | 'blitz';
export type DraftMode = 'standard' | 'browncoat';
export type LeaderSetupMode = 'standard' | 'wanted';
export type AllianceSetupMode = 'standard' | 'awful_crowded' | 'no_alerts';


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

export type RuleSourceType = 'story' | 'setupCard' | 'expansion' | 'optionalRule' | 'challenge' | 'combinableSetupCard' | 'warning' | 'info';

export interface RuleCriteria {
    requireExpansion?: keyof Expansions;
    excludeExpansion?: keyof Expansions;
}

export interface BaseRule {
  type: string;
  source: RuleSourceType;
  sourceName: string;
  criteria?: RuleCriteria;
}

export interface SetJobModeRule extends BaseRule { type: 'setJobMode'; mode: JobMode; jobDescription?: string; }
export interface SetJobContactsRule extends BaseRule { 
    type: 'setJobContacts'; 
    contacts: string[]; 
    preset?: 'core' | 'all' | 'custom';
}
export interface ForbidContactRule extends BaseRule { type: 'forbidContact'; contact: string; }
export interface AllowContactsRule extends BaseRule { type: 'allowContacts'; contacts: string[]; }
export interface PrimeContactsRule extends BaseRule { type: 'primeContacts'; }
export interface CreateAlertTokenStackRule extends BaseRule {
  type: 'createAlertTokenStack';
  multiplier?: number;
  fixedValue?: number;
  valuesByGoal?: Record<string, number>;
  tokenName?: string;
  title?: string;
  description?: string;
}
export interface SetAllianceModeRule extends BaseRule { type: 'setAllianceMode'; mode: AllianceSetupMode; }
export interface SetAlliancePlacementRule extends BaseRule { 
    type: 'setAlliancePlacement'; 
    placement: string; 
    title?: string; // Optional override for "Alliance Cruiser"
}
export interface SetReaverPlacementRule extends BaseRule { 
    type: 'setReaverPlacement'; 
    placement: string; 
    title?: string; // Optional override for "Reaver Cutter"
}
export interface SetNavModeRule extends BaseRule { type: 'setNavMode'; mode: NavMode; }
export interface SetPrimeModeRule extends BaseRule { type: 'setPrimeMode'; mode: PrimeMode; }
export interface SetDraftModeRule extends BaseRule { 
    type: 'setDraftMode'; 
    mode: DraftMode; 
    selectShipTitle?: string;
    selectShipDescription?: string;
    placementTitle?: string;
    placementDescription?: string;
}
export interface SetLeaderSetupRule extends BaseRule { type: 'setLeaderSetup'; mode: LeaderSetupMode; }
export interface SetShipPlacementRule extends BaseRule {
  type: 'setShipPlacement';
  location:
    | 'persephone'
    | 'londinium'
    | 'outside_alliance'
    | { sector: string }
    | { region: string };
}
// The `draft_panel` and `draft_placement_extra` categories allow story cards
// to inject custom UI panels directly into the draft step for complex setups.
export interface AddSpecialRule extends BaseRule { type: 'addSpecialRule'; category: 'jobs' | 'allianceReaver' | 'draft' | 'nav' | 'prime' | 'resources' | 'soloTimer' | 'goal' | 'draft_panel' | 'draft_ships' | 'draft_placement' | 'prime_panel' | 'setup_selection' | 'pressures_high'; rule: Omit<SpecialRule, 'source'>; }

export interface AddFlagRule extends BaseRule { 
  type: 'addFlag'; 
  flag: string;
  reaverShipCount?: number; 
}

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

export interface SetComponentRule extends BaseRule {
  type: 'setComponent';
  stepId: string;
  component: string;
}

export interface SetJobStepContentRule extends BaseRule {
  type: 'setJobStepContent';
  content: StructuredContent;
  position: 'before' | 'after';
}

export interface AddBoardComponentRule extends BaseRule {
  type: 'addBoardComponent';
  component: 'contraband' | 'alert_token';
  count: number;
  locations: string[]; // Legacy support or explicit list
  title: string;
  // Distribution Logic
  distribution?: 'fixed' | 'all_supply_planets' | 'region';
  targetRegion?: string;
  excludeLocations?: string[];
  // Visual properties for UI decoupling
  icon?: string; 
  locationTitle?: string;
  locationSubtitle?: string;
}

export interface SetPlayerBadgesRule extends BaseRule {
    type: 'setPlayerBadges';
    badges: Record<number, string>; // Player Index -> Badge Text
}


export type SetupRule = 
  | SetJobModeRule
  | SetJobContactsRule
  | ForbidContactRule
  | AllowContactsRule
  | PrimeContactsRule
  | CreateAlertTokenStackRule
  | SetAllianceModeRule
  | SetAlliancePlacementRule
  | SetReaverPlacementRule
  | SetNavModeRule
  | SetPrimeModeRule
  | SetDraftModeRule
  | SetLeaderSetupRule
  | SetShipPlacementRule
  | AddSpecialRule
  | AddFlagRule
  | ModifyPrimeRule
  | ModifyResourceRule
  | SetComponentRule
  | SetJobStepContentRule
  | AddBoardComponentRule
  | SetPlayerBadgesRule;
