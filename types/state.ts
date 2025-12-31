import { SetupContentData, StepOverrides } from './ui';
// FIX: Removed local definitions and imported the updated GameState from common types
// to ensure consistency with the new 'Continuity' naming scheme.
import type { GameState } from './common';

export type { GameState };

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