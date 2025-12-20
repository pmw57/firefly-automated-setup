import { StoryCardDef, SetupRule } from '../../types';

/**
 * A translation utility to convert legacy story card configuration formats (`effects` and `setupConfig`)
 * into the modern, unified `SetupRule[]` array. This allows new selectors to be backward-compatible
 * with old data structures during the phased refactoring of story card data.
 *
 * @param card The story card definition to process.
 * @returns An array of `SetupRule` objects derived from the legacy properties.
 */
export const mapLegacyStoryCardToRules = (card: StoryCardDef): SetupRule[] => {
  if (!card) return [];
  
  const legacyRules: SetupRule[] = [];
  const sourceName = card.title;

  // 1. Map from `effects` array (primarily for resource modifications)
  if (card.effects) {
    card.effects.forEach(effect => {
      legacyRules.push({
        ...effect,
        type: 'modifyResource', // Ensure the type is correctly set
        source: 'story',
        sourceName,
        description: effect.description || "Story Override", // Provide a default description
      });
    });
  }

  // 2. Map from `setupConfig` object
  const config = card.setupConfig;
  if (config) {
    if (config.jobDrawMode) {
      legacyRules.push({ type: 'setJobMode', mode: config.jobDrawMode, source: 'story', sourceName });
    }
    if (config.forbiddenStartingContact) {
      legacyRules.push({ type: 'forbidContact', contact: config.forbiddenStartingContact, source: 'story', sourceName });
    }
    if (config.allowedStartingContacts) {
      legacyRules.push({ type: 'allowContacts', contacts: config.allowedStartingContacts, source: 'story', sourceName });
    }
    if (config.primeModifier) {
      legacyRules.push({ type: 'modifyPrime', modifier: config.primeModifier, source: 'story', sourceName });
    }
    if (config.primingMultiplier) {
      legacyRules.push({ type: 'modifyPrime', multiplier: config.primingMultiplier, source: 'story', sourceName });
    }
    if (config.shipPlacementMode) {
      legacyRules.push({ type: 'setShipPlacement', location: config.shipPlacementMode, source: 'story', sourceName });
    }
    if (config.startAtSector) {
      // Handle special case for 'Border of Murphy' which is a specific placement location
      const location = config.startAtSector.toLowerCase().includes('murphy') ? 'border_of_murphy' : 'londinium';
      legacyRules.push({ type: 'setShipPlacement', location, source: 'story', sourceName });
    }
    if (config.createAlertTokenStackMultiplier) {
      legacyRules.push({ type: 'createAlertTokenStack', multiplier: config.createAlertTokenStackMultiplier, source: 'story', sourceName });
    }
    if (config.flags) {
      config.flags.forEach(flag => {
        // Translate specific flags that are actually rules into their proper rule types
        if (flag === 'primeContactDecks') {
          legacyRules.push({ type: 'primeContacts', source: 'story', sourceName });
        } else if (flag === 'startAtLondinium') {
          legacyRules.push({ type: 'setShipPlacement', location: 'londinium', source: 'story', sourceName });
        } else {
          // Keep generic flags as is
          legacyRules.push({ type: 'addFlag', flag, source: 'story', sourceName });
        }
      });
    }
  }

  return legacyRules;
};