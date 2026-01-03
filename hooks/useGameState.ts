import React, { useContext, createContext } from 'react';
import { GameState } from '../types/index';
import { Action } from '../state/actions';

export interface GameStateContextType {
  state: GameState;
  dispatch: React.Dispatch<Action>;
  isStateInitialized: boolean;
  resetGameState: () => void;
  // Wizard state, managed here to centralize persistence logic
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  isWizardInitialized: boolean;
}

export const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};
