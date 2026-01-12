import { SetupContentData, StepOverrides } from './ui';
// The main GameState type is now defined in the 'common' module to break circular
// dependencies and is re-exported here for dependent files.
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