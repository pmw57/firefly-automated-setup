/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { gameReducer, getDefaultGameState } from '../../../state/reducer';
import { GameState } from '../../../types/index';
import { ActionType } from '../../../state/actions';
import { SETUP_CARD_IDS } from '../../../data/ids';

describe('state/reducer', () => {
  const baseGameState = getDefaultGameState();

  describe('SET_PLAYER_COUNT', () => {
    it.concurrent('switches to solo mode when player count is 1', () => {
      const newState = gameReducer(baseGameState, { type: ActionType.SET_PLAYER_COUNT, payload: 1 });
      expect(newState.gameMode).toBe('solo');
      expect(newState.playerCount).toBe(1);
      expect(newState.playerNames.length).toBe(1);
    });

    it.concurrent('switches to multiplayer mode from solo', () => {
      const soloState: GameState = { ...baseGameState, playerCount: 1, gameMode: 'solo' };
      const newState = gameReducer(soloState, { type: ActionType.SET_PLAYER_COUNT, payload: 2 });
      expect(newState.gameMode).toBe('multiplayer');
      expect(newState.playerCount).toBe(2);
      expect(newState.playerNames.length).toBe(2);
    });

    it.concurrent('adds player names when increasing count', () => {
      const state: GameState = { ...baseGameState, playerCount: 2, playerNames: ['A', 'B'] };
      const newState = gameReducer(state, { type: ActionType.SET_PLAYER_COUNT, payload: 4 });
      expect(newState.playerNames).toEqual(['A', 'B', '', '']);
    });

    it.concurrent('removes player names when decreasing count', () => {
      const stateWithNames: GameState = { ...baseGameState, playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'] };
      const newState = gameReducer(stateWithNames, { type: ActionType.SET_PLAYER_COUNT, payload: 2 });
      expect(newState.playerNames).toEqual(['Captain 1', 'Captain 2']);
    });

    it.concurrent('resets setup card from Flying Solo when switching to multiplayer', () => {
        const soloState: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
        const newState = gameReducer(soloState, { type: ActionType.SET_PLAYER_COUNT, payload: 2 });
        expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });
  
  describe('TOGGLE_EXPANSION', () => {
    it.concurrent('toggles an expansion off', () => {
      // 'blue' is on by default in the new base state
      const newState = gameReducer(baseGameState, { type: ActionType.TOGGLE_EXPANSION, payload: 'blue' });
      expect(newState.expansions.blue).toBe(false);
    });
    
    it.concurrent('toggles an expansion on', () => {
      const stateWithBlueOff: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false } };
      const newState = gameReducer(stateWithBlueOff, { type: ActionType.TOGGLE_EXPANSION, payload: 'blue' });
      expect(newState.expansions.blue).toBe(true);
    });

    it.concurrent('updates gameEdition when tenth is toggled', () => {
      const state1 = gameReducer(baseGameState, { type: ActionType.TOGGLE_EXPANSION, payload: 'tenth' });
      expect(state1.gameEdition).toBe('original');

      const state2 = gameReducer(state1, { type: ActionType.TOGGLE_EXPANSION, payload: 'tenth' });
      expect(state2.gameEdition).toBe('tenth');
    });

    it.concurrent('resets setup card if its required expansion is disabled', () => {
        const stateWithSetup: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, crime: true }, setupCardId: 'AllianceHighAlert' };
        const newState = gameReducer(stateWithSetup, { type: ActionType.TOGGLE_EXPANSION, payload: 'crime' });
        expect(newState.setupCardId).toBe(SETUP_CARD_IDS.STANDARD);
    });
  });
});
