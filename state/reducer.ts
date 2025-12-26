// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { GameState, Expansions } from '../types/index';
import { Action, ActionType } from './actions';
import { STORY_CARDS } from '../data/storyCards';
import { SETUP_CARDS } from '../data/setupCards';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { SETUP_CARD_IDS } from '../data/ids';

// --- Pure Validation Functions ---

/**
 * Validates that the selected Setup Card is compatible with the enabled expansions.
 * Resets to Standard if a required expansion is disabled.
 */
const validateSetupCard = (state: GameState): GameState => {
    const currentSetup = SETUP_CARDS.find(s => s.id === state.setupCardId);
    let shouldResetSetup = false;

    if (currentSetup?.requiredExpansion && !state.expansions[currentSetup.requiredExpansion]) {
        shouldResetSetup = true;
    }
    // Specific case: Flying Solo requires the Tenth Anniversary expansion.
    if (!state.expansions.tenth && state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        shouldResetSetup = true;
    }
    
    if (shouldResetSetup) {
        return {
            ...state,
            setupCardId: SETUP_CARD_IDS.STANDARD,
            setupCardName: 'Standard Game Setup',
            secondarySetupId: undefined,
        };
    }
    return state;
};

/**
 * Validates that a solo-only Story Card is not selected in a multiplayer game.
 */
const validateStoryCard = (state: GameState): GameState => {
    const currentStoryDef = STORY_CARDS.find(c => c.title === state.selectedStoryCard);
    if (state.gameMode === 'multiplayer' && currentStoryDef?.isSolo) {
        return {
            ...state,
            selectedStoryCard: '',
            selectedGoal: undefined,
            challengeOptions: {},
        };
    }
    return state;
}

/**
 * Validates game mode specific rules, like 'Flying Solo' only being available in solo.
 */
const validateGameMode = (state: GameState): GameState => {
    let newState = { ...state };

    // 'Flying Solo' is not a valid setup for multiplayer.
    if (newState.gameMode === 'multiplayer' && newState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        newState = {
            ...newState,
            setupCardId: SETUP_CARD_IDS.STANDARD,
            setupCardName: 'Standard Game Setup',
            secondarySetupId: undefined,
        };
    }

    // Auto-select 'Flying Solo' if player count is 1, 10th expansion is on, and setup is standard.
    const isDefaultSetup = !newState.setupCardId || newState.setupCardId === SETUP_CARD_IDS.STANDARD;
    if (newState.gameMode === 'solo' && newState.expansions.tenth && isDefaultSetup) {
        newState = {
            ...newState,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: newState.setupCardId || SETUP_CARD_IDS.STANDARD,
        };
    }

    return newState;
}


/**
 * A master validation function that runs after every state change to ensure consistency.
 * It composes smaller, single-purpose validation functions.
 */
const validateState = (state: GameState): GameState => {
    let validatedState = state;
    validatedState = validateSetupCard(validatedState);
    validatedState = validateStoryCard(validatedState);
    validatedState = validateGameMode(validatedState);
    // Add other validation functions here as needed
    return validatedState;
};


// --- Reducer and Action Handlers ---

export const getDefaultGameState = (): GameState => {
    const allExpansions = EXPANSIONS_METADATA.reduce((acc, exp) => {
        if (exp.id !== 'base') {
            (acc as Record<keyof Expansions, boolean>)[exp.id] = true; // Default all expansions to ON
        }
        return acc;
    }, {} as Expansions);

    return {
        gameEdition: 'tenth',
        gameMode: 'multiplayer',
        playerCount: 4,
        playerNames: ['', '', '', ''],
        setupCardId: '',
        setupCardName: '',
        secondarySetupId: undefined,
        selectedStoryCard: '',
        selectedGoal: undefined,
        challengeOptions: {},
        timerConfig: {
            mode: 'standard',
            unpredictableSelectedIndices: [0, 2, 4, 5],
            randomizeUnpredictable: false,
        },
        soloOptions: {
            noSureThings: false,
            shesTrouble: false,
            recipeForUnpleasantness: false,
        },
        optionalRules: {
            disgruntledDie: 'standard',
            optionalShipUpgrades: false,
            resolveConflictsManually: false,
            highVolumeSupply: true,
        },
        expansions: allExpansions,
        isCampaign: false,
        campaignStoriesCompleted: 0,
        finalStartingCredits: null,
    };
};

const adjustPlayerNames = (currentNames: string[], targetCount: number): string[] => {
    const newNames = [...currentNames];
    if (targetCount > newNames.length) {
        for (let i = newNames.length; i < targetCount; i++) {
            newNames.push('');
        }
    } else {
        newNames.length = targetCount;
    }
    return newNames;
};

