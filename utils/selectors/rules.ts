// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { GameState, SetupRule } from '../../types/index';
import { getSetupCardById } from './story';
import { getActiveStoryCard } from './story';

/**
 * The core of the "rules engine". This function gathers all active `SetupRule` arrays
 * from the currently selected setup card(s) and story card, and flattens them into
 * a single, comprehensive list of rules to be applied for the current game state.
 *
 * @param gameState The current state of the game setup.
 * @returns A flattened array of all active `SetupRule` objects.
 */
export const getResolvedRules = (gameState: GameState): SetupRule[] => {
    const rules: SetupRule[] = [];
    // FIX: Refactored to use `getActiveStoryCard` correctly, as `selectedStoryCard` is not a property of `gameState`. The new logic is cleaner and correctly retrieves story rules.
    const { setupCardId, secondarySetupId } = gameState;

    const primaryCardDef = getSetupCardById(setupCardId);
    const isCombinable = !!primaryCardDef?.isCombinable;

    // Determine the primary setup card to use for rules.
    // If a combinable card is active, the secondary card's rules are the base.
    const baseSetupId = isCombinable ? secondarySetupId : setupCardId;
    
    if (baseSetupId) {
        const setupCard = getSetupCardById(baseSetupId);
        if (setupCard?.rules) {
            rules.push(...setupCard.rules);
        }
    }
    
    // If a combinable card is active, its own rules are layered on top.
    if (isCombinable) {
        if (primaryCardDef.rules) {
            rules.push(...primaryCardDef.rules);
        }
    }

    // Get rules from the selected story card.
    const storyCard = getActiveStoryCard(gameState);
    if (storyCard?.rules) {
        rules.push(...storyCard.rules);
    }
    
    return rules;
};

/**
 * A helper function to check if a specific flag exists within a resolved rules array.
 * This replaces the legacy `hasFlag` utility.
 *
 * @param rules The array of resolved `SetupRule` objects.
 * @param flag The string identifier of the flag to check for.
 * @returns `true` if a matching `AddFlagRule` is found, otherwise `false`.
 */
export const hasRuleFlag = (rules: SetupRule[], flag: string): boolean => {
    return rules.some(rule => rule.type === 'addFlag' && rule.flag === flag);
};