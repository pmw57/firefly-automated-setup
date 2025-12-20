import { GameState, SetupRule } from '../../types';
import { getSetupCardById } from './story';
import { getActiveStoryCard } from './story';
import { SETUP_CARD_IDS } from '../../data/ids';

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
    const { setupCardId, secondarySetupId, selectedStoryCard } = gameState;

    // Determine the primary setup card to use for rules.
    // If Flying Solo is active, the secondary card's rules are the base.
    const primarySetupId = setupCardId === SETUP_CARD_IDS.FLYING_SOLO ? secondarySetupId : setupCardId;
    
    if (primarySetupId) {
        const setupCard = getSetupCardById(primarySetupId);
        if (setupCard?.rules) {
            rules.push(...setupCard.rules);
        }
    }
    
    // If Flying Solo is active, its own rules are layered on top.
    if (setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        const flyingSoloCard = getSetupCardById(SETUP_CARD_IDS.FLYING_SOLO);
        if (flyingSoloCard?.rules) {
            rules.push(...flyingSoloCard.rules);
        }
    }

    // Get rules from the selected story card.
    if (selectedStoryCard) {
        const storyCard = getActiveStoryCard(gameState);
        if (storyCard?.rules) {
            rules.push(...storyCard.rules);
        }
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