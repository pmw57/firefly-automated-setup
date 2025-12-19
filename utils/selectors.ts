import { GameState, SetupCardDef, StoryCardDef } from '../types';
import { SETUP_CARDS } from '../data/setupCards';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { SETUP_CARD_IDS } from '../data/ids';
import { STORY_CARDS } from '../data/storyCards';
import { isStoryCompatible } from './filters';

/**
 * A "selector" that computes the list of available setup cards based on the current game state.
 * It handles all filtering (by expansion, game mode) and sorting logic.
 * @param gameState The current application state.
 * @returns A filtered and sorted array of SetupCardDef objects.
 */
export const getAvailableSetupCards = (gameState: GameState): SetupCardDef[] => {
    const expansionIndices = EXPANSIONS_METADATA.reduce((acc, exp, idx) => {
        (acc as Record<string, number>)[exp.id] = idx;
        return acc;
    }, {} as Record<string, number>);

    const stripThe = (str: string) => str.replace(/^The\s+/i, '');
    const isSolo = gameState.gameMode === 'solo';

    return SETUP_CARDS
        .filter(setup => {
            // 1. Expansion Check
            if (setup.requiredExpansion && !gameState.expansions[setup.requiredExpansion]) return false;
            // 2. Hide "Flying Solo" from main list (handled by banner toggle)
            if (setup.id === SETUP_CARD_IDS.FLYING_SOLO) return false;
            // 3. Mode Check (Multiplayer hides solo-only cards)
            if (!isSolo && setup.mode === 'solo') return false;
            
            return true;
        })
        .sort((a, b) => {
            const idxA = a.requiredExpansion ? (expansionIndices[a.requiredExpansion] ?? 999) : -1;
            const idxB = b.requiredExpansion ? (expansionIndices[b.requiredExpansion] ?? 999) : -1;
            
            if (idxA !== idxB) {
                return idxA - idxB;
            }
            
            return stripThe(a.label).localeCompare(stripThe(b.label));
        });
};

/**
 * A "selector" that computes the list of available story cards based on the current game state.
 * It encapsulates all compatibility filtering logic.
 * @param gameState The current application state.
 * @returns A filtered array of StoryCardDef objects.
 */
export const getAvailableStoryCards = (gameState: GameState): StoryCardDef[] => {
    return STORY_CARDS.filter(card => isStoryCompatible(card, gameState));
};
