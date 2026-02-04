
// Explicitly import from the barrel file to avoid module resolution ambiguity.
import { GameState, SetupCardDef, StoryCardDef, AdvancedRuleDef, ChallengeOption, CampaignSetupNote, SetupMode, StoryTag } from '../../types/index';
import { SETUP_CARDS } from '../../data/setupCards';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { SETUP_CARD_IDS, STEP_IDS } from '../../data/ids';
import { STORY_CARDS } from '../../data/storyCards';
import { isStoryCompatible } from '../filters';
import { CAMPAIGN_SETUP_NOTES } from '../../data/collections';
import { SOLO_EXCLUDED_STORIES } from '../../data/collections';

// =================================================================
// Card Definition Fetchers
// =================================================================

export const getActiveStoryCard = (gameState: GameState): StoryCardDef | undefined => {
    // Return the injected story object if available.
    if (gameState.activeStory) {
        return gameState.activeStory;
    }
    // Fallback for legacy tests or intermediate states: look up by index if object is missing
    if (gameState.selectedStoryCardIndex !== null) {
        return STORY_CARDS[gameState.selectedStoryCardIndex];
    }
    return undefined;
};

export const getStoryCardByTitle = (title: string): StoryCardDef | undefined => {
    return STORY_CARDS.find(c => c.title === title);
};

export const getSetupCardById = (id: string): SetupCardDef | undefined => {
    return SETUP_CARDS.find(c => c.id === id);
};

// =================================================================
// List Generators & Filters
// =================================================================

export const getAvailableSetupCards = (gameState: GameState): SetupCardDef[] => {
    const expansionIndices = EXPANSIONS_METADATA.reduce((acc, exp, idx) => {
        (acc as Record<string, number>)[exp.id] = idx;
        return acc;
    }, {} as Record<string, number>);

    const stripThe = (str: string) => str.replace(/^The\s+/i, '');
    const isSolo = gameState.gameMode === 'solo';

    return SETUP_CARDS
        .filter(setup => {
            if (setup.requiredExpansion && !gameState.expansions[setup.requiredExpansion]) return false;
            if (setup.id === SETUP_CARD_IDS.FLYING_SOLO) return false;
            if (!isSolo && setup.mode === 'solo') return false;
            return true;
        })
        .sort((a, b) => {
            const idxA = a.requiredExpansion ? (expansionIndices[a.requiredExpansion] ?? 999) : -1;
            const idxB = b.requiredExpansion ? (expansionIndices[b.requiredExpansion] ?? 999) : -1;
            if (idxA !== idxB) return idxA - idxB;
            return stripThe(a.label).localeCompare(stripThe(b.label));
        });
};

export const getAvailableStoryCards = (gameState: GameState): StoryCardDef[] => {
    const stateWithQuickModeFilters: GameState = {
        ...gameState,
        expansions: {
            ...gameState.expansions,
            // In quick mode, always treat community expansions as disabled for filtering purposes
            community: gameState.setupMode === 'quick' ? false : gameState.expansions.community,
        }
    };
    return STORY_CARDS.filter(card => isStoryCompatible(card, stateWithQuickModeFilters));
};

export const getFilteredStoryCards = (
    gameState: GameState, 
    filters: { searchTerm: string; filterExpansion: string[]; filterTheme: StoryTag | 'all'; sortMode: 'expansion' | 'name' | 'rating' }
): StoryCardDef[] => {
    const validStories = getAvailableStoryCards(gameState);
    const { searchTerm, filterExpansion, filterTheme, sortMode } = filters;
    
    const stories = validStories.filter(card => {
        const matchesSearch = searchTerm === '' || 
           card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           card.intro.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesExpansion = filterExpansion.length === 0 ||
            (filterExpansion.includes('base') && !card.requiredExpansion) ||
            (card.requiredExpansion && filterExpansion.includes(card.requiredExpansion));

        const matchesTheme = filterTheme === 'all' || (card.tags && card.tags.includes(filterTheme));

        return matchesSearch && matchesExpansion && matchesTheme;
    });
    
    const getSortableTitle = (str: string) => str.replace(/^[^a-zA-Z0-9]+/, '').replace(/^The\s+/i, '');
    
    if (sortMode === 'name') {
        stories.sort((a, b) => getSortableTitle(a.title).localeCompare(getSortableTitle(b.title)));
    } else if (sortMode === 'rating') {
        stories.sort((a, b) => {
            const ratingA = a.rating ?? -1;
            const ratingB = b.rating ?? -1;
            return ratingB - ratingA;
        });
    }
    
    return stories;
};

// =================================================================
// Rule & Expansion Selectors
// =================================================================

export interface IncompatibilityReason {
  text: string;
  stepId?: string;
}

const getExpansionLabel = (id: string): string => {
    return EXPANSIONS_METADATA.find(e => e.id === id)?.label || id;
};

export const getStoryIncompatibilityReason = (card: StoryCardDef, state: GameState): IncompatibilityReason | null => {
    const reasons: string[] = [];
    let primaryStepId: string | undefined = undefined;

    // Check 1: Quick Mode hiding community content
    if (state.setupMode === 'quick' && card.requiredExpansion === 'community') {
        reasons.push("Community content is hidden in 'Quick' setup mode. (Use toggle in header)");
    }

    // Check 2: Game Mode (Solo vs Multiplayer)
    if (state.gameMode === 'multiplayer' && card.isSolo) {
        reasons.push("Requires Solo mode.");
        if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CAPTAIN_EXPANSIONS;
    }

    // Check 3: Required Expansion
    if (card.requiredExpansion && !state.expansions[card.requiredExpansion]) {
        const expansionMeta = EXPANSIONS_METADATA.find(e => e.id === card.requiredExpansion);
        if (expansionMeta?.hidden && !state.showHiddenContent) {
            reasons.push(`Requires a currently unavailable expansion: '${expansionMeta.label}'.`);
        } else {
            reasons.push(`Requires the '${getExpansionLabel(card.requiredExpansion)}' expansion.`);
        }
        if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CAPTAIN_EXPANSIONS;
    }

    // Check 4: Additional Requirements
    if (card.additionalRequirements) {
        const missingReqs = card.additionalRequirements.filter(req => !state.expansions[req]);
        if (missingReqs.length > 0) {
            const unachievableReqs = missingReqs.filter(req => {
                const expansionMeta = EXPANSIONS_METADATA.find(e => e.id === req);
                return expansionMeta?.hidden && !state.showHiddenContent;
            });

            if (unachievableReqs.length > 0) {
                const unachievableLabels = unachievableReqs.map(getExpansionLabel);
                reasons.push(`Requires currently unavailable expansion(s): '${unachievableLabels.join(', ')}'.`);
            } else {
                reasons.push(`Requires expansion(s): ${missingReqs.map(getExpansionLabel).join(', ')}.`);
            }
            if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CAPTAIN_EXPANSIONS;
        }
    }

    // Check 5: Player Count
    if (card.playerCount) {
        const isCompatible = Array.isArray(card.playerCount) 
            ? card.playerCount.includes(state.playerCount)
            : card.playerCount === state.playerCount;
            
        if (!isCompatible) {
            const reqText = Array.isArray(card.playerCount) 
                ? card.playerCount.join(', ') 
                : card.playerCount;
            reasons.push(`Requires specific player counts: ${reqText}.`);
            if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CAPTAIN_EXPANSIONS;
        }
    }

    if (card.maxPlayerCount && state.playerCount > card.maxPlayerCount) {
        reasons.push(`Requires ${card.maxPlayerCount} or fewer players.`);
        if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CAPTAIN_EXPANSIONS;
    }

    // Check 6: Solo Variants (Classic vs Flying Solo)
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    const isClassicSolo = state.gameMode === 'solo' && !isFlyingSolo;

    if (isClassicSolo && !card.isSolo) {
        reasons.push("Not available in 'Classic Solo' mode.");
        if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CARD_SELECTION;
    }
    
    if (isFlyingSolo) {
        if (SOLO_EXCLUDED_STORIES.includes(card.title)) {
            reasons.push("Not available in 'Flying Solo' mode.");
            if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CARD_SELECTION;
        }
    }

    // Check 7: Solitaire Firefly Setup
    const isSolitaireActive = state.setupCardId === SETUP_CARD_IDS.SOLITAIRE_FIREFLY || state.secondarySetupId === SETUP_CARD_IDS.SOLITAIRE_FIREFLY;

    if (isSolitaireActive) {
      if (card.requiredFlag !== 'isSolitaireFirefly') {
        reasons.push("Only available with the 'Solitaire Firefly' setup card.");
        if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CARD_SELECTION;
      }
    } else {
      if (card.requiredFlag === 'isSolitaireFirefly') {
        reasons.push("Requires the 'Solitaire Firefly' setup card.");
        if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CARD_SELECTION;
      }
    }
    
    // Check 8: Required Setup Card
    if (card.requiredSetupCardId) {
        const effectiveSetupCardId = isFlyingSolo ? state.secondarySetupId : state.setupCardId;
        if (card.requiredSetupCardId !== effectiveSetupCardId) {
            const requiredSetup = getSetupCardById(card.requiredSetupCardId);
            reasons.push(`Requires the '${requiredSetup?.label || card.requiredSetupCardId}' setup card.`);
            if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CARD_SELECTION;
        }
    }

    // Check 9: Incompatible Setup Card
    if (card.incompatibleSetupCardIds) {
        const effectiveSetupCardId = isFlyingSolo ? state.secondarySetupId : state.setupCardId;
        if (effectiveSetupCardId && card.incompatibleSetupCardIds.includes(effectiveSetupCardId)) {
            const incompatibleSetup = getSetupCardById(effectiveSetupCardId);
            reasons.push(`Not compatible with the '${incompatibleSetup?.label || effectiveSetupCardId}' setup card.`);
            if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_CARD_SELECTION;
        }
    }

    // Check 10: Community Rating
    if (card.requiredExpansion === 'community' && typeof card.rating === 'number') {
        if (state.storyRatingFilters && !state.storyRatingFilters[card.rating]) {
            reasons.push(`Currently filtered out by rating (${card.rating} stars).`);
            if (!primaryStepId) primaryStepId = STEP_IDS.SETUP_OPTIONAL_RULES;
        }
    }
    
    if (reasons.length > 0) {
        return {
            text: reasons.join('\n'), // Join with newline for UI splitting
            stepId: primaryStepId
        };
    }

    return null;
};

export const getSoloTimerAdjustmentText = (storyCard: StoryCardDef | undefined): string | null => {
    return storyCard?.soloTimerAdjustment || null;
}

export const getCampaignNotesForStep = (gameState: GameState, stepId: string): CampaignSetupNote[] => {
    const activeStoryCard = getActiveStoryCard(gameState);
    if (!activeStoryCard?.campaignSetupNotes) {
        return [];
    }
    
    return activeStoryCard.campaignSetupNotes
        .map((noteId: string) => CAMPAIGN_SETUP_NOTES[noteId])
        .filter((note: CampaignSetupNote | undefined): note is CampaignSetupNote => !!note && note.stepId === stepId);
};

export const getCategorizedExpansions = (showHidden = false, setupMode: SetupMode = 'quick') => {
  const group = (category: string) => EXPANSIONS_METADATA.filter(e => {
    if (e.id === 'base') return false;
    if (e.category !== category) return false;
    if (e.hidden && !showHidden) return false;
    // In quick mode, hide all independent content.
    // In detailed mode, show independent content that is not explicitly hidden.
    if (setupMode === 'quick' && e.category === 'independent') return false;
    return true;
  });
  return {
    core_mechanics: group('core_mechanics'),
    map: group('map'),
    variants: group('variants'),
    independent: group('independent'),
  };
};

export const getFilterableExpansions = (showHidden = false) => {
    return EXPANSIONS_METADATA.filter(e => {
        if (e.id === 'base') return false;
        if (e.hidden && !showHidden) return false;
        return true;
    });
};

export const getAllPotentialAdvancedRules = (gameState: GameState): AdvancedRuleDef[] => {
    const rules: AdvancedRuleDef[] = [];
    if (gameState.expansions.tenth) {
      STORY_CARDS.forEach(card => {
        if (card.advancedRule) {
          const hasReq = !card.requiredExpansion || gameState.expansions[card.requiredExpansion];
          if (hasReq) rules.push(card.advancedRule);
        }
      });
      rules.sort((a, b) => a.title.localeCompare(b.title));
    }
    return rules;
};

export const getActiveAdvancedRules = (gameState: GameState): AdvancedRuleDef[] => {
    return STORY_CARDS
        .filter(c => c.advancedRule && gameState.challengeOptions[c.advancedRule.id])
        .map(c => c.advancedRule!);
};

/**
 * Gets a list of active story challenges based on the selected story card and game state.
 * @param gameState The current game state.
 * @returns An array of active ChallengeOption objects.
 */
export const getActiveStoryChallenges = (gameState: GameState): ChallengeOption[] => {
    const storyCard = getActiveStoryCard(gameState);
    if (!storyCard?.challengeOptions) {
        return [];
    }
    return storyCard.challengeOptions.filter(
        option => gameState.challengeOptions[option.id]
    );
};

export const getActiveExpansions = (gameState: GameState): string[] => {
    return EXPANSIONS_METADATA
        .filter(e => gameState.expansions[e.id as keyof typeof gameState.expansions] && e.id !== 'base')
        .map(e => e.label);
};
