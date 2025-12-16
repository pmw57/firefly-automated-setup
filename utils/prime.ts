
import { GameState, StepOverrides, StoryCardDef } from '../types';
import { STORY_TITLES } from '../data/ids';

export interface PrimeDetails {
  baseDiscard: number;
  effectiveMultiplier: number;
  finalCount: number;
  isHighSupplyVolume: boolean;
  isBlitz: boolean;
}

export const calculatePrimeDetails = (
  gameState: GameState,
  overrides: StepOverrides,
  activeStoryCard: StoryCardDef,
  useHouseRule: boolean
): PrimeDetails => {
  // Logic for Supply Deck Volume
  const supplyHeavyExpansions = ['kalidasa', 'pirates', 'breakin_atmo', 'still_flying'];
  const activeSupplyCount = supplyHeavyExpansions.filter(id => gameState.expansions[id as keyof typeof gameState.expansions]).length;
  const isHighSupplyVolume = activeSupplyCount >= 3;

  // 1. Determine Base Discard Count
  const baseDiscard = (isHighSupplyVolume && useHouseRule) ? 4 : 3;

  // 2. Determine Multiplier
  const isBlitz = !!overrides.blitzPrimeMode;
  const storyMultiplier = activeStoryCard.setupConfig?.primingMultiplier || 1;
  
  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) {
      effectiveMultiplier = 2;
  }

  // 3. Calculate Final Count
  let finalCount = baseDiscard * effectiveMultiplier;
  
  const isSlayingTheDragon = activeStoryCard.title === STORY_TITLES.SLAYING_THE_DRAGON;
  if (isSlayingTheDragon) {
      finalCount += 2;
  }

  return {
    baseDiscard,
    effectiveMultiplier,
    finalCount,
    isHighSupplyVolume,
    isBlitz,
  };
};
