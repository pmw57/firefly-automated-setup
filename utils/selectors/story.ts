// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { GameState, SetupCardDef, StoryCardDef, AdvancedRuleDef } from '../../types/index';
import { SETUP_CARDS } from '../../data/setupCards';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { SETUP_CARD_IDS } from '../../data/ids';
import { STORY_CARDS } from '../../data/storyCards';
import { isStoryCompatible } from '../filters';

// =================================================================
// Card Definition Fetchers
// =================================================================

export const getActiveStoryCard = (gameState: GameState): StoryCardDef | undefined => {
    if (!gameState.selectedStoryCard) return undefined;
    return STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);
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
    return STORY_CARDS.filter(card => isStoryCompatible(card, gameState));
};

export const getFilteredStoryCards = (
    gameState: GameState, 
    filters: { searchTerm: string; filterExpansion: string; sortMode: 'expansion' | 'name' }
): StoryCardDef[] => {
    const validStories = getAvailableStoryCards(gameState);
    const { searchTerm, filterExpansion, sortMode } = filters;
    
    const stories = validStories.filter(card => {
        const matchesSearch = searchTerm === '' || 
           card.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           card.intro.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesExpansion = filterExpansion === 'all' || card.requiredExpansion === filterExpansion || (!card.requiredExpansion && filterExpansion === 'base');
        return matchesSearch && matchesExpansion;
    });
    
    if (sortMode === 'name') {
      const getSortableTitle = (str: string) => str.replace(/^[^a-zA-Z0-9]+/, '').replace(/^The\s+/i, '');
      stories.sort((a, b) => getSortableTitle(a.title).localeCompare(getSortableTitle(b.title)));
    }
    
    return stories;
};

// =================================================================
// Rule & Expansion Selectors
// =================================================================

const SOLO_TIMER_ADJUSTMENTS: Record<string, string> = {
  "Desperadoes": "Declare Last Call before discarding your last token to win the game.",
  '"Respectable" Persons Of Business': "Declare Last Call before discarding your last token to win the game.",
  "A Rare Specimen Indeed": "Send Out Invites before discarding your last token to win the game."
};

export const getSoloTimerAdjustmentText = (storyCard: StoryCardDef | undefined): string | null => {
    if (!storyCard) return null;
    return SOLO_TIMER_ADJUSTMENTS[storyCard.title] || null;
}

export const getCategorizedExpansions = () => {
  const group = (category: string) => EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.category === category);
  return {
    core_mechanics: group('core_mechanics'),
    map: group('map'),
    variants: group('variants'),
    promo: group('promo'),
  };
};

export const getFilterableExpansions = (isClassicSolo: boolean) => {
    return EXPANSIONS_METADATA.filter(e => {
        if (e.id === 'base') return false;
        if (isClassicSolo && e.id === 'community') return false;
        return true;
    });
};

export const getAvailableAdvancedRules = (gameState: GameState, activeStoryCard: StoryCardDef | undefined): AdvancedRuleDef[] => {
    const rules: AdvancedRuleDef[] = [];
    if (gameState.gameMode === 'solo' && gameState.expansions.tenth && activeStoryCard) {
      STORY_CARDS.forEach(card => {
        if (card.advancedRule && card.title !== activeStoryCard.title) {
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

export const getActiveExpansions = (gameState: GameState): string[] => {
    return EXPANSIONS_METADATA
        .filter(e => gameState.expansions[e.id as keyof typeof gameState.expansions] && e.id !== 'base')
        .map(e => e.label);
};