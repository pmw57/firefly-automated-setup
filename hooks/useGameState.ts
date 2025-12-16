import React, { createContext, useContext } from 'react';
import { GameState } from '../types';

export interface GameStateContextType {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  isStateInitialized: boolean;
  resetGameState: () => void;
}

export const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};