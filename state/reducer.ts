import { GameState, Expansions, GameMode, SetupMode } from '../types/index';
import { Action, ActionType, ExpansionBundle } from './actions';
import { STORY_CARDS } from '../data/storyCards';
import { SETUP_CARDS } from '../data/setupCards';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { SETUP_CARD_IDS } from '../data/ids';
import { EXPANSION_SETTINGS_STORAGE_KEY, SETUP_MODE_STORAGE_KEY } from '../data/constants';

/**
 * A helper function to default to "Flying Solo" mode if the conditions are met.
 * This should be called when entering solo mode or when enabling the 10th Anniversary expansion.
 */
const defaultToFlyingSoloIfNeeded = (state: GameState): GameState => {
    const isEligible = state.gameMode === 'solo' && state.expansions.tenth;
    const isAlreadyFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;

    if (isEligible && !isAlreadyFlyingSolo) {
        // If the current setup is a valid card, store it as secondary.
        // If not (e.g., empty string), don't store it.
        const secondarySetupId = SETUP_CARDS.some(c => c.id === state.setupCardId) ? state.setupCardId : undefined;

        return {
            ...state,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: secondarySetupId,
            draft: { state: null, isManual: false },
        };
    }
    return state;
};

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
    if (state.selectedStoryCardIndex === null) return state;
    const currentStoryDef = STORY_CARDS[state.selectedStoryCardIndex];
    if (state.gameMode === 'multiplayer' && currentStoryDef?.isSolo) {
        return {
            ...state,
            selectedStoryCardIndex: null,
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

    return newState;
};

/**
 * Validates and resets optional rules if their required expansion (10th Anniversary) is disabled.
 */
const validateOptionalRules = (state: GameState): GameState => {
    let newState = { ...state };
    // If 10th Anniversary is not active, disable related optional rules.
    if (!newState.expansions.tenth) {
        newState = {
            ...newState,
            optionalRules: {
                ...newState.optionalRules,
                optionalShipUpgrades: false,
                disgruntledDie: 'standard',
            },
            soloOptions: {
                noSureThings: false,
                shesTrouble: false,
                recipeForUnpleasantness: false,
            },
            timerConfig: {
                ...newState.timerConfig,
                mode: 'standard',
            }
        };
    }
    return newState;
};


/**
 * A master validation function that runs after every state change to ensure consistency.
 * It composes smaller, single-purpose validation functions.
 */
const validateState = (state: GameState): GameState => {
    let validatedState = state;
    validatedState = validateSetupCard(validatedState);
    validatedState = validateStoryCard(validatedState);
    validatedState = validateGameMode(validatedState);
    validatedState = validateOptionalRules(validatedState);
    // Add other validation functions here as needed
    return validatedState;
};


// --- Reducer and Action Handlers ---

/**
 * Retrieves expansion settings from dedicated local storage.
 * Defaults to all official content being enabled, and independent content disabled.
 * Merges with user-saved settings to ensure new expansions are handled gracefully.
 */
const getPersistedExpansions = (): Expansions => {
    const defaultExpansions = EXPANSIONS_METADATA.reduce((acc, exp) => {
        if (exp.id !== 'base') {
            const isIndependent = exp.category === 'independent';
            (acc as Record<keyof Expansions, boolean>)[exp.id] = !isIndependent;
        }
        return acc;
    }, {} as Expansions);

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = localStorage.getItem(EXPANSION_SETTINGS_STORAGE_KEY);
            if (saved) {
                const savedExpansions = JSON.parse(saved);
                // Merge defaults with saved, so new expansions get the default
                // state while respecting the user's saved choices.
                return { ...defaultExpansions, ...savedExpansions };
            }
        }
    } catch (e) {
        console.error("Could not load expansion settings.", e);
    }

    return defaultExpansions;
};


/**
 * Retrieves the setup mode ('quick' or 'detailed') from local storage.
 * Defaults to 'detailed' if no setting is found.
 */
