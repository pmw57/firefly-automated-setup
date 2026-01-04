/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { calculateSetupFlow } from '../../../utils/flow';
import { GameState } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { STEP_IDS, SETUP_CARD_IDS } from '../../../data/ids';

describe('state/flow', () => {
  describe('calculateSetupFlow', () => {
    const baseGameState = getDefaultGameState();

    it.concurrent('generates the standard flow and always includes optional rules', () => {
      // This test verifies the flow for a standard setup, ensuring
      // the Optional Rules step is always included, regardless of expansions.
      const state: GameState = {
        ...baseGameState,
        setupCardId: SETUP_CARD_IDS.STANDARD,
      };
      const flow = calculateSetupFlow(state);
      const flowIds = flow.map(f => f.id);
      
      expect(flowIds).toEqual([
        STEP_IDS.SETUP_CAPTAIN_EXPANSIONS,
        STEP_IDS.SETUP_CARD_SELECTION,
        STEP_IDS.SETUP_OPTIONAL_RULES, // Now always present
        STEP_IDS.C1,
        STEP_IDS.C2,
        STEP_IDS.C3,
        STEP_IDS.C4,
        STEP_IDS.C5,
        STEP_IDS.C6,
        STEP_IDS.C_PRIME,
        STEP_IDS.FINAL,
      ]);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeDefined();
    });

    it.concurrent('includes optional rules step if 10th Anniversary expansion is active', () => {
      const state: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, tenth: true }};
      const flow = calculateSetupFlow(state);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeDefined();
    });
    
    it.concurrent('includes optional rules step even if 10th expansion is off', () => {
      const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.FLYING_SOLO, expansions: { ...baseGameState.expansions, tenth: false }};
      const flow = calculateSetupFlow(state);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeDefined();
    });

    it.concurrent('generates a different flow for "The Browncoat Way"', () => {
      const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY };
      const flow = calculateSetupFlow(state);
      const flowIds = flow.map(f => f.id);
      
      expect(flowIds).toEqual([
        STEP_IDS.SETUP_CAPTAIN_EXPANSIONS,
        STEP_IDS.SETUP_CARD_SELECTION,
        STEP_IDS.SETUP_OPTIONAL_RULES,
        // FIX: Replaced D_FIRST_GOAL with C4, which is the correct step ID for the goal selection.
        STEP_IDS.C4,
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