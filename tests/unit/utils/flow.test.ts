/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { calculateSetupFlow } from '../../../utils/flow';
import { GameState } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { STEP_IDS, SETUP_CARD_IDS } from '../../../data/ids';

describe('utils/flow', () => {
  describe('calculateSetupFlow', () => {
    const baseGameState = getDefaultGameState();

    it.concurrent('generates the standard flow for a default game', () => {
      // The new default state enables all expansions. To test the "standard" flow
      // without optional rules, we must explicitly create a state where the 10th
      // Anniversary expansion is disabled.
      const stateWithout10th: GameState = {
        ...baseGameState,
        expansions: { ...baseGameState.expansions, tenth: false },
      };
      const flow = calculateSetupFlow(stateWithout10th);
      const flowIds = flow.map(f => f.id);
      
      expect(flowIds).toEqual([
        STEP_IDS.SETUP_CAPTAIN_EXPANSIONS,
        STEP_IDS.SETUP_CARD_SELECTION,
        STEP_IDS.C1,
        STEP_IDS.C2,
        STEP_IDS.C3,
        STEP_IDS.C4,
        STEP_IDS.C5,
        STEP_IDS.C6,
        STEP_IDS.C_PRIME,
        STEP_IDS.FINAL,
      ]);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeUndefined();
    });

    it.concurrent('includes optional rules step if 10th Anniversary expansion is active', () => {
      const state: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, tenth: true }};
      const flow = calculateSetupFlow(state);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeDefined();
    });
    
    it.concurrent('does not include optional rules step if Flying Solo is selected but 10th is off', () => {
      const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.FLYING_SOLO, expansions: { ...baseGameState.expansions, tenth: false }};
      const flow = calculateSetupFlow(state);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeUndefined();
    });

    it.concurrent('generates a different flow for "The Browncoat Way"', () => {
      const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY };
      const flow = calculateSetupFlow(state);
      const flowIds = flow.map(f => f.id);
      
      expect(flowIds).toEqual([
        STEP_IDS.SETUP_CAPTAIN_EXPANSIONS,
        STEP_IDS.SETUP_CARD_SELECTION,
        STEP_IDS.SETUP_OPTIONAL_RULES,
        STEP_IDS.D_FIRST_GOAL,
        STEP_IDS.C1,
        STEP_IDS.C2,
        STEP_IDS.D_BC_CAPITOL,
        STEP_IDS.C3,
        STEP_IDS.C6,
        STEP_IDS.C_PRIME,
        STEP_IDS.FINAL,
      ]);
    });
  });
});