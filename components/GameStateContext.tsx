import React, { useReducer, useEffect, useCallback, useState } from 'react';
import { GameState, DisgruntledDieOption, Expansions } from '../types/index';
import { gameReducer, getDefaultGameState } from '../state/reducer';
import { LocalStorageService } from '../utils/storage';
// FIX: Import all necessary types and contexts to correctly implement the provider.
import { ActionType, ExpansionBundle } from '../state/actions';
import { GameStateContext, GameDispatchContext, WizardStateContext } from '../hooks/useGameState';
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

  // FIX: Implement all action dispatchers required by `GameDispatchContextType`.
  const resetGameState = useCallback(() => {
    storageService.clear();
    localStorage.removeItem(WIZARD_STEP_STORAGE_KEY);
    setCurrentStepIndex(0);
    dispatch({ type: ActionType.RESET_GAME });
  }, []);

  const setPlayerCount = useCallback((count: number) => dispatch({ type: ActionType.SET_PLAYER_COUNT, payload: count }), [dispatch]);
  const setPlayerName = useCallback((index: number, name: string) => dispatch({ type: ActionType.SET_PLAYER_NAME, payload: { index, name } }), [dispatch]);
  const toggleExpansion = useCallback((key: keyof Expansions) => dispatch({ type: ActionType.TOGGLE_EXPANSION, payload: key }), [dispatch]);
  const setCampaignMode = useCallback((isCampaign: boolean) => dispatch({ type: ActionType.SET_CAMPAIGN_MODE, payload: isCampaign }), [dispatch]);
  const setCampaignStories = useCallback((count: number) => dispatch({ type: ActionType.SET_CAMPAIGN_STORIES, payload: count }), [dispatch]);
  const setSetupCard = useCallback((id: string, name: string) => dispatch({ type: ActionType.SET_SETUP_CARD, payload: { id, name } }), [dispatch]);
  const toggleFlyingSolo = useCallback(() => dispatch({ type: ActionType.TOGGLE_FLYING_SOLO }), [dispatch]);
  const setStoryCard = useCallback((index: number | null, goal?: string) => dispatch({ type: ActionType.SET_STORY_CARD, payload: { index, goal } }), [dispatch]);
  const setGoal = useCallback((goalTitle: string) => dispatch({ type: ActionType.SET_GOAL, payload: goalTitle }), [dispatch]);
  const toggleChallengeOption = useCallback((id: string) => dispatch({ type: ActionType.TOGGLE_CHALLENGE_OPTION, payload: id }), [dispatch]);
  const setDisgruntledDie = useCallback((mode: DisgruntledDieOption) => dispatch({ type: ActionType.SET_DISGRUNTLED_DIE, payload: mode }), [dispatch]);
  const toggleShipUpgrades = useCallback(() => dispatch({ type: ActionType.TOGGLE_SHIP_UPGRADES }), [dispatch]);
  const toggleConflictResolution = useCallback(() => dispatch({ type: ActionType.TOGGLE_CONFLICT_RESOLUTION }), [dispatch]);
  const toggleHighVolumeSupply = useCallback(() => dispatch({ type: ActionType.TOGGLE_HIGH_VOLUME_SUPPLY }), [dispatch]);
  const setFinalStartingCredits = useCallback((credits: number) => dispatch({ type: ActionType.SET_FINAL_STARTING_CREDITS, payload: credits }), [dispatch]);
  const toggleSoloOption = useCallback((key: keyof GameState['soloOptions']) => dispatch({ type: ActionType.TOGGLE_SOLO_OPTION, payload: key }), [dispatch]);
  const toggleTimerMode = useCallback(() => dispatch({ type: ActionType.TOGGLE_TIMER_MODE }), [dispatch]);
  const toggleUnpredictableToken = useCallback((index: number) => dispatch({ type: ActionType.TOGGLE_UNPREDICTABLE_TOKEN, payload: index }), [dispatch]);
  const acknowledgeOverrides = useCallback((ids: string[]) => dispatch({ type: ActionType.ACKNOWLEDGE_OVERRIDES, payload: ids }), [dispatch]);
  const visitOverriddenStep = useCallback((id: string) => dispatch({ type: ActionType.VISIT_OVERRIDDEN_STEP, payload: id }), [dispatch]);
  const setDraftConfig = useCallback((config: GameState['draft']) => dispatch({ type: ActionType.SET_DRAFT_CONFIG, payload: config }), [dispatch]);
  const setSetupMode = useCallback((mode: 'quick' | 'detailed') => dispatch({ type: ActionType.SET_SETUP_MODE, payload: mode }), [dispatch]);
  const setExpansionsBundle = useCallback((bundle: ExpansionBundle) => dispatch({ type: ActionType.SET_EXPANSIONS_BUNDLE, payload: bundle }), [dispatch]);
  const setMissionDossierSubstep = useCallback((step: number) => dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: step }), [dispatch]);
  const initializeOptionalRules = useCallback(() => dispatch({ type: ActionType.INITIALIZE_OPTIONAL_RULES }), [dispatch]);

  // FIX: Create separate value objects for each context.
  const gameStateValue = { state, isStateInitialized };
  const gameDispatchValue = { dispatch, resetGameState, setPlayerCount, setPlayerName, toggleExpansion, setCampaignMode, setCampaignStories, setSetupCard, toggleFlyingSolo, setStoryCard, setGoal, toggleChallengeOption, setDisgruntledDie, toggleShipUpgrades, toggleConflictResolution, toggleHighVolumeSupply, setFinalStartingCredits, toggleSoloOption, toggleTimerMode, toggleUnpredictableToken, acknowledgeOverrides, visitOverriddenStep, setDraftConfig, setSetupMode, setExpansionsBundle, setMissionDossierSubstep, initializeOptionalRules };
  const wizardStateValue = { currentStepIndex, setCurrentStepIndex, isWizardInitialized };
  
  // FIX: Wrap children in all three context providers.
  return (
    <GameStateContext.Provider value={gameStateValue}>
      <GameDispatchContext.Provider value={gameDispatchValue}>
        <WizardStateContext.Provider value={wizardStateValue}>
          {children}
        </WizardStateContext.Provider>
      </GameDispatchContext.Provider>
    </GameStateContext.Provider>
  );
}
