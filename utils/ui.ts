import { GameState, StoryCardDef, SetupCardDef, SetupRule, SetJobModeRule, SetShipPlacementRule } from '../types';
import { SETUP_CARD_IDS } from '../data/ids';
import { getResolvedRules, hasRuleFlag } from './selectors';

export const getStoryCardSetupSummary = (card: StoryCardDef): string | null => {
    const rules = card.rules || [];
    if (card.setupDescription) return "Setup Changes";

    // FIX: Cast the result of .find() to the specific rule type to allow TypeScript to correctly infer the available properties.
    const jobModeRule = rules.find(r => r.type === 'setJobMode') as SetJobModeRule | undefined;
    if (jobModeRule?.mode === 'no_jobs') return "No Starting Jobs";
    if (jobModeRule?.mode === 'caper_start') return "Starts with Caper";

    // FIX: Cast the result of .find() to the specific rule type.
    const placementRule = rules.find(r => r.type === 'setShipPlacement') as SetShipPlacementRule | undefined;
    if (placementRule?.location === 'persephone') return "Starts at Persephone";
    
    return null;
};

export const getDisplaySetupName = (state: GameState, secondarySetupCard?: SetupCardDef): string => {
    if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO && secondarySetupCard) {
        return `Flying Solo + ${secondarySetupCard.label}`;
    }
    return state.setupCardName;
};

export const getTimerSummaryText = (state: GameState): string | null => {
    const rules: SetupRule[] = getResolvedRules(state);
    
    const disableSoloTimer = hasRuleFlag(rules, 'disableSoloTimer');
    const soloGameTimer = hasRuleFlag(rules, 'soloGameTimer');

    const isSoloTimerActive = state.gameMode === 'solo' && !disableSoloTimer && soloGameTimer;

    if (!isSoloTimerActive) {
        return state.gameMode === 'solo' && disableSoloTimer
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