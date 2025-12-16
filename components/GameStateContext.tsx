import React, { useState, useEffect, useCallback } from 'react';
import { GameState } from '../types';
import { getDefaultGameState } from '../utils/state';
import { GameStateContext } from '../hooks/useGameState';
import { LocalStorageService } from '../utils/storage';

const GAME_STATE_STORAGE_KEY = 'firefly_gameState_v3';
const storageService = new LocalStorageService(GAME_STATE_STORAGE_KEY);

export const GameStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(getDefaultGameState());
  const [isStateInitialized, setIsStateInitialized] = useState(false);

  // Load state from storage on mount
  useEffect(() => {
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
        setGameState(mergedState);
      } catch (e) {
        console.warn("Game state reset due to error", e);
        storageService.clear();
      }
    }
    setIsStateInitialized(true);
  }, []);

  // Save game state to storage
  useEffect(() => {
    if (!isStateInitialized) return;
    storageService.save(gameState);
  }, [gameState, isStateInitialized]);

  const resetGameState = useCallback(() => {
    storageService.clear();
    setGameState(getDefaultGameState());
  }, []);

  const value = { gameState, setGameState, isStateInitialized, resetGameState };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}