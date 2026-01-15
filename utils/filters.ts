

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
    if (card.playerCount) {
        if (Array.isArray(card.playerCount)) {
            if (!card.playerCount.includes(state.playerCount)) {
                return false;
            }
        } else if (card.playerCount !== state.playerCount) {
            return false;
        }
    }
    
    if (card.maxPlayerCount && state.playerCount > card.maxPlayerCount) {
        return false;
    }

    // Rule 4: Solo mode variants
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    const isClassicSolo = state.gameMode === 'solo' && !isFlyingSolo;
    
    // This logic differentiates between the two solo modes. In "Classic Solo" (any solo
    // game without the "Flying Solo" setup), only stories explicitly marked with
    // `isSolo: true` are allowed. This prevents standard multiplayer stories from appearing.
    // "Flying Solo" mode has its own filtering logic to allow a wider range of stories.
    if (isClassicSolo && !card.isSolo) {
        return false;
    }
    
    if (isFlyingSolo) {
        // Flying solo excludes a specific list of cards.
        if (SOLO_EXCLUDED_STORIES.includes(card.title)) {
            return false;
        }
    }

    // Rule 5: Exclusive Setup Card stories (like Solitaire Firefly)
    const isSolitaireActive = state.setupCardId === SETUP_CARD_IDS.SOLITAIRE_FIREFLY || state.secondarySetupId === SETUP_CARD_IDS.SOLITAIRE_FIREFLY;

    if (isSolitaireActive) {
      // If Solitaire Firefly is active, ONLY show cards that require its flag.
      if (card.requiredFlag !== 'isSolitaireFirefly') {
        return false;
      }
    } else {
      // If Solitaire Firefly is NOT active, HIDE cards that require its flag.
      if (card.requiredFlag === 'isSolitaireFirefly') {
        return false;
      }
    }

    // Rule 6: Required Setup Card.
    // A story card can require a specific setup card to be active.
    if (card.requiredSetupCardId) {
        const effectiveSetupCardId = isFlyingSolo ? state.secondarySetupId : state.setupCardId;
        if (card.requiredSetupCardId !== effectiveSetupCardId) {
            return false;
        }
    }

    // Rule 6.5: Incompatible Setup Card
    if (card.incompatibleSetupCardIds) {
        const effectiveSetupCardId = isFlyingSolo ? state.secondarySetupId : state.setupCardId;
        if (effectiveSetupCardId && card.incompatibleSetupCardIds.includes(effectiveSetupCardId)) {
            return false;
        }
    }

    // Rule 7: Community Content Rating Filter
    if (card.requiredExpansion === 'community' && typeof card.rating === 'number') {
        if (state.storyRatingFilters && !state.storyRatingFilters[card.rating]) {
            return false;
        }
    }

    return true;
};