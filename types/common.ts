// This file contains types that are shared across different parts of the state and data logic,
// helping to break circular dependencies between modules.

export type GameEdition = 'original' | 'tenth';
export type GameMode = 'multiplayer' | 'solo';
export type SetupMode = 'quick' | 'detailed';

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
  local_color: boolean;
}

export interface TimerConfig {
    mode: 'standard' | 'unpredictable';
    unpredictableSelectedIndices: number[];
    // FIX: Added optional property to fix type errors in utils/ui.ts and related tests.
    randomizeUnpredictable?: boolean;
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
  setupMode: SetupMode;
  playerCount: number;
  playerNames: string[];
  setupCardId: import('./data').SetupCardId | string;
  setupCardName: string;
  secondarySetupId?: import('./data').SetupCardId | string;
  selectedStoryCardIndex: number | null;
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
  acknowledgedOverrides: string[];
  draft: {
    state: import('./state').DraftState | null;
    isManual: boolean;
  };
  showHiddenContent: boolean;
}