
import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { GameState } from '../types/index';
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

export const GameStateProvider: React.FC<{ children: React.ReactNode, initialState?: GameState }> = ({ children, initialState }) => {
  const [state, dispatch] = useReducer(
    gameReducer,
    initialState,
    (arg) => arg ?? initializer()
  );
  
  // For tests, state is initialized immediately. Otherwise, it's initialized after the first render.
  const [isStateInitialized, setIsStateInitialized] = useState(!!initialState);
  
  // This effect synchronizes the reducer's state with localStorage.
  // It's skipped during tests (when an initialState is provided) to improve isolation.
  useEffect(() => {
    if (isStateInitialized && !initialState) {
      storageService.save(state);
    }
  }, [state, isStateInitialized, initialState]);

  // Mark initialization as complete after the first render for non-test scenarios.
  useEffect(() => {
    if (!initialState) {
      setIsStateInitialized(true);
    }
  }, [initialState]);

  const resetGameState = useCallback(() => {
    storageService.clear();
    dispatch({ type: ActionType.RESET_GAME });
  }, []);

  const value = { state, dispatch, isStateInitialized, resetGameState };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}
