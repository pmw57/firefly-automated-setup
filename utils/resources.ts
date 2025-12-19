import { GameState, StoryCardDef, StepOverrides, ResourceDetails, ResourceConflict, ModifyResourceEffect } from '../types';
import { SETUP_CARDS } from '../data/setupCards';
import { STORY_CARDS } from '../data/storyCards';

export const calculateStartingResources = (
  gameState: GameState,
  manualSelection?: 'story' | 'setupCard',
  activeStoryCardOverride?: StoryCardDef | undefined
): ResourceDetails => {
  // 1. Get active cards
  const activeSetupCard = SETUP_CARDS.find(c => c.id === gameState.setupCardId);
  const activeStoryCard = activeStoryCardOverride || STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);

  // 2. Collect resource modification effects from all sources
  const setupEffects = (activeSetupCard?.effects?.filter(e => e.type === 'modifyResource') as ModifyResourceEffect[] | undefined) || [];
  const storyEffects = (activeStoryCard?.effects?.filter(e => e.type === 'modifyResource') as ModifyResourceEffect[] | undefined) || [];
  const allEffects = [...setupEffects, ...storyEffects];

  // 3. Initialize resources with defaults
  const resources = { credits: 3000, fuel: 6, parts: 2, warrants: 0, goalTokens: 0 };
  let creditModifications: { description: string; value: string }[] = [{ description: "Standard Allocation", value: "$3,000" }];

  // 4. Process SET effects (these form the new base values)
  const setupSetCredits = setupEffects.find(e => e.resource === 'credits' && e.method === 'set');
  if (setupSetCredits?.value !== undefined) {
    resources.credits = setupSetCredits.value;
    creditModifications = [{ description: setupSetCredits.description, value: `$${setupSetCredits.value.toLocaleString()}` }];
  }

  const storySetCredits = storyEffects.find(e => e.resource === 'credits' && e.method === 'set');

  // Conflict detection and resolution for 'set' credits
  let conflict: ResourceConflict | undefined;
  if (setupSetCredits?.value !== undefined && storySetCredits?.value !== undefined) {
    conflict = {
        story: { value: storySetCredits.value, source: storySetCredits.source },
        setupCard: { value: setupSetCredits.value, source: setupSetCredits.source },
    };

    if (gameState.optionalRules.resolveConflictsManually && manualSelection === 'setupCard') {
      // User chose setup card, do nothing as it's already the base
    } else {
      // Default to story priority
      resources.credits = storySetCredits.value;
      creditModifications = [{ description: storySetCredits.description, value: `$${storySetCredits.value.toLocaleString()}` }];
    }
  } else if (storySetCredits?.value !== undefined) {
    // Only story card has a 'set' effect
    resources.credits = storySetCredits.value;
    creditModifications = [{ description: storySetCredits.description, value: `$${storySetCredits.value.toLocaleString()}` }];
  }

  // Process other 'set' effects
  allEffects.filter(e => e.method === 'set' && e.resource !== 'credits').forEach(effect => {
    if (effect.value !== undefined) {
        resources[effect.resource as keyof typeof resources] = effect.value;
    }
  });

  // 5. Process ADD effects
  allEffects.filter(e => e.method === 'add').forEach(effect => {
    if (effect.value !== undefined) {
        resources[effect.resource as keyof typeof resources] += effect.value;
        if (effect.resource === 'credits') {
            creditModifications.push({ description: effect.description, value: `+$${effect.value.toLocaleString()}` });
        }
    }
  });

  // 6. Process DISABLE effects
  const isFuelDisabled = allEffects.some(e => e.resource === 'fuel' && e.method === 'disable');
  if (isFuelDisabled) {
    resources.fuel = 0;
  }
  const isPartsDisabled = allEffects.some(e => e.resource === 'parts' && e.method === 'disable');
  if (isPartsDisabled) {
    resources.parts = 0;
  }

  return {
    credits: resources.credits,
    fuel: resources.fuel,
    parts: resources.parts,
    warrants: resources.warrants,
    goalTokens: resources.goalTokens,
    isFuelDisabled,
    isPartsDisabled,
    conflict,
    creditModifications,
  };
};

// This function is now deprecated in favor of the more detailed `creditModifications` array.
// It is kept for compatibility with StartingCapitolStep but should be removed in a future refactor.
export const getCreditsLabel = (
    details: Pick<ResourceDetails, 'conflict' | 'creditModifications'>,
    _overrides: StepOverrides, // No longer used
    _activeStoryCard: StoryCardDef | undefined, // No longer used
    manualSelection?: 'story' | 'setupCard'
): string => {
    if (details.conflict) {
        if (manualSelection === 'setupCard') {
            return details.conflict.setupCard.source.name;
        }
        return details.conflict.story.source.name;
    }
    return details.creditModifications[0]?.description || "Allocation";
};