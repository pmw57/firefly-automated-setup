// This file contains types that are shared across different parts of the state and data logic,
// helping to break circular dependencies between modules.

export type GameEdition = 'original' | 'tenth';
export type GameMode = 'multiplayer' | 'solo';

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
  aces_eights: boolean;
  white_lightning: boolean;
  cantankerous: boolean;
  huntingdons_bolt: boolean;
  black_market: boolean;
  still_flying: boolean;
  community: boolean;
}

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

// FIX: Reverted to 'Campaign' terminology as requested to match the rulebook.
export interface GameState {
  gameEdition: GameEdition;
  gameMode: GameMode;
  playerCount: number;
  playerNames: string[];
  setupCardId: import('./data').SetupCardId | string;
  setupCardName: string;
  secondarySetupId?: import('./data').SetupCardId | string;
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
  storyRatingFilters: Record<number, boolean>;
  overriddenStepIds: string[];
}