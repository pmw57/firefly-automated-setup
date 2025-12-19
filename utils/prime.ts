import { GameState, StoryCardDef, StepOverrides } from '../types';

export const calculatePrimeDetails = (
  gameState: GameState,
  overrides: StepOverrides,
  activeStoryCard: StoryCardDef | undefined
) => {
  const supplyHeavyExpansions: (keyof GameState['expansions'])[] = ['kalidasa', 'pirates', 'breakin_atmo', 'still_flying'];
  const activeSupplyHeavyCount = supplyHeavyExpansions.filter(exp => gameState.expansions[exp]).length;
  const isHighSupplyVolume = activeSupplyHeavyCount >= 3;

  const baseDiscard = isHighSupplyVolume && gameState.optionalRules.highVolumeSupply ? 4 : 3;
  const storyMultiplier = activeStoryCard?.setupConfig?.primingMultiplier || 1;
  const primeModifier = activeStoryCard?.setupConfig?.primeModifier;
  const isBlitz = overrides.primeMode === 'blitz';

  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) {
    effectiveMultiplier = 2;
  }
  
  let finalCount = baseDiscard * effectiveMultiplier;
  if (primeModifier?.add) {
    finalCount += primeModifier.add;
  }

  return {
    baseDiscard,
    effectiveMultiplier,
    finalCount,
    isHighSupplyVolume,
    isBlitz,
  };
};
