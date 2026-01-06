// FIX: Changed import from '../types' to '../../types/index' to fix module resolution ambiguity.
import { GameState, SetupCardDef, StoryCardDef, AdvancedRuleDef, ChallengeOption, CampaignSetupNote, SetupMode } from '../../types/index';
import { SETUP_CARDS } from '../../data/setupCards';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { SETUP_CARD_IDS } from '../../data/ids';
import { STORY_CARDS } from '../../data/storyCards';
import { isStoryCompatible } from '../filters';
import { CAMPAIGN_SETUP_NOTES } from '../../data/collections';

// =================================================================
// Card Definition Fetchers
// =================================================================

export const getActiveStoryCard = (gameState: GameState): StoryCardDef | undefined => {
    if (gameState.selectedStoryCardIndex === null) {
        return undefined;
    }
    return STORY_CARDS[gameState.selectedStoryCardIndex];
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
    filters: { searchTerm: string; filterExpansion: string[]; filterGameType: 'all' | 'solo' | 'co-op' | 'pvp'; sortMode: 'expansion' | 'name' | 'rating' }
): StoryCardDef[] => {
    const validStories = getAvailableStoryCards(gameState);
    const { searchTerm, filterExpansion, filterGameType, sortMode } = filters;
    
    const stories = validStories.filter(card => {
        const matchesSearch = searchTerm === '' || 
           card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           card.intro.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesExpansion = filterExpansion.length === 0 ||
            (filterExpansion.includes('base') && !card.requiredExpansion) ||
            (card.requiredExpansion && filterExpansion.includes(card.requiredExpansion));

        const matchesGameType =
            filterGameType === 'all' ||
            (filterGameType === 'solo' && card.isSolo) ||
            (filterGameType === 'co-op' && card.isCoOp) ||
            (filterGameType === 'pvp' && card.isPvP);

        return matchesSearch && matchesExpansion && matchesGameType;
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

export const getActiveStoryChallenges = (gameState: GameState): ChallengeOption[] => {
    const activeStoryCard = getActiveStoryCard(gameState);
    if (!activeStoryCard || !activeStoryCard.challengeOptions) {
        return [];
    }
    return activeStoryCard.challengeOptions.filter(
        (option: ChallengeOption) => gameState.challengeOptions[option.id]
    );
};

export const getActiveExpansions = (gameState: GameState): string[] => {
    return EXPANSIONS_METADATA
        .filter(e => gameState.expansions[e.id as keyof typeof gameState.expansions] && e.id !== 'base')
        .map(e => e.label);
};