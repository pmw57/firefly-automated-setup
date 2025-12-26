import React, { useContext, createContext } from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { GameState } from '../types/index';
import { Action } from '../state/actions';

export interface GameStateContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
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