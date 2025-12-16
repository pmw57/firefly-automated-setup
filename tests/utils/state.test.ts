import { describe, it, expect } from 'vitest';
import { gameReducer, getDefaultGameState } from '../../state/reducer';
import { GameState } from '../../types';
import { ActionType } from '../../state/actions';
import { SETUP_CARD_IDS } from '../../data/ids';

describe('state/reducer', () => {
  const baseGameState = getDefaultGameState();

  describe('SET_PLAYER_COUNT', () => {
    it('switches to solo mode when player count is 1', () => {
      const newState = gameReducer(baseGameState, { type: ActionType.SET_PLAYER_COUNT, payload: 1 });
      expect(newState.gameMode).toBe('solo');
      expect(newState.playerCount).toBe(1);
      expect(newState.playerNames.length).toBe(1);
    });

    it('switches to multiplayer mode from solo', () => {
      const soloState: GameState = { ...baseGameState, playerCount: 1, gameMode: 'solo' };
      const newState = gameReducer(soloState, { type: ActionType.SET_PLAYER_COUNT, payload: 2 });
      expect(newState.gameMode).toBe('multiplayer');
      expect(newState.playerCount).toBe(2);
      expect(newState.playerNames.length).toBe(2);
    });

    it('adds player names when increasing count', () => {
      const state: GameState = { ...baseGameState, playerCount: 2, playerNames: ['A', 'B'] };
      const newState = gameReducer(state, { type: ActionType.SET_PLAYER_COUNT, payload: 4 });
      expect(newState.playerNames).toEqual(['A', 'B', 'Captain 3', 'Captain 4']);
    });

    it('removes player names when decreasing count', () => {
      const newState = gameReducer(baseGameState, { type: ActionType.SET_PLAYER_COUNT, payload: 2 });
      expect(newState.playerNames).toEqual(['Captain 1', 'Captain 2']);
    });

    it('resets setup card from Flying Solo when switching to multiplayer', () => {
        const soloState: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
        const newState = gameReducer(soloState, { type: ActionType.SET_PLAYER_COUNT, payload: 2 });
        expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });
  
  describe('TOGGLE_EXPANSION', () => {
    it('toggles an expansion off', () => {
      // 'blue' is on by default in the new base state
      const newState = gameReducer(baseGameState, { type: ActionType.TOGGLE_EXPANSION, payload: 'blue' });
      expect(newState.expansions.blue).toBe(false);
    });
    
    it('toggles an expansion on', () => {
      const stateWithBlueOff: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false } };
      const newState = gameReducer(stateWithBlueOff, { type: ActionType.TOGGLE_EXPANSION, payload: 'blue' });
      expect(newState.expansions.blue).toBe(true);
    });

    it('updates gameEdition when tenth is toggled', () => {
      const state1 = gameReducer(baseGameState, { type: ActionType.TOGGLE_EXPANSION, payload: 'tenth' });
      expect(state1.gameEdition).toBe('original');

      const state2 = gameReducer(state1, { type: ActionType.TOGGLE_EXPANSION, payload: 'tenth' });
      expect(state2.gameEdition).toBe('tenth');
    });

    it('resets setup card if its required expansion is disabled', () => {
        const stateWithSetup: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, pirates: true }, setupCardId: 'AllianceHighAlert' };
        const newState = gameReducer(stateWithSetup, { type: ActionType.TOGGLE_EXPANSION, payload: 'pirates' });
        expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });

  describe('AUTO_SELECT_FLYING_SOLO', () => {
    it('auto-selects Flying Solo if conditions are met', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', expansions: { ...baseGameState.expansions, tenth: true }};
      const newState = gameReducer(state, { type: ActionType.AUTO_SELECT_FLYING_SOLO });
      expect(newState.setupCardId).toBe(SETUP_CARD_IDS.FLYING_SOLO);
      expect(newState.secondarySetupId).toBe(SETUP_CARD_IDS.STANDARD);
    });
    
    it('does not auto-select if not in solo mode', () => {
      const state: GameState = { ...baseGameState, gameMode: 'multiplayer', expansions: { ...baseGameState.expansions, tenth: true }};
      const newState = gameReducer(state, { type: ActionType.AUTO_SELECT_FLYING_SOLO });
      expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
    
    it('does not auto-select if 10th Anniversary expansion is not active', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', expansions: { ...baseGameState.expansions, tenth: false }};
      const newState = gameReducer(state, { type: ActionType.AUTO_SELECT_FLYING_SOLO });
      expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });
});
