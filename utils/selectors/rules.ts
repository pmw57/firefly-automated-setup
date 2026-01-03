import { GameState, SetupRule } from '../../types/index';
import { getSetupCardById } from './story';
import { getActiveStoryCard } from './story';
import { EXPANSIONS_METADATA } from '../../data/expansions';

/**
 * The core of the rule resolution system. This function gathers all active `SetupRule`
 * definitions from the current game state, including from the primary and secondary
 * setup cards, the selected story card, and any active challenges or advanced rules.
 *
 * @param gameState The current game state.
 * @returns An array of all active `SetupRule` objects.
 */
export const getResolvedRules = (gameState: GameState): SetupRule[] => {
    const rules: SetupRule[] = [];

    // Rules from Setup Cards
    const primaryCard = getSetupCardById(gameState.setupCardId);
    if (primaryCard?.rules) {
        rules.push(...primaryCard.rules);
    }
    
    if (primaryCard?.isCombinable && gameState.secondarySetupId) {
        const secondaryCard = getSetupCardById(gameState.secondarySetupId);
        if (secondaryCard?.rules) {
            rules.push(...secondaryCard.rules);
        }
    }
    
    // Rules from Story Card
    const storyCard = getActiveStoryCard(gameState);
    if (storyCard?.rules) {
        rules.push(...storyCard.rules);
    }

    // Rules from Active Expansions
    for (const expansion of EXPANSIONS_METADATA) {
        if (expansion.rules && gameState.expansions[expansion.id as keyof typeof gameState.expansions]) {
            rules.push(...expansion.rules);
        }
    }
    
    // Note: This implementation assumes challenge/advanced rules are part of the story card's rules array.
    // A more complex implementation might look up challenge rules separately.
    // Based on usage, this seems sufficient.

    return rules;
};

/**
 * A utility function to check if a specific flag has been set by any active rule.
 *
 * @param rules An array of `SetupRule` objects, typically from `getResolvedRules`.
 * @param flag The string identifier of the flag to check for.
 * @returns `true` if a rule of type 'addFlag' with the matching flag exists, otherwise `false`.
 */
export const hasRuleFlag = (rules: SetupRule[], flag: string): boolean => {
    return rules.some(rule => rule.type === 'addFlag' && rule.flag === flag);
};