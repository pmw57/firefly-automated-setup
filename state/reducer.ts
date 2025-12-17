import { GameState, Expansions } from '../types';
import { Action, ActionType } from './actions';
import { STORY_CARDS } from '../data/storyCards';
import { SETUP_CARDS } from '../data/setupCards';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { SETUP_CARD_IDS } from '../data/ids';

// --- Default State ---

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
        playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'],
        setupCardId: SETUP_CARD_IDS.STANDARD,
        setupCardName: 'Standard Game Setup',
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
        },
        expansions: allExpansions,
        isCampaign: false,
        campaignStoriesCompleted: 0,
    };
};

// --- Logic Helpers (Pure Functions) ---

const adjustPlayerNames = (currentNames: string[], targetCount: number): string[] => {
    const newNames = [...currentNames];
    if (targetCount > newNames.length) {
        for (let i = newNames.length; i < targetCount; i++) {
            newNames.push(`Captain ${i + 1}`);
        }
    } else {
        newNames.length = targetCount;
    }
    return newNames;
};

const enforceMultiplayerConstraints = (state: GameState): GameState => {
    const newState = { ...state };

    // Reset setup card if switching modes makes current selection invalid
    if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        newState.setupCardId = SETUP_CARD_IDS.STANDARD;
        newState.setupCardName = 'Standard Game Setup';
        newState.secondarySetupId = undefined;
    }

    // Reset Story Card if it was Solo-only and we are now Multiplayer
    const currentStoryDef = STORY_CARDS.find(c => c.title === state.selectedStoryCard);
    if (currentStoryDef?.isSolo) {
        const defaultMulti = STORY_CARDS.find(c => !c.isSolo && c.requiredExpansion !== 'community') || STORY_CARDS[0];
        newState.selectedStoryCard = defaultMulti.title;
        newState.selectedGoal = defaultMulti.goals?.[0]?.title;
        newState.challengeOptions = {};
    }

    return newState;
};

const handlePlayerCountChange = (state: GameState, count: number): GameState => {
    const safeCount = Math.max(1, Math.min(9, count));
    const newMode = safeCount === 1 ? 'solo' : 'multiplayer';
    
    // Create base new state with updated count and mode
    const baseNewState: GameState = {
        ...state,
        playerCount: safeCount,
        gameMode: newMode,
        playerNames: adjustPlayerNames(state.playerNames, safeCount),
        isCampaign: newMode === 'multiplayer' ? false : state.isCampaign,
    };

    // Apply specific constraints if switching to multiplayer, otherwise return as is
    const finalState = newMode === 'multiplayer' 
        ? enforceMultiplayerConstraints(baseNewState) 
        : baseNewState;
    
    return finalState;
};

const handleExpansionToggle = (state: GameState, expansionId: keyof GameState['expansions']): GameState => {
    const nextExpansions = { ...state.expansions, [expansionId]: !state.expansions[expansionId] };
    const newState: GameState = { ...state, expansions: nextExpansions };
    
    // Auto-switch edition based on Tenth expansion presence
    if (expansionId === 'tenth') {
        newState.gameEdition = nextExpansions.tenth ? 'tenth' : 'original';
    }

    // Validate Setup Card against new expansion state
    const currentSetup = SETUP_CARDS.find(s => s.id === state.setupCardId);
    let shouldResetSetup = false;

    if (currentSetup?.requiredExpansion && !nextExpansions[currentSetup.requiredExpansion]) {
        shouldResetSetup = true;
    }
    // Specific case: Flying Solo requires Tenth
    if (expansionId === 'tenth' && !nextExpansions.tenth && state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        shouldResetSetup = true;
    }
    
    if (shouldResetSetup) {
        newState.setupCardId = SETUP_CARD_IDS.STANDARD;
        newState.setupCardName = 'Standard Game Setup';
        newState.secondarySetupId = undefined;
    }
    return newState;
};

const handleAutoSelectFlyingSolo = (state: GameState): GameState => {
    const { gameMode, expansions, setupCardId } = state;
    const isDefaultSetup = !setupCardId || setupCardId === SETUP_CARD_IDS.STANDARD;
    
    if (gameMode === 'solo' && expansions.tenth && isDefaultSetup) {
        return {
            ...state,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: SETUP_CARD_IDS.STANDARD,
        };
    }
    return state;
};

const handleToggleFlyingSolo = (state: GameState): GameState => {
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    if (isFlyingSolo) {
        // Turning OFF -> Revert to secondary or default
        const newId = state.secondarySetupId || SETUP_CARD_IDS.STANDARD;
        const newDef = SETUP_CARDS.find(c => c.id === newId);
        return {
            ...state,
            setupCardId: newId,
            setupCardName: newDef?.label || 'Standard Game Setup',
            secondarySetupId: undefined
        };
    } else {
        // Turning ON -> Set main to FlyingSolo, keep current as secondary if valid
        return {
            ...state,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: state.setupCardId
        };
    }
};

// --- Main Reducer ---

export function gameReducer(state: GameState, action: Action): GameState {
  switch (action.type) {
    case ActionType.SET_PLAYER_COUNT:
      return handlePlayerCountChange(state, action.payload);
    
    case ActionType.SET_PLAYER_NAME: {
      const newNames = [...state.playerNames];
      newNames[action.payload.index] = action.payload.name;
      return { ...state, playerNames: newNames };
    }
    
    case ActionType.TOGGLE_EXPANSION:
      return handleExpansionToggle(state, action.payload);

    case ActionType.SET_CAMPAIGN_MODE:
        return { ...state, isCampaign: action.payload };

    case ActionType.SET_CAMPAIGN_STORIES:
        return { ...state, campaignStoriesCompleted: Math.max(0, action.payload) };

    case ActionType.AUTO_SELECT_FLYING_SOLO:
        return handleAutoSelectFlyingSolo(state);
    
    case ActionType.SET_SETUP_CARD: {
      const { id, name } = action.payload;
      if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        return { ...state, secondarySetupId: id };
      }
      return { ...state, setupCardId: id, setupCardName: name, secondarySetupId: undefined };
    }

    case ActionType.TOGGLE_FLYING_SOLO:
        return handleToggleFlyingSolo(state);

    case ActionType.SET_STORY_CARD:
      return { ...state, selectedStoryCard: action.payload.title, selectedGoal: action.payload.goal, challengeOptions: {} };
      
    case ActionType.SET_GOAL:
      return { ...state, selectedGoal: action.payload };

    case ActionType.RESET_CHALLENGES:
      return { ...state, challengeOptions: {} };

    case ActionType.TOGGLE_CHALLENGE_OPTION:
      return {
        ...state,
        challengeOptions: { ...state.challengeOptions, [action.payload]: !state.challengeOptions[action.payload] }
      };
      
    case ActionType.SET_DISGRUNTLED_DIE:
      return { ...state, optionalRules: { ...state.optionalRules, disgruntledDie: action.payload } };
      
    case ActionType.TOGGLE_SHIP_UPGRADES:
      return { ...state, optionalRules: { ...state.optionalRules, optionalShipUpgrades: !state.optionalRules.optionalShipUpgrades } };
      
    case ActionType.TOGGLE_SOLO_OPTION:
      return { ...state, soloOptions: { ...state.soloOptions, [action.payload]: !state.soloOptions[action.payload] } };
      
    case ActionType.TOGGLE_TIMER_MODE:
      return { ...state, timerConfig: { ...state.timerConfig, mode: state.timerConfig.mode === 'standard' ? 'unpredictable' : 'standard' } };

    case ActionType.RESET_GAME:
      return getDefaultGameState();

    default:
      return state;
  }
}