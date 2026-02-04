
import { GameState } from '../types/index';
import { SETUP_CARDS } from '../data/setupCards';
import { STORY_CARDS } from '../data/storyCards';
import { SETUP_CARD_IDS } from '../data/ids';

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
export const validateState = (state: GameState): GameState => {
    let validatedState = state;
    validatedState = validateSetupCard(validatedState);
    validatedState = validateStoryCard(validatedState);
    validatedState = validateGameMode(validatedState);
    validatedState = validateOptionalRules(validatedState);
    return validatedState;
};

/**
 * A helper function to default to "Flying Solo" mode if the conditions are met.
 * This should be called when entering solo mode or when enabling the 10th Anniversary expansion.
 */
export const defaultToFlyingSoloIfNeeded = (state: GameState): GameState => {
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
