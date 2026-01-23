
import { GameState, SetupRule, RuleSourceType } from '../../types/index';
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

    // Helper to check if a rule's criteria are met by the current game state
    const isRuleActive = (rule: SetupRule): boolean => {
        if (!rule.criteria) return true;
        const { requireExpansion, excludeExpansion } = rule.criteria;
        
        if (requireExpansion && !gameState.expansions[requireExpansion]) return false;
        if (excludeExpansion && gameState.expansions[excludeExpansion]) return false;
        
        return true;
    };

    // Rules from Setup Cards
    const primaryCard = getSetupCardById(gameState.setupCardId);
    const isCombinable = !!primaryCard?.isCombinable;

    // When a combinable card is active (e.g., Flying Solo), it acts as a modifier.
    // The secondary card defines the main board state and should have higher priority.
    if (isCombinable && gameState.secondarySetupId) {
        const secondaryCard = getSetupCardById(gameState.secondarySetupId);
        if (secondaryCard?.rules) {
            // These rules retain the standard 'setupCard' source for high priority.
            rules.push(...secondaryCard.rules.filter(isRuleActive));
        }
    }
    
    if (primaryCard?.rules) {
        if (isCombinable) {
            // The combinable card's rules are assigned a lower-priority source.
            const combinableRules = primaryCard.rules
                .filter(isRuleActive)
                .map((rule: SetupRule) => ({ ...rule, source: 'combinableSetupCard' as RuleSourceType }));
            rules.push(...combinableRules);
        } else {
            // If not a combinable setup, it's a standard setup card.
            rules.push(...primaryCard.rules.filter(isRuleActive));
        }
    }
    
    // Rules from Story Card (Highest Priority)
    const storyCard = getActiveStoryCard(gameState);
    if (storyCard?.rules) {
        rules.push(...storyCard.rules.filter(isRuleActive));
    }

    // Rules from Active Expansions
    // Expansion rules generally imply the expansion is active, but we filter just in case
    // they have complex internal criteria (though unusual).
    for (const expansion of EXPANSIONS_METADATA) {
        if (expansion.rules && gameState.expansions[expansion.id as keyof typeof gameState.expansions]) {
            rules.push(...expansion.rules.filter(isRuleActive));
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