const getPersistedSetupMode = (): SetupMode => {
    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            const saved = localStorage.getItem(SETUP_MODE_STORAGE_KEY) as SetupMode;
            if (saved === 'quick' || saved === 'detailed') {
                return saved;
            }
        }
    } catch (e) {
        console.error("Could not load setup mode preference.", e);
    }
    return 'detailed';
};


export const getDefaultGameState = (): GameState => {
    return {
        gameEdition: 'tenth',
        gameMode: 'multiplayer',
        setupMode: getPersistedSetupMode(),
        playerCount: 4,
        playerNames: ['', '', '', ''],
        setupCardId: '',
        setupCardName: '',
        secondarySetupId: undefined,
        selectedStoryCardIndex: null,
        selectedGoal: undefined,
        challengeOptions: {},
        timerConfig: {
            mode: 'standard',
            unpredictableSelectedIndices: [0, 2, 4, 5],
        },
        soloOptions: {
            noSureThings: false,
            shesTrouble: false,
            recipeForUnpleasantness: false,
        },
        optionalRules: {
            disgruntledDie: 'standard',
            optionalShipUpgrades: true,
            resolveConflictsManually: false,
            highVolumeSupply: true,
        },
        expansions: getPersistedExpansions(),
        isCampaign: false,
        campaignStoriesCompleted: 0,
        finalStartingCredits: null,
        storyRatingFilters: {
            0: false,
            1: false,
            2: false,
            3: true,
            4: true,
            5: true,
        },
        overriddenStepIds: [],
        acknowledgedOverrides: [],
        visitedStepOverrides: [],
        draft: {
            state: null,
            isManual: false,
        },
        showHiddenContent: false,
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
    const newMode: GameMode = safeCount === 1 ? 'solo' : 'multiplayer';
    
    const intermediateState = {
        ...state,
        playerCount: safeCount,
        gameMode: newMode,
        playerNames: adjustPlayerNames(state.playerNames, safeCount),
        isCampaign: newMode === 'multiplayer' ? false : state.isCampaign,
        draft: { state: null, isManual: false },
    };

    // Automatically switch to Flying Solo if conditions are met.
    return defaultToFlyingSoloIfNeeded(intermediateState);
};

const handleExpansionToggle = (state: GameState, expansionId: keyof GameState['expansions']): GameState => {
    const nextExpansions = { ...state.expansions, [expansionId]: !state.expansions[expansionId] };

    try {
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem(EXPANSION_SETTINGS_STORAGE_KEY, JSON.stringify(nextExpansions));
        }
    } catch (e) {
        console.error("Could not save expansion settings.", e);
    }
    
    let newState: GameState = { ...state, expansions: nextExpansions };
    
    if (expansionId === 'tenth') {
        newState.gameEdition = nextExpansions.tenth ? 'tenth' : 'original';
        // Automatically switch to Flying Solo if conditions are met.
        if (nextExpansions.tenth) {
            newState = defaultToFlyingSoloIfNeeded(newState);
        }
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
            secondarySetupId: undefined,
            draft: { state: null, isManual: false },
        };
    } else {
        return {
            ...state,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: state.setupCardId,
            draft: { state: null, isManual: false },
        };
    }
};

const handleSetExpansionsBundle = (state: GameState, bundle: ExpansionBundle): GameState => {
    const newExpansions = { ...state.expansions };
    const allOfficial = EXPANSIONS_METADATA
        .filter(e => e.category !== 'independent' && e.id !== 'base')
        .map(e => e.id as keyof Expansions);
        
    // Turn off all official expansions first
    allOfficial.forEach(id => {
        newExpansions[id] = false;
    });
    
    if (bundle === 'rim_worlds') {
        newExpansions.blue = true;
        newExpansions.kalidasa = true;
    } else if (bundle === 'all_official') {
        allOfficial.forEach(id => {
            newExpansions[id] = true;
        });
    }
    // 'core_only' is handled by the initial reset.

    return { ...state, expansions: newExpansions };
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
        nextState = { ...state, setupCardId: id, setupCardName: name, secondarySetupId: undefined, draft: { state: null, isManual: false } };
      }
      break;
    }

    case ActionType.TOGGLE_FLYING_SOLO:
      nextState = handleToggleFlyingSolo(state);
      break;

    case ActionType.SET_STORY_CARD: {
      const { index, goal } = action.payload;
      const card = index !== null ? STORY_CARDS[index] : undefined;
      
      const newChallengeOptions: Record<string, boolean> = {};

      // If Smuggler's Blues is selected, check if we should default the variant.
      if (card?.title === "Smuggler's Blues") {
        const canUseRimRule = state.expansions.blue && state.expansions.kalidasa;
        if (canUseRimRule) {
          newChallengeOptions.smugglers_blues_rim_variant = true;
        }
      }

      nextState = { 
        ...state, 
        selectedStoryCardIndex: index, 
        selectedGoal: goal, 
        challengeOptions: newChallengeOptions, 
        overriddenStepIds: [], 
        acknowledgedOverrides: [], 
        visitedStepOverrides: [] 
      };
      break;
    }
      
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

    case ActionType.TOGGLE_UNPREDICTABLE_TOKEN: {
      const newIndices = state.timerConfig.unpredictableSelectedIndices.includes(action.payload)
          ? state.timerConfig.unpredictableSelectedIndices.filter(i => i !== action.payload)
          : [...state.timerConfig.unpredictableSelectedIndices, action.payload];
      nextState = { ...state, timerConfig: { ...state.timerConfig, unpredictableSelectedIndices: newIndices } };
      break;
    }

    case ActionType.RESET_GAME:
      nextState = getDefaultGameState();
      break;

    case ActionType.TOGGLE_STORY_RATING_FILTER:
      nextState = {
        ...state,
        storyRatingFilters: {
          ...state.storyRatingFilters,
          [action.payload]: !state.storyRatingFilters[action.payload],
        },
      };
      break;

    case ActionType.SET_STORY_OVERRIDES:
      nextState = { ...state, overriddenStepIds: action.payload };
      break;

    case ActionType.ACKNOWLEDGE_OVERRIDES:
      nextState = { ...state, acknowledgedOverrides: action.payload };
      break;
      
    case ActionType.VISIT_OVERRIDDEN_STEP:
      if (state.visitedStepOverrides.includes(action.payload)) {
        return state;
      }
      nextState = {
        ...state,
        visitedStepOverrides: [...state.visitedStepOverrides, action.payload],
      };
      break;
    case ActionType.SET_DRAFT_CONFIG:
      nextState = { ...state, draft: action.payload };
      break;
      
    case ActionType.TOGGLE_SHOW_HIDDEN_CONTENT: {
      const showHidden = !state.showHiddenContent;
      let nextExpansions = state.expansions;
      if (!showHidden) {
        // If we're hiding them, turn them all off.
        nextExpansions = { ...state.expansions };
        EXPANSIONS_METADATA.forEach(exp => {
          if (exp.hidden) {
            nextExpansions[exp.id as keyof Expansions] = false;
          }
        });
      }
      nextState = { ...state, showHiddenContent: showHidden, expansions: nextExpansions };
      break;
    }

    case ActionType.SET_SETUP_MODE: {
      const newMode = action.payload;
      try {
        if (typeof window !== 'undefined' && window.localStorage) {
          localStorage.setItem(SETUP_MODE_STORAGE_KEY, newMode);
        }
      } catch (e) {
        console.error("Could not save setup mode preference.", e);
      }
      nextState = { ...state, setupMode: newMode };
      break;
    }
      
    case ActionType.SET_EXPANSIONS_BUNDLE:
      nextState = handleSetExpansionsBundle(state, action.payload);
      break;

    default:
      nextState = state;
  }
  
  // After every action, run the validation logic to ensure a consistent state.
  return validateState(nextState);
}