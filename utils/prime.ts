import { 
    GameState, 
    PrimeDetails,
    StepOverrides,
    ModifyPrimeRule,
    SpecialRule,
    SetPrimeModeRule
} from '../types/index';
import { getResolvedRules } from './selectors/rules';
import { EXPANSIONS_METADATA } from '../data/expansions';

export const getPrimeDetails = (gameState: GameState, overrides: StepOverrides): PrimeDetails => {
  const activeSupplyHeavyCount = EXPANSIONS_METADATA.filter(
    exp => exp.isSupplyHeavy && gameState.expansions[exp.id as keyof typeof gameState.expansions]
  ).length;
  const isHighSupplyVolume = activeSupplyHeavyCount >= 3;

  const baseDiscard = isHighSupplyVolume && gameState.optionalRules.highVolumeSupply ? 4 : 3;
  
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];

  // Process generic special rules for this step category
  allRules.forEach(rule => {
      if (rule.type === 'addSpecialRule' && rule.category === 'prime') {
          if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
              specialRules.push({
                  source: rule.source as SpecialRule['source'],
                  ...rule.rule
              });
          }
      }
  });
  
  const primeMultiplierRule = allRules.find(r => r.type === 'modifyPrime' && r.multiplier !== undefined) as ModifyPrimeRule | undefined;
  const storyMultiplier = primeMultiplierRule?.multiplier ?? 1;
  
  const primeModifierRule = allRules.find(r => r.type === 'modifyPrime' && r.modifier !== undefined) as ModifyPrimeRule | undefined;
  const primeModifier = primeModifierRule?.modifier;

  const primeModeRule = allRules.find(r => r.type === 'setPrimeMode') as SetPrimeModeRule | undefined;
  const isBlitz = primeModeRule?.mode === 'blitz' || overrides.primeMode === 'blitz';

  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) effectiveMultiplier = 2;
  
  let finalCount = baseDiscard * effectiveMultiplier;
  if (primeModifier?.add) finalCount += primeModifier.add;

  return { baseDiscard, effectiveMultiplier, finalCount, isHighSupplyVolume, isBlitz, specialRules };
};