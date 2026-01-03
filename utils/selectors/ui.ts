import { GameState, StoryCardDef, SetupCardDef, SetJobModeRule, SetShipPlacementRule, Step } from '../../types/index';
import { STEP_IDS } from '../../data/ids';
import { getResolvedRules, hasRuleFlag } from './rules';
import { getSetupCardById } from './story';

/**
 * Determines if the "Flying Solo" setup card is a valid option.
 * This requires solo mode and the 10th Anniversary expansion.
 */
export const isFlyingSoloEligible = (gameState: GameState): boolean => {
  return gameState.gameMode === 'solo' && gameState.expansions.tenth;
};

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
    const cardDef = getSetupCardById(state.setupCardId);
    const isCombinable = !!cardDef?.isCombinable;

    if (isCombinable && secondarySetupCard) {
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
    
    const cardDef = getSetupCardById(state.setupCardId);
    const isFlyingSolo = !!cardDef?.isCombinable;
    
    // Timer is only relevant for Flying Solo mode
    if (!isFlyingSolo) return "Classic (No Timer)";

    // FIX: Reverted to 'Campaign' state properties.
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

/**
 * Provides derived UI state for the SetupCardSelection component.
 */
export const getSetupCardSelectionInfo = (gameState: GameState) => {
    const { setupCardId, gameMode, expansions, secondarySetupId } = gameState;

    const cardDef = getSetupCardById(setupCardId);
    const isFlyingSoloActive = !!cardDef?.isCombinable;

    const has10th = expansions.tenth;
    const isSolo = gameMode === 'solo';

    const isFlyingSoloEligible = isSolo && has10th;
    
    // The setup process has 3 parts: Captain/Expansions, Setup Card, and Optional Rules.
    const totalParts = 3;

    const isNextDisabled = isFlyingSoloActive ? !secondarySetupId : !setupCardId;

    return {
        isFlyingSoloActive,
        isFlyingSoloEligible,
        totalParts,
        isNextDisabled
    };
};

/**
 * Determines if the setup flow is "determined" based on progress,
 * which affects how the progress bar displays future steps.
 */
export const isSetupDetermined = (flow: Step[], currentIndex: number): boolean => {
    const setupCardSelectionStepIndex = flow.findIndex(step => step.id === STEP_IDS.SETUP_CARD_SELECTION);
    return setupCardSelectionStepIndex !== -1 && currentIndex > setupCardSelectionStepIndex;
};