const handlePlayerCountChange = (state: GameState, count: number): GameState => {
    const safeCount = Math.max(1, Math.min(9, count));
    const newMode = safeCount === 1 ? 'solo' : 'multiplayer';
    
    return {
        ...state,
        playerCount: safeCount,
        gameMode: newMode,
        playerNames: adjustPlayerNames(state.playerNames, safeCount),
        isCampaign: newMode === 'multiplayer' ? false : state.isCampaign,
    };
};

const handleExpansionToggle = (state: GameState, expansionId: keyof GameState['expansions']): GameState => {
    const nextExpansions = { ...state.expansions, [expansionId]: !state.expansions[expansionId] };
    const newState: GameState = { ...state, expansions: nextExpansions };
    
    if (expansionId === 'tenth') {
        newState.gameEdition = nextExpansions.tenth ? 'tenth' : 'original';
    }
    
    return newState;
};

const handleToggleFlyingSolo = (state: GameState): GameState => {
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    if (isFlyingSolo) {
        const newId = state.secondarySetupId || '';
        const newDef = SETUP_CARDS.find(c => c.id === newId);
        return {
            ...state,
            setupCardId: newId,
            setupCardName: newDef?.label || '',
            secondarySetupId: undefined
        };
    } else {
        return {
            ...state,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: state.setupCardId
        };
    }
};

export function gameReducer(state: GameState, action: Action): GameState {
  let nextState: GameState;

  switch (action.type) {
    case ActionType.SET_PLAYER_COUNT:
      nextState = handlePlayerCountChange(state, action.payload);
      break;
    
    case ActionType.SET_PLAYER_NAME: {
      const newNames = [...state.playerNames];
      newNames[action.payload.index] = action.payload.name;
      nextState = { ...state, playerNames: newNames };
      break;
    }
    
    case ActionType.TOGGLE_EXPANSION:
      nextState = handleExpansionToggle(state, action.payload);
      break;

    case ActionType.SET_CAMPAIGN_MODE:
      nextState = { ...state, isCampaign: action.payload };
      break;

    case ActionType.SET_CAMPAIGN_STORIES:
      nextState = { ...state, campaignStoriesCompleted: Math.max(0, action.payload) };
      break;
    
    case ActionType.SET_SETUP_CARD: {
      const { id, name } = action.payload;
      if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        nextState = { ...state, secondarySetupId: id };
      } else {
        nextState = { ...state, setupCardId: id, setupCardName: name, secondarySetupId: undefined };
      }
      break;
    }

    case ActionType.TOGGLE_FLYING_SOLO:
      nextState = handleToggleFlyingSolo(state);
      break;

    case ActionType.SET_STORY_CARD:
      nextState = { ...state, selectedStoryCard: action.payload.title, selectedGoal: action.payload.goal, challengeOptions: {} };
      break;
      
    case ActionType.SET_GOAL:
      nextState = { ...state, selectedGoal: action.payload };
      break;

    case ActionType.RESET_CHALLENGES:
      nextState = { ...state, challengeOptions: {} };
      break;

    case ActionType.TOGGLE_CHALLENGE_OPTION:
      nextState = {
        ...state,
        challengeOptions: { ...state.challengeOptions, [action.payload]: !state.challengeOptions[action.payload] }
      };
      break;
      
    case ActionType.SET_DISGRUNTLED_DIE:
      nextState = { ...state, optionalRules: { ...state.optionalRules, disgruntledDie: action.payload } };
      break;
      
    case ActionType.TOGGLE_SHIP_UPGRADES:
      nextState = { ...state, optionalRules: { ...state.optionalRules, optionalShipUpgrades: !state.optionalRules.optionalShipUpgrades } };
      break;
    
    case ActionType.TOGGLE_CONFLICT_RESOLUTION:
      nextState = { ...state, optionalRules: { ...state.optionalRules, resolveConflictsManually: !state.optionalRules.resolveConflictsManually } };
      break;

    case ActionType.TOGGLE_HIGH_VOLUME_SUPPLY:
      nextState = { ...state, optionalRules: { ...state.optionalRules, highVolumeSupply: !state.optionalRules.highVolumeSupply } };
      break;

    case ActionType.SET_FINAL_STARTING_CREDITS:
      nextState = { ...state, finalStartingCredits: action.payload };
      break;
      
    case ActionType.TOGGLE_SOLO_OPTION:
      nextState = { ...state, soloOptions: { ...state.soloOptions, [action.payload]: !state.soloOptions[action.payload] } };
      break;
      
    case ActionType.TOGGLE_TIMER_MODE:
      nextState = { ...state, timerConfig: { ...state.timerConfig, mode: state.timerConfig.mode === 'standard' ? 'unpredictable' : 'standard' } };
      break;

    case ActionType.RESET_GAME:
      nextState = getDefaultGameState();
      break;

    default:
      nextState = state;
  }
  
  // After every action, run the validation logic to ensure a consistent state.
  return validateState(nextState);
}