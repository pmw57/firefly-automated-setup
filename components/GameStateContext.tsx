import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { GameState } from '../types/index';
import { gameReducer, getDefaultGameState } from '../state/reducer';
import { LocalStorageService } from '../utils/storage';
import { ActionType } from '../state/actions';
import { GameStateContext } from '../hooks/useGameState';
import { GAME_STATE_STORAGE_KEY, WIZARD_STEP_STORAGE_KEY } from '../data/constants';

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
  
  const [isStateInitialized, setIsStateInitialized] = useState(!!initialState);

  // --- Wizard Step Persistence Logic (moved from SetupWizard.tsx) ---
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWizardInitialized, setIsWizardInitialized] = useState(false);

  useEffect(() => {
    if (initialState) {
        setIsWizardInitialized(true);
        return;
    }
    const savedStep = localStorage.getItem(WIZARD_STEP_STORAGE_KEY);
    if (savedStep) {
      try {
        const parsedStep: number = JSON.parse(savedStep);
        setCurrentStepIndex(parsedStep);
      } catch (e) {
        console.warn("Wizard step reset due to error", e);
        localStorage.removeItem(WIZARD_STEP_STORAGE_KEY);
      }
    }
    setIsWizardInitialized(true);
  }, [initialState]);

  useEffect(() => {
    if (!isWizardInitialized || initialState) return;
    localStorage.setItem(WIZARD_STEP_STORAGE_KEY, JSON.stringify(currentStepIndex));
  }, [currentStepIndex, isWizardInitialized, initialState]);
  // --- End Wizard Step Logic ---
  
  // This effect synchronizes the reducer's state with localStorage.
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
    localStorage.removeItem(WIZARD_STEP_STORAGE_KEY);
    setCurrentStepIndex(0);
    dispatch({ type: ActionType.RESET_GAME });
  }, []);

  const value = { state, dispatch, isStateInitialized, resetGameState, currentStepIndex, setCurrentStepIndex, isWizardInitialized };

  return (
    <GameStateContext.Provider value={value}>
      {children}
    </GameStateContext.Provider>
  );
}
