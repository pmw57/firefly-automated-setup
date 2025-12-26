// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { GameState, StoryCardDef, SetupCardDef, SetJobModeRule, SetShipPlacementRule } from '../types/index';
import { SETUP_CARD_IDS } from '../data/ids';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';

export const getStoryCardSetupSummary = (card: StoryCardDef): string | null => {
    const rules = card.rules || [];
    if (card.setupDescription) return "Setup Changes";

    const jobModeRule = rules.find(r => r.type === 'setJobMode') as SetJobModeRule | undefined;
    if (jobModeRule?.mode === 'no_jobs') return "No Starting Jobs";
    if (jobModeRule?.mode === 'caper_start') return "Starts with Caper";

    const placementRule = rules.find(r => r.type === 'setShipPlacement') as SetShipPlacementRule | undefined;
    if (placementRule?.location === 'persephone') return "Starts at Persephone";
    
    return null;
};

export const getDisplaySetupName = (state: GameState, secondarySetupCard?: SetupCardDef): string => {
    if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO && secondarySetupCard) {
        return `${state.setupCardName} + ${secondarySetupCard.label}`;
    }
    return state.setupCardName || 'Configuring...';
};

export const getTimerSummaryText = (state: GameState): string | null => {
    if (state.gameMode === 'multiplayer') return null;
    
    const allRules = getResolvedRules(state);
    if (hasRuleFlag(allRules, 'disableSoloTimer')) {
        return "Disabled (Story Override)";
    }
    
    // Timer is only relevant for Flying Solo mode
    if (state.setupCardId !== SETUP_CARD_IDS.FLYING_SOLO) return "Classic (No Timer)";

    const { mode, unpredictableSelectedIndices, randomizeUnpredictable } = state.timerConfig;
    const tokensToRemove = state.isCampaign ? state.campaignStoriesCompleted * 2 : 0;
    const totalTokens = Math.max(0, 20 - tokensToRemove);

    if (mode === 'standard') {
        return `Standard (${totalTokens} Turns)`;
    }

    // Unpredictable Mode
    const availableTokens = [1, 1, 2, 2, 3, 4];
    const selectedTokens = unpredictableSelectedIndices.map(i => availableTokens[i]);
    const numNumbered = selectedTokens.length;
    const hasExtra = numNumbered > 4;

    let summary = "Unpredictable";
    if (hasExtra) summary += " (Extra Tokens)";
    if (randomizeUnpredictable) summary += " (Randomized)";
    
    return summary;
};

export const getActiveOptionalRulesText = (state: GameState): string[] => {
    const activeRules: string[] = [];
    if (state.soloOptions.noSureThings) activeRules.push("No Sure Things");
    if (state.soloOptions.shesTrouble) activeRules.push("She's Trouble");
    if (state.soloOptions.recipeForUnpleasantness) activeRules.push("Recipe For Unpleasantness");
    if (state.optionalRules.optionalShipUpgrades) activeRules.push("Ship Upgrades");

    return activeRules;
};