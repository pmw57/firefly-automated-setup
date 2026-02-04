
import { GameState, Expansions, SetupMode } from '../types/index';
import { Action, ActionType } from './actions';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { EXPANSION_SETTINGS_STORAGE_KEY, SETUP_MODE_STORAGE_KEY } from '../data/constants';

import { validateState } from './validation';
import { configReducer } from './reducers/configReducer';
import { setupReducer } from './reducers/setupReducer';
import { sessionReducer } from './reducers/sessionReducer';
import { uiReducer } from './reducers/uiReducer';

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
            noSureThings: undefined,
            shesTrouble: undefined,
            recipeForUnpleasantness: undefined,
        },
        optionalRules: {
            disgruntledDie: undefined,
            optionalShipUpgrades: undefined,
            resolveConflictsManually: undefined,
            highVolumeSupply: undefined,
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
        missionDossierSubStep: 1,
        riversRun_setupConfirmed: false,
    };
};

export function gameReducer(state: GameState, action: Action): GameState {
  let nextState: GameState = state;

  switch (action.type) {
    case ActionType.RESET_GAME:
      nextState = getDefaultGameState();
      break;

    case ActionType.IMPORT_GAME_STATE:
      // Merge imported state with default/current structure to ensure all keys exist
      nextState = {
          ...getDefaultGameState(),
          ...action.payload,
          // Ensure nested objects are merged correctly if partial
          expansions: { ...getDefaultGameState().expansions, ...(action.payload.expansions || {}) },
          // Reset ephemeral UI state
          draft: { state: null, isManual: false },
          missionDossierSubStep: 1
      };
      break;

    // Domain Specific Reducers
    case ActionType.SET_PLAYER_COUNT:
    case ActionType.SET_PLAYER_NAME:
    case ActionType.TOGGLE_EXPANSION:
    case ActionType.SET_EXPANSIONS_BUNDLE:
    case ActionType.SET_SETUP_MODE:
    case ActionType.TOGGLE_SHOW_HIDDEN_CONTENT:
        nextState = configReducer(state, action);
        break;

    case ActionType.SET_SETUP_CARD:
    case ActionType.TOGGLE_FLYING_SOLO:
    case ActionType.SET_CAMPAIGN_MODE:
    case ActionType.SET_CAMPAIGN_STORIES:
    case ActionType.SET_STORY_CARD:
    case ActionType.SET_GOAL:
    case ActionType.RESET_CHALLENGES:
    case ActionType.TOGGLE_CHALLENGE_OPTION:
        nextState = setupReducer(state, action);
        break;

    case ActionType.SET_DISGRUNTLED_DIE:
    case ActionType.TOGGLE_SHIP_UPGRADES:
    case ActionType.TOGGLE_CONFLICT_RESOLUTION:
    case ActionType.TOGGLE_HIGH_VOLUME_SUPPLY:
    case ActionType.SET_FINAL_STARTING_CREDITS:
    case ActionType.TOGGLE_SOLO_OPTION:
    case ActionType.TOGGLE_TIMER_MODE:
    case ActionType.TOGGLE_UNPREDICTABLE_TOKEN:
    case ActionType.SET_DRAFT_CONFIG:
    case ActionType.INITIALIZE_OPTIONAL_RULES:
        nextState = sessionReducer(state, action);
        break;

    case ActionType.TOGGLE_STORY_RATING_FILTER:
    case ActionType.SET_STORY_OVERRIDES:
    case ActionType.ACKNOWLEDGE_OVERRIDES:
    case ActionType.VISIT_OVERRIDDEN_STEP:
    case ActionType.SET_MISSION_DOSSIER_SUBSTEP:
    case ActionType.RIVERS_RUN_CONFIRM_SETUP:
        nextState = uiReducer(state, action);
        break;

    default:
        nextState = state;
  }
  
  // After every action, run the validation logic to ensure a consistent state.
  return validateState(nextState);
}
