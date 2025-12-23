import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { GameState } from '../types';
import { gameReducer, getDefaultGameState } from '../state/reducer';
import { LocalStorageService } from '../utils/storage';
import { ActionType } from '../state/actions';
import { GameStateContext } from '../hooks/useGameState';

const GAME_STATE_STORAGE_KEY = 'firefly_gameState_v3';
const storageService = new LocalStorageService(GAME_STATE_STORAGE_KEY);

const initializer = (): GameState => {
  const saved = storageService.load();
  if (saved) {
    try {
      if (!saved.gameEdition) throw new Error("Legacy or invalid state");
      
      const defaults = getDefaultGameState();
      const mergedState: GameState = {
          ...defaults,
          ...saved,
          timerConfig: { ...defaults.timerConfig, ...(saved.timerConfig || {}) },
          soloOptions: { ...defaults.soloOptions, ...(saved.soloOptions || {}) },
          optionalRules: { ...defaults.optionalRules, ...(saved.optionalRules || {}) },
          expansions: { ...defaults.expansions, ...(saved.expansions || {}) },
          challengeOptions: { ...defaults.challengeOptions, ...(saved.challengeOptions || {}) }
      };
      return mergedState;
    } catch (e) {
      console.warn("Game state reset due to error", e);
      storageService.clear();
    }
  }
  return getDefaultGameState();
};

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, undefined, initializer);
  const [isStateInitialized, setIsStateInitialized] = useState(false);
  
  // This effect synchronizes the reducer's state with localStorage.
  useEffect(() => {
    // We only start saving *after* the initial state has been loaded.
    if (isStateInitialized) {
      storageService.save(state);
    }
  }, [state, isStateInitialized]);

  // Mark initialization as complete after the first render.
  useEffect(() => {
    setIsStateInitialized(true);
  }, []);

  const resetGameState = useCallback(() => {
    storageService.clear();
    // Dispatch RESET_GAME instead of reload to stay within the same route context
    dispatch({ type: ActionType.RESET_GAME });
  }, []);

  const value = { state, dispatch, isStateInitialized, resetGameState };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}