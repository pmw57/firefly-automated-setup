
import { describe, it, expect } from 'vitest';
import { updatePlayerCountState, updateExpansionState, autoSelectFlyingSoloState, getDefaultGameState } from '../../utils/state';
import { GameState } from '../../types';
import { SETUP_CARD_IDS } from '../../data/ids';

describe('utils/state', () => {
  const baseGameState = getDefaultGameState();

  describe('updatePlayerCountState', () => {
    it('switches to solo mode when player count is 1', () => {
      const newState = updatePlayerCountState(baseGameState, 1);
      expect(newState.gameMode).toBe('solo');
      expect(newState.playerCount).toBe(1);
      expect(newState.playerNames.length).toBe(1);
    });

    it('switches to multiplayer mode from solo', () => {
      const soloState: GameState = { ...baseGameState, playerCount: 1, gameMode: 'solo' };
      const newState = updatePlayerCountState(soloState, 2);
      expect(newState.gameMode).toBe('multiplayer');
      expect(newState.playerCount).toBe(2);
      expect(newState.playerNames.length).toBe(2);
    });

    it('adds player names when increasing count', () => {
      const state: GameState = { ...baseGameState, playerCount: 2, playerNames: ['A', 'B'] };
      const newState = updatePlayerCountState(state, 4);
      expect(newState.playerNames).toEqual(['A', 'B', 'Captain 3', 'Captain 4']);
    });

    it('removes player names when decreasing count', () => {
      const newState = updatePlayerCountState(baseGameState, 2);
      expect(newState.playerNames).toEqual(['Captain 1', 'Captain 2']);
    });

    it('resets setup card from Flying Solo when switching to multiplayer', () => {
        const soloState: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
        const newState = updatePlayerCountState(soloState, 2);
        expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });
  
  describe('updateExpansionState', () => {
    it('toggles an expansion off', () => {
      // 'blue' is on by default in the new base state
      const newState = updateExpansionState(baseGameState, 'blue');
      expect(newState.expansions.blue).toBe(false);
    });
    
    it('toggles an expansion on', () => {
      const stateWithBlueOff: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false } };
      const newState = updateExpansionState(stateWithBlueOff, 'blue');
      expect(newState.expansions.blue).toBe(true);
    });

    it('updates gameEdition when tenth is toggled', () => {
      // baseGameState has tenth: true, so gameEdition is 'tenth'. First toggle turns it off.
      const state1 = updateExpansionState(baseGameState, 'tenth');
      expect(state1.gameEdition).toBe('original');

      // state1 has tenth: false, so gameEdition is 'original'. Second toggle turns it back on.
      const state2 = updateExpansionState(state1, 'tenth');
      expect(state2.gameEdition).toBe('tenth');
    });

    it('resets setup card if its required expansion is disabled', () => {
        const stateWithSetup: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, pirates: true }, setupCardId: 'AllianceHighAlert' };
        const newState = updateExpansionState(stateWithSetup, 'pirates');
        expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });

  describe('autoSelectFlyingSoloState', () => {
    it('auto-selects Flying Solo if conditions are met', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', expansions: { ...baseGameState.expansions, tenth: true }};
      const newState = autoSelectFlyingSoloState(state);
      expect(newState.setupCardId).toBe(SETUP_CARD_IDS.FLYING_SOLO);
      expect(newState.secondarySetupId).toBe(SETUP_CARD_IDS.STANDARD);
    });
    
    it('does not auto-select if not in solo mode', () => {
      const state: GameState = { ...baseGameState, gameMode: 'multiplayer', expansions: { ...baseGameState.expansions, tenth: true }};
      const newState = autoSelectFlyingSoloState(state);
      expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
    
    it('does not auto-select if 10th Anniversary expansion is not active', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', expansions: { ...baseGameState.expansions, tenth: false }};
      const newState = autoSelectFlyingSoloState(state);
      expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });
});
