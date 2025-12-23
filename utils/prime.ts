import { 
    GameState, 
    PrimeDetails,
    StepOverrides,
    ModifyPrimeRule
} from '../types';
import { getResolvedRules } from './selectors/rules';
import { STORY_TITLES } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';

export const getPrimeDetails = (gameState: GameState, overrides: StepOverrides): PrimeDetails => {
  const activeStoryCard = getActiveStoryCard(gameState);
  const supplyHeavyExpansions: (keyof GameState['expansions'])[] = ['kalidasa', 'pirates', 'breakin_atmo', 'still_flying'];
  const activeSupplyHeavyCount = supplyHeavyExpansions.filter(exp => gameState.expansions[exp]).length;
  const isHighSupplyVolume = activeSupplyHeavyCount >= 3;

  const baseDiscard = isHighSupplyVolume && gameState.optionalRules.highVolumeSupply ? 4 : 3;
  
  const rules = getResolvedRules(gameState);
  
  const primeMultiplierRule = rules.find(r => r.type === 'modifyPrime' && r.multiplier !== undefined) as ModifyPrimeRule | undefined;
  const storyMultiplier = primeMultiplierRule?.multiplier ?? 1;
  
  const primeModifierRule = rules.find(r => r.type === 'modifyPrime' && r.modifier !== undefined) as ModifyPrimeRule | undefined;
  const primeModifier = primeModifierRule?.modifier;

  const isBlitz = overrides.primeMode === 'blitz';

  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) effectiveMultiplier = 2;
  
  let finalCount = baseDiscard * effectiveMultiplier;
  if (primeModifier?.add) finalCount += primeModifier.add;

  const isSlayingTheDragon = activeStoryCard?.title === STORY_TITLES.SLAYING_THE_DRAGON;

  return { baseDiscard, effectiveMultiplier, finalCount, isHighSupplyVolume, isBlitz, isSlayingTheDragon, specialRules: [] };
};