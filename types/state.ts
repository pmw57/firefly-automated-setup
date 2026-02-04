
import { SetupContentData, StepOverrides } from './ui';
import type { GameEdition, GameMode, SetupMode, Expansions, TimerConfig, SoloOptions, OptionalRules, DraftState, DiceResult } from './common';
import type { SetupCardId, StoryCardDef } from './data';

// Re-export common types for backward compatibility and ease of import
export type { GameEdition, GameMode, SetupMode, Expansions, TimerConfig, SoloOptions, OptionalRules, DraftState, DiceResult };

// "Campaign" terminology is used to align with the 10th Anniversary rulebook.
export interface GameState {
  gameEdition: GameEdition;
  gameMode: GameMode;
  setupMode: SetupMode;
  playerCount: number;
  playerNames: string[];
  setupCardId: SetupCardId | string;
  setupCardName: string;
  secondarySetupId?: SetupCardId | string;
  
  // The index in the master list (used for UI highlighting/persistence)
  selectedStoryCardIndex: number | null;
  // The full loaded story object (used for rule resolution)
  activeStory: StoryCardDef | null; 

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
  visitedStepOverrides: string[];
  draft: {
    state: DraftState | null;
    isManual: boolean;
  };
  showHiddenContent: boolean;
  missionDossierSubStep: number;
  riversRun_setupConfirmed: boolean;
}

export interface Step {
  type: 'core' | 'dynamic' | 'final' | 'setup';
  id: string;
  data?: SetupContentData;
  page?: number | string;
  manual?: string;
  overrides?: StepOverrides;
}
