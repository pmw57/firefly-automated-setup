
import { StoryCardDef, GameState } from '../types';
import { SETUP_CARD_IDS, STORY_TITLES } from '../data/ids';
import { SOLO_EXCLUDED_STORIES } from '../data/collections';

const SOLO_EXCLUDED_STORIES_SET = new Set(SOLO_EXCLUDED_STORIES);

/**
 * Checks if a story card is valid based on the current game state.
 * This function encapsulates all filtering logic for story card availability.
 */
export const isStoryCompatible = (card: StoryCardDef, state: GameState): boolean => {
    const isClassicSolo = state.gameMode === 'solo' && state.setupCardId !== SETUP_CARD_IDS.FLYING_SOLO;

    if (isClassicSolo) {
        return card.title === STORY_TITLES.AWFUL_LONELY;
    }

    if (state.gameMode === 'multiplayer' && card.isSolo) {
        return false;
    }

    if (state.gameMode === 'solo' && SOLO_EXCLUDED_STORIES_SET.has(card.title)) {
        return false;
    }
    
    if (card.title === STORY_TITLES.SLAYING_THE_DRAGON && state.playerCount !== 2) {
        return false;
    }

    const mainReq = !card.requiredExpansion || state.expansions[card.requiredExpansion];
    const addReq = !card.additionalRequirements || card.additionalRequirements.every(req => state.expansions[req]);
    
    return mainReq && addReq;
};
