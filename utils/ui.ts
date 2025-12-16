
import { GameState, StoryCardDef } from '../types';
import { SETUP_CARDS, SETUP_CARD_IDS } from '../constants';

export const getStoryCardSetupSummary = (card: StoryCardDef): string | null => {
    if (card.setupDescription) return "Setup Changes";
    if (card.setupConfig?.jobDrawMode === 'no_jobs') return "No Starting Jobs";
    if (card.setupConfig?.jobDrawMode === 'caper_start') return "Starts with Caper";
    if (card.setupConfig?.shipPlacementMode === 'persephone') return "Starts at Persephone";
    return null;
};

export const getDisplaySetupName = (state: GameState): string => {
    if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO && state.secondarySetupId) {
        const secondary = SETUP_CARDS.find(s => s.id === state.secondarySetupId);
        if (secondary) return `Flying Solo + ${secondary.label}`;
    }
    return state.setupCardName;
};

export const getTimerSummaryText = (state: GameState, activeStory?: StoryCardDef): string | null => {
    const isSoloTimerActive = state.gameMode === 'solo' &&
                              !activeStory?.setupConfig?.disableSoloTimer &&
                              (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO || activeStory?.setupConfig?.soloGameTimer);

    if (!isSoloTimerActive) {
        return state.gameMode === 'solo' && activeStory?.setupConfig?.disableSoloTimer
            ? "Disabled (Story Override)"
            : null;
    }

    if (state.timerConfig.mode === 'standard') {
        return "Standard (20 Turns)";
    }

    const extraTokens = state.timerConfig.unpredictableSelectedIndices.length > 4;
    const randomized = state.timerConfig.randomizeUnpredictable;
    let summary = 'Unpredictable';
    if (extraTokens) summary += ' (Extra Tokens)';
    if (randomized) summary += ' (Randomized)';
    return summary;
};

export const getActiveOptionalRulesText = (state: GameState): string[] => {
    const rules: string[] = [];
    if (state.soloOptions?.noSureThings) rules.push("No Sure Things");
    if (state.soloOptions?.shesTrouble) rules.push("She's Trouble");
    if (state.soloOptions?.recipeForUnpleasantness) rules.push("Recipe For Unpleasantness");
    if (state.optionalRules?.optionalShipUpgrades) rules.push("Ship Upgrades");
    return rules;
};
