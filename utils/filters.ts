
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { GameState, StoryCardDef } from '../types/index';
import { SOLO_EXCLUDED_STORIES } from '../data/collections';
import { SETUP_CARD_IDS } from '../data/ids';

export const isStoryCompatible = (card: StoryCardDef, state: GameState): boolean => {
    // Rule 1: Game Mode compatibility
    if (state.gameMode === 'multiplayer' && card.isSolo) {
        return false;
    }
    
    // Rule 2: Expansion requirements
    if (card.requiredExpansion && !state.expansions[card.requiredExpansion]) {
        return false;
    }
    if (card.additionalRequirements) {
        if (!card.additionalRequirements.every(req => state.expansions[req])) {
            return false;
        }
    }

    // Rule 3: Specific story card rules based on player count
    if (card.playerCount && card.playerCount !== state.playerCount) {
        return false;
    }
    if (card.maxPlayerCount && state.playerCount > card.maxPlayerCount) {
        return false;
    }

    // Rule 4: Solo mode variants
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    const isClassicSolo = state.gameMode === 'solo' && !isFlyingSolo;
    
    if (isClassicSolo) {
        // Classic solo only allows story cards explicitly marked for solo play.
        if (!card.isSolo) {
            return false;
        }
    }
    
    if (isFlyingSolo) {
        // Flying solo excludes a specific list of cards.
        if (SOLO_EXCLUDED_STORIES.includes(card.title)) {
            return false;
        }
    }

    return true;
};