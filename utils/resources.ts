import { StoryCardDef, StepOverrides, ResourceDetails, GameState, ResourceConflict } from '../types';
import { hasFlag } from './data';

export const calculateStartingResources = (
  gameState: GameState,
  activeStoryCard: StoryCardDef,
  overrides: StepOverrides,
  manualSelection?: 'story' | 'setupCard'
): ResourceDetails => {
  const { resolveConflictsManually } = gameState.optionalRules;
  const bonusCredits = activeStoryCard.setupConfig?.startingCreditsBonus || 0;
  const storyOverride = activeStoryCard.setupConfig?.startingCreditsOverride;
  const setupOverride = overrides.startingCredits;

  let totalCredits: number;
  let conflict: ResourceConflict | undefined = undefined;

  const storyValue = storyOverride; // Story override is absolute, no bonus
  const setupValue = (setupOverride || 3000) + bonusCredits;

  if (storyOverride !== undefined && setupOverride !== undefined && storyValue !== setupValue) {
    // A conflict exists
    conflict = {
      story: { value: storyValue!, label: `Story: ${activeStoryCard.title}` },
      setupCard: { value: setupValue, label: `Setup Card: ${gameState.setupCardName}` }
    };

    if (resolveConflictsManually) {
      if (manualSelection === 'story') {
        totalCredits = storyValue!;
      } else if (manualSelection === 'setupCard') {
        totalCredits = setupValue;
      } else {
        // No selection made yet, default to story but show conflict UI
        totalCredits = storyValue!;
      }
    } else {
      // Default behavior: story priority
      totalCredits = storyValue!;
    }
  } else if (storyOverride !== undefined) {
    // Only story override
    totalCredits = storyValue!;
  } else {
    // Only setup override or default
    totalCredits = (setupOverride || 3000) + bonusCredits;
  }
  
  const noFuelParts = hasFlag(activeStoryCard.setupConfig, 'noStartingFuelParts');
  const customFuel = activeStoryCard.setupConfig?.customStartingFuel;

  return { totalCredits, bonusCredits, noFuelParts, customFuel, conflict };
};


export const getCreditsLabel = (
    details: ResourceDetails, 
    overrides: StepOverrides, 
    activeStoryCard: StoryCardDef,
    manualSelection?: 'story' | 'setupCard'
): string => {
    if (manualSelection) {
        return `Manual Selection (${manualSelection === 'story' ? 'Story Card' : 'Setup Card'})`;
    }
    if (details.conflict && activeStoryCard.setupConfig?.startingCreditsOverride !== undefined) {
        return 'Conflict (Defaulting to Story)';
    }
    if (activeStoryCard.setupConfig?.startingCreditsOverride !== undefined) {
        return `Story Override (${activeStoryCard.title})`;
    }

    const setupCredits = overrides.startingCredits;
    if (setupCredits !== undefined && setupCredits !== 3000) {
        let label = `Setup Card ($${setupCredits.toLocaleString()})`;
        if (details.bonusCredits > 0) {
            label += ` + Bonus $${details.bonusCredits.toLocaleString()}`;
        }
        return label;
    }
    
    if (details.bonusCredits > 0) {
        const base = setupCredits || 3000;
        return `Base $${base.toLocaleString()} + Bonus $${details.bonusCredits.toLocaleString()}`;
    }
    return "Standard Allocation";
};