import { SetupCardId } from './data';
import { SetupContentData, StepOverrides } from './ui';
import { GameMode, GameEdition, Expansions, TimerConfig, SoloOptions, OptionalRules } from './common';

export interface GameState {
  gameEdition: GameEdition;
  gameMode: GameMode;
  playerCount: number;
  playerNames: string[];
  setupCardId: SetupCardId | string;
  setupCardName: string;
  secondarySetupId?: SetupCardId | string;
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
}

export interface Step {
  type: 'core' | 'dynamic' | 'final' | 'setup';
  id: string;
  data?: SetupContentData;
  page?: number | string;
  manual?: string;
  overrides?: StepOverrides;
}

export interface DiceResult {
  player: string;
  roll: number;
  isWinner?: boolean;
}

export interface DraftState {
  rolls: DiceResult[];
  draftOrder: string[];
  placementOrder: string[];
}
