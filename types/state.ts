
import { SetupContentData, StepOverrides } from './ui';
// The main GameState type is now defined in the 'common' module to break circular
// dependencies and is re-exported here for dependent files.
import type { GameState, DraftState, DiceResult } from './common';

export type { GameState, DraftState, DiceResult };

export interface Step {
  type: 'core' | 'dynamic' | 'final' | 'setup';
  id: string;
  data?: SetupContentData;
  page?: number | string;
  manual?: string;
  overrides?: StepOverrides;
}
