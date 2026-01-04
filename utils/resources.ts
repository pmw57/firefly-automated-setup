import { 
    GameState, 
    ResourceDetails,
    ResourceType,
    ModifyResourceRule,
    RuleSourceType,
    ResourceConflict,
    SpecialRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { RULE_PRIORITY_ORDER } from '../data/constants';

const _findCreditConflict = (resourceRules: ModifyResourceRule[], manualResolutionEnabled: boolean): {
    conflict?: ResourceConflict;
    storyRule?: ModifyResourceRule;
    setupRule?: ModifyResourceRule;
} => {
    const creditSetRules = resourceRules.filter(r => r.resource === 'credits' && r.method === 'set');
    const storyRule = creditSetRules.find(r => r.source === 'story');
    const setupRule = creditSetRules.find(r => r.source === 'setupCard');

    if (manualResolutionEnabled && storyRule && setupRule && storyRule.value !== undefined && setupRule.value !== undefined) {
        return {
            conflict: {
                story: { value: storyRule.value, label: storyRule.sourceName },
                setupCard: { value: setupRule.value, label: setupRule.sourceName },
            },
            storyRule,
            setupRule,
        };
    }
    return { storyRule, setupRule };
};

const _applyResourceRules = (
    resourceType: ResourceType,
    baseValue: number,
    rulesForResource: ModifyResourceRule[],
    creditConflictInfo: ReturnType<typeof _findCreditConflict>,
    manualSelection?: 'story' | 'setupCard'
): { value: number; modifications: { description: string; value: string }[] } => {
    let finalValue = baseValue;
    let modifications: { description: string; value: string }[] = [];

    if (rulesForResource.some(r => r.method === 'disable')) {
        const disablingRule = rulesForResource.find(r => r.method === 'disable')!;
        modifications.push({ description: disablingRule.description, value: '0' });
        return { value: 0, modifications };
    }

    // Handle 'set' rules
    if (resourceType === 'credits' && creditConflictInfo.conflict && manualSelection) {
        const selectedRule = manualSelection === 'story' ? creditConflictInfo.storyRule : creditConflictInfo.setupRule;
        if (selectedRule?.value !== undefined) {
            finalValue = selectedRule.value;
            modifications = [{ description: selectedRule.description, value: `$${finalValue.toLocaleString()}` }];
        }
    } else {
        const setRules = rulesForResource.filter(r => r.method === 'set');
        if (setRules.length > 0) {
            setRules.sort((a, b) => RULE_PRIORITY_ORDER.indexOf(a.source) - RULE_PRIORITY_ORDER.indexOf(b.source));
            const topRule = setRules[0];
            if (topRule.value !== undefined) {
                finalValue = topRule.value;
                if (resourceType === 'credits') {
                    modifications = [{ description: topRule.description, value: `$${finalValue.toLocaleString()}` }];
                }
            }
        }
    }

    // Handle 'add' rules
    const addRules = rulesForResource.filter(r => r.method === 'add');
    addRules.forEach(rule => {
        if (rule.value !== undefined) {
            finalValue += rule.value;
            if (resourceType === 'credits') {
                if (modifications.length === 0) {
                     modifications.push({ description: "Base Allocation", value: `$${baseValue.toLocaleString()}` });
                }
                modifications.push({ description: rule.description, value: `+$${rule.value.toLocaleString()}` });
            }
        }
    });
    
    // Default modification for credits if no other rules applied
    if (resourceType === 'credits' && modifications.length === 0) {
        modifications.push({ description: "Standard Allocation", value: `$${finalValue.toLocaleString()}` });
    }

    return { value: finalValue, modifications };
};

export const getResourceDetails = (gameState: GameState, manualSelection?: 'story' | 'setupCard'): ResourceDetails => {
  const allRules = getResolvedRules(gameState);
  const resourceRules = allRules.filter(r => r.type === 'modifyResource') as ModifyResourceRule[];
  const specialRules: SpecialRule[] = [];
  
  allRules.forEach(rule => {
    if (rule.type === 'addSpecialRule' && rule.category === 'resources') {
        if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
            specialRules.push({
                source: rule.source as SpecialRule['source'],
                ...rule.rule
            });
        }
    }
  });
  
  const baseResources: Record<ResourceType, number> = { credits: 3000, fuel: 6, parts: 2, warrants: 0, goalTokens: 0 };
  const finalResources: Partial<Record<ResourceType, number>> = {};
  let finalCreditModifications: { description: string; value: string }[] = [];

  const creditConflictInfo = _findCreditConflict(resourceRules, gameState.optionalRules.resolveConflictsManually);
  
  (Object.keys(baseResources) as ResourceType[]).forEach(resource => {
    const { value, modifications } = _applyResourceRules(
      resource,
      baseResources[resource],
      resourceRules.filter(r => r.resource === resource),
      creditConflictInfo,
      manualSelection
    );
    finalResources[resource] = value;
    if (resource === 'credits') {
      finalCreditModifications = modifications;
    }
  });
  
  const getModificationInfo = (resource: ResourceType): { source?: RuleSourceType; description?: string } => {
    const rules = resourceRules.filter(r => r.resource === resource);
    if (rules.length === 0) return {};

    const hasModification = finalResources[resource] !== baseResources[resource] || rules.some(r => r.method === 'disable');
    if (!hasModification) return {};

    if (resource === 'credits' && creditConflictInfo.conflict && manualSelection) {
        const selectedRule = manualSelection === 'story' ? creditConflictInfo.storyRule! : creditConflictInfo.setupRule!;
        return { source: selectedRule.source, description: selectedRule.description };
    }
    
    rules.sort((a, b) => RULE_PRIORITY_ORDER.indexOf(a.source) - RULE_PRIORITY_ORDER.indexOf(b.source));
    const topRule = rules[0];

    return { source: topRule.source, description: topRule.description };
  };

  const creditModInfo = getModificationInfo('credits');
  const fuelModInfo = getModificationInfo('fuel');
  const partsModInfo = getModificationInfo('parts');
  
  const smugglersBluesSetup = hasRuleFlag(allRules, 'smugglersBluesSetup');
  let smugglersBluesVariantAvailable = false;
  if (smugglersBluesSetup) {
    const canUseRimRule = gameState.expansions.blue && gameState.expansions.kalidasa;
    if (canUseRimRule) {
      smugglersBluesVariantAvailable = true;
    } else {
      specialRules.push({ source: 'story', title: "Smuggler's Blues Contraband", content: ['Place ', { type: 'strong', content: '3 Contraband' }, ' on each Planetary Sector in ', { type: 'strong', content: 'Alliance Space' }, '.'] });
    }
  }
  
  if (hasRuleFlag(allRules, 'lonelySmugglerSetup')) {
    specialRules.push({ source: 'story', title: "Lonely Smuggler's Stash", content: ['Place ', { type: 'strong', content: '3 Contraband' }, ' on each Supply Planet ', { type: 'strong', content: 'except Persephone and Space Bazaar' }, '.'] });
  }

  return {
    credits: finalResources.credits!,
    fuel: finalResources.fuel!,
    parts: finalResources.parts!,
    warrants: finalResources.warrants!,
    goalTokens: finalResources.goalTokens!,
    isFuelDisabled: resourceRules.some(e => e.resource === 'fuel' && e.method === 'disable'),
    isPartsDisabled: resourceRules.some(e => e.resource === 'parts' && e.method === 'disable'),
    creditModifications: finalCreditModifications,
    conflict: creditConflictInfo.conflict,
    specialRules,
    smugglersBluesVariantAvailable,
    creditModificationSource: creditModInfo.source,
    creditModificationDescription: creditModInfo.description,
    fuelModificationSource: fuelModInfo.source,
    partsModificationSource: partsModInfo.source,
    fuelModificationDescription: fuelModInfo.description,
    partsModificationDescription: partsModInfo.description
  };
};