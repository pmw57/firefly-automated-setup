import { GameState, StoryCardDef, StepOverrides } from '../types';
import { STORY_TITLES } from '../data/ids';

export const calculatePrimeDetails = (
  gameState: GameState,
  overrides: StepOverrides,
  activeStoryCard: StoryCardDef | undefined,
  useHouseRule: boolean
) => {
  const supplyHeavyExpansions: (keyof GameState['expansions'])[] = ['kalidasa', 'pirates', 'breakin_atmo', 'still_flying'];
  const activeSupplyHeavyCount = supplyHeavyExpansions.filter(exp => gameState.expansions[exp]).length;
  const isHighSupplyVolume = activeSupplyHeavyCount >= 3;

  const baseDiscard = isHighSupplyVolume && useHouseRule ? 4 : 3;
  const storyMultiplier = activeStoryCard?.setupConfig?.primingMultiplier || 1;
  const isBlitz = !!overrides.blitzPrimeMode;
  const isSlayingTheDragon = activeStoryCard?.title === STORY_TITLES.SLAYING_THE_DRAGON;

  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) {
    effectiveMultiplier = 2;
  }
  
  let finalCount = baseDiscard * effectiveMultiplier;
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