import { GameState, SetupRule } from '../../types';
import { getSetupCardById } from './story';
import { getActiveStoryCard } from './story';
import { SETUP_CARD_IDS } from '../../data/ids';
import { mapLegacyStoryCardToRules } from './legacy';

// FIX: Add hasFlag function that was previously in a missing utils/data.ts file.
/**
 * A legacy helper to check for flags in a setupConfig object or rules array.
 * The new system prefers the `rules` array and `hasRuleFlag`.
 */
export const hasFlag = (rulesOrConfig: SetupRule[] | { flags?: string[] } | undefined, flag: string): boolean => {
    if (!rulesOrConfig) return false;
    if (Array.isArray(rulesOrConfig)) {
        return hasRuleFlag(rulesOrConfig, flag);
    }
    return !!rulesOrConfig.flags?.includes(flag);
};


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

    // Get rules from the selected story card, processing both new and legacy formats.
    if (selectedStoryCard) {
        const storyCard = getActiveStoryCard(gameState);
        if (storyCard) {
            const legacyRules = mapLegacyStoryCardToRules(storyCard);
            const modernRules = storyCard.rules || [];
            
            // Combine modern rules with translated legacy rules.
            const allStoryRules = [...modernRules, ...legacyRules];
            
            // Use a Map to deduplicate, preferring the first-seen rule (modern rules are first).
            // This prevents issues if a card is partially migrated.
            const uniqueRulesMap = new Map<string, SetupRule>();
            allStoryRules.forEach(rule => {
                // A simple key based on type and a primary property helps deduplicate.
                let key: string;
                switch (rule.type) {
                    case 'setJobMode':
                    case 'setAllianceMode':
                    case 'setNavMode':
                    case 'setPrimeMode':
                    case 'setDraftMode':
                    case 'setLeaderSetup':
                        key = `${rule.type}:${rule.mode}`;
                        break;
                    case 'forbidContact':
                        key = `${rule.type}:${rule.contact}`;
                        break;
                    case 'allowContacts':
                        key = `${rule.type}:${rule.contacts.join(',')}`;
                        break;
                    case 'setShipPlacement':
                        key = `${rule.type}:${rule.location}`;
                        break;
                    case 'addFlag':
                        key = `${rule.type}:${rule.flag}`;
                        break;
                    case 'modifyPrime':
                        // A card could define both a multiplier and a modifier.
                        // We should treat them as distinct for deduplication purposes.
                        if (rule.multiplier !== undefined) {
                            key = `${rule.type}:multiplier`;
                        } else if (rule.modifier !== undefined) {
                            key = `${rule.type}:modifier`;
                        } else {
                            key = rule.type;
                        }
                        break;
                    case 'modifyResource':
                        key = `${rule.type}:${rule.resource}`;
                        break;
                    // For rules that are unique by their type or don't need deduplication.
                    case 'primeContacts':
                    case 'createAlertTokenStack':
                    case 'addSpecialRule':
                    default:
                        // The default case handles rules that don't have a simple unique property
                        // or where duplicates are acceptable or not expected between legacy/modern.
                        key = rule.type;
                        break;
                }
                
                if (!uniqueRulesMap.has(key)) {
                    uniqueRulesMap.set(key, rule);
                }
            });
            
            rules.push(...Array.from(uniqueRulesMap.values()));
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