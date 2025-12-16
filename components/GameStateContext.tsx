
import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types';
import { getDefaultGameState } from '../utils';
import { GameStateContext } from '../hooks/useGameState';

const GAME_STATE_STORAGE_KEY = 'firefly_gameState_v3';

// FIX: Changed from a function declaration to a const with React.FC to resolve typing issues with children props.
export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(getDefaultGameState());
  const [isStateInitialized, setIsStateInitialized] = useState(false);

  // Load state from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(GAME_STATE_STORAGE_KEY);
    if (saved) {
      try {
        const loadedState: GameState = JSON.parse(saved);
        if (!loadedState.gameEdition) throw new Error("Legacy or invalid state");
        
        const defaults = getDefaultGameState();
        const mergedState: GameState = {
            ...defaults,
            ...loadedState,
            timerConfig: { ...defaults.timerConfig, ...(loadedState.timerConfig || {}) },
            soloOptions: { ...defaults.soloOptions, ...(loadedState.soloOptions || {}) },
            optionalRules: { ...defaults.optionalRules, ...(loadedState.optionalRules || {}) },
            expansions: { ...defaults.expansions, ...(loadedState.expansions || {}) },
            challengeOptions: { ...defaults.challengeOptions, ...(loadedState.challengeOptions || {}) }
        };
        setGameState(mergedState);
      } catch (e) {
        console.warn("Game state reset due to error", e);
        localStorage.removeItem(GAME_STATE_STORAGE_KEY);
      }
    }
    setIsStateInitialized(true);
  }, []);

  // Save game state to local storage
  useEffect(() => {
    if (!isStateInitialized) return;
    localStorage.setItem(GAME_STATE_STORAGE_KEY, JSON.stringify(gameState));
  }, [gameState, isStateInitialized]);

  const resetGameState = useCallback(() => {
    localStorage.removeItem(GAME_STATE_STORAGE_KEY);
    setGameState(getDefaultGameState());
  }, []);

  const value = { gameState, setGameState, isStateInitialized, resetGameState };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}
