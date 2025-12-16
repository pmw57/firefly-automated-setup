
import { describe, it, expect } from 'vitest';
import { calculateSetupFlow } from '../../utils/flow';
import { GameState } from '../../types';
import { getDefaultGameState } from '../../utils/state';
import { STEP_IDS, SETUP_CARD_IDS } from '../../data/ids';

describe('utils/flow', () => {
  describe('calculateSetupFlow', () => {
    const baseGameState = getDefaultGameState();

    it('generates the standard flow for a default game', () => {
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
        STEP_IDS.CORE_NAV_DECKS,
        STEP_IDS.CORE_ALLIANCE_REAVER,
        STEP_IDS.CORE_DRAFT,
        STEP_IDS.CORE_MISSION,
        STEP_IDS.CORE_RESOURCES,
        STEP_IDS.CORE_JOBS,
        STEP_IDS.CORE_PRIME_PUMP,
        STEP_IDS.FINAL,
      ]);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeUndefined();
    });

    it('includes optional rules step if 10th Anniversary expansion is active', () => {
      const state: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, tenth: true }};
      const flow = calculateSetupFlow(state);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeDefined();
    });
    
    it('includes optional rules step if Flying Solo is the setup card', () => {
      const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
      const flow = calculateSetupFlow(state);
      expect(flow.find(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBeDefined();
    });

    it('generates a different flow for "The Browncoat Way"', () => {
      const state: GameState = { ...baseGameState, setupCardId: 'TheBrowncoatWay' };
      const flow = calculateSetupFlow(state);
      const flowIds = flow.map(f => f.id);
      
      expect(flowIds).toEqual([
        STEP_IDS.SETUP_CAPTAIN_EXPANSIONS,
        STEP_IDS.SETUP_CARD_SELECTION,
        STEP_IDS.CORE_MISSION,
        STEP_IDS.CORE_NAV_DECKS,
        STEP_IDS.CORE_ALLIANCE_REAVER,
        STEP_IDS.D_BC_CAPITOL,
        STEP_IDS.CORE_DRAFT,
        STEP_IDS.CORE_JOBS,
        STEP_IDS.CORE_PRIME_PUMP,
        STEP_IDS.FINAL,
      ]);
    });
  });
});
