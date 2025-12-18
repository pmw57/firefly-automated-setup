import { StoryCardDef, StepOverrides, ResourceDetails } from '../types';
import { hasFlag } from './data';

export const calculateStartingResources = (activeStoryCard: StoryCardDef, overrides: StepOverrides): ResourceDetails => {
  const bonusCredits = activeStoryCard.setupConfig?.startingCreditsBonus || 0;
  let totalCredits = overrides.startingCredits || 3000;
  
  // Handle explicit override from story card (e.g., Community Content)
  if (activeStoryCard.setupConfig?.startingCreditsOverride !== undefined) {
    totalCredits = activeStoryCard.setupConfig.startingCreditsOverride;
  } else {
    // Apply bonuses
    totalCredits += bonusCredits;
  }

  const noFuelParts = hasFlag(activeStoryCard.setupConfig, 'noStartingFuelParts');
  const customFuel = activeStoryCard.setupConfig?.customStartingFuel;

  return { totalCredits, bonusCredits, noFuelParts, customFuel };
};


export const getCreditsLabel = (details: ResourceDetails, overrides: StepOverrides, activeStoryCard: StoryCardDef): string => {
    if (activeStoryCard.setupConfig?.startingCreditsOverride !== undefined) {
        return `Story Override (${activeStoryCard.title})`;
    }
    if (details.bonusCredits > 0) {
        return `Base $${(overrides.startingCredits || 3000).toLocaleString()} + Bonus $${details.bonusCredits.toLocaleString()}`;
    }
    return "Standard Allocation";
};