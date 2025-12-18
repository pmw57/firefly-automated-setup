import { GameState, StoryCardDef, StepOverrides, ResourceDetails, ResourceConflict } from '../types';
import { hasFlag } from './data';

export const calculateStartingResources = (
  gameState: GameState,
  activeStoryCard: StoryCardDef | undefined,
  overrides: StepOverrides,
  manualSelection?: 'story' | 'setupCard'
): ResourceDetails => {
    const storyConfig = activeStoryCard?.setupConfig;
    const storyBonus = storyConfig?.startingCreditsBonus || 0;
    
    const baseSetupCredits = overrides.startingCredits || 3000;
    const setupCardValue = baseSetupCredits + storyBonus;

    const storyValue = storyConfig?.startingCreditsOverride;

    let totalCredits = setupCardValue;
    let conflict: ResourceConflict | undefined;

    if (storyValue !== undefined) {
        const storyLabel = `Override from "${activeStoryCard?.title}"`;
        const setupLabel = overrides.startingCredits ? `From Setup Card (+ Story Bonus)` : `Standard Credits (+ Story Bonus)`;
        
        conflict = {
            story: { value: storyValue, label: storyLabel },
            setupCard: { value: setupCardValue, label: setupLabel },
        };

        if (manualSelection === 'setupCard' && gameState.optionalRules.resolveConflictsManually) {
            totalCredits = setupCardValue;
        } else {
            totalCredits = storyValue; // Story has priority by default or when selected
        }
    }

    return {
        totalCredits,
        bonusCredits: storyBonus,
        noFuelParts: hasFlag(storyConfig, 'noStartingFuelParts') || !!overrides.browncoatJobMode,
        customStartingFuel: storyConfig?.customStartingFuel,
        conflict,
    };
};

export const getCreditsLabel = (
    details: ResourceDetails,
    overrides: StepOverrides,
    activeStoryCard: StoryCardDef | undefined,
    manualSelection?: 'story' | 'setupCard'
): string => {
    if (details.conflict) {
        if (manualSelection === 'setupCard' && details.conflict.setupCard) {
            return details.conflict.setupCard.label;
        }
        // Default to story or if story is selected
        if (details.conflict.story) {
            return details.conflict.story.label;
        }
    }

    if (activeStoryCard?.setupConfig?.startingCreditsOverride !== undefined) {
        return `Story Override (${activeStoryCard?.title})`;
    }
    
    if (details.bonusCredits > 0) {
        return `Base $${(overrides.startingCredits || 3000).toLocaleString()} + Bonus $${details.bonusCredits.toLocaleString()}`;
    }

    if (overrides.startingCredits) {
        return "Setup Card Allocation";
    }
    
    return "Standard Allocation";
};