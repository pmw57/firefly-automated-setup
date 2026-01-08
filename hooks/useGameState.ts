import React, { useContext, createContext } from 'react';
import { GameState, DisgruntledDieOption, Expansions } from '../types/index';
import { Action, ExpansionBundle } from '../state/actions';

// --- State Context (for reading state) ---

export interface GameStateContextType {
  state: GameState;
  isStateInitialized: boolean;
}
export const GameStateContext = createContext<GameStateContextType | undefined>(undefined);
export const useGameState = (): GameStateContextType => {
  const context = useContext(GameStateContext);
  if (context === undefined) {
    throw new Error('useGameState must be used within a GameStateProvider');
  }
  return context;
};

// --- Dispatch Context (for writing state) ---

export interface GameDispatchContextType {
  dispatch: React.Dispatch<Action>;
  resetGameState: () => void;
  setPlayerCount: (count: number) => void;
  setPlayerName: (index: number, name: string) => void;
  toggleExpansion: (key: keyof Expansions) => void;
  setCampaignMode: (isCampaign: boolean) => void;
  setCampaignStories: (count: number) => void;
  setSetupCard: (id: string, name: string) => void;
  toggleFlyingSolo: () => void;
  setStoryCard: (index: number | null, goal?: string) => void;
  setGoal: (goalTitle: string) => void;
  toggleChallengeOption: (id: string) => void;
  setDisgruntledDie: (mode: DisgruntledDieOption) => void;
  toggleShipUpgrades: () => void;
  toggleConflictResolution: () => void;
  toggleHighVolumeSupply: () => void;
  // FIX: Add missing function to the type definition.
  setFinalStartingCredits: (credits: number) => void;
  toggleSoloOption: (key: keyof GameState['soloOptions']) => void;
  toggleTimerMode: () => void;
  toggleUnpredictableToken: (index: number) => void;
  acknowledgeOverrides: (ids: string[]) => void;
  visitOverriddenStep: (id: string) => void;
  setDraftConfig: (config: GameState['draft']) => void;
  setSetupMode: (mode: 'quick' | 'detailed') => void;
  setExpansionsBundle: (bundle: ExpansionBundle) => void;
  setMissionDossierSubstep: (step: number) => void;
  initializeOptionalRules: () => void;
}
export const GameDispatchContext = createContext<GameDispatchContextType | undefined>(undefined);

// --- Wizard State Context (for UI state) ---

export interface WizardStateContextType {
  currentStepIndex: number;
  setCurrentStepIndex: React.Dispatch<React.SetStateAction<number>>;
  isWizardInitialized: boolean;
}
export const WizardStateContext = createContext<WizardStateContextType | undefined>(undefined);
