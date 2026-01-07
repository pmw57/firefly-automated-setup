import { 
    GameState, 
    ResourceDetails,
    ResourceType,
    ModifyResourceRule,
    RuleSourceType,
    ResourceConflict,
    SpecialRule,
    CreateAlertTokenStackRule,
    TokenStack,
    StructuredContent
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
                const sign = rule.value >= 0 ? '+' : '-';
                const displayValue = Math.abs(rule.value).toLocaleString();
                modifications.push({ description: rule.description, value: `${sign}$${displayValue}` });
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
  const boardSetupRules: SpecialRule[] = [];
  const componentAdjustmentRules: SpecialRule[] = [];
  const tokenStacks: TokenStack[] = [];
  const createTokenStackRules = allRules.filter(r => r.type === 'createAlertTokenStack') as CreateAlertTokenStackRule[];

  for (const rule of createTokenStackRules) {
    let count = 0;
    const description: string | undefined = rule.description;
    
    if (rule.fixedValue !== undefined) {
      count = rule.fixedValue;
    } else if (rule.multiplier !== undefined) {
      count = rule.multiplier * gameState.playerCount;
    }

    const tokenName = rule.tokenName || 'Alliance Alert Tokens';
    
    tokenStacks.push({
      count,
      title: tokenName,
      description,
      rule
    });

    if (rule.title) {
      const content: StructuredContent = ['Create a stack of ', { type: 'strong', content: `${count} ${tokenName}` }];
      if (rule.multiplier) {
        content.push(` (${rule.multiplier} per player).`);
      }
      specialRules.push({
        source: 'story',
        title: rule.title,
        content
      });
    }
  }

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

  if (hasRuleFlag(allRules, 'placeAllianceAlertsInAllianceSpace')) {
    const ruleContent: SpecialRule['content'] = ['Place an ', { type: 'action', content: 'Alliance Alert Token' }, ' on ', { type: 'strong', content: 'every planetary sector in Alliance Space' }, '.'];
    specialRules.push({ source: 'story', title: 'Alliance Space Lockdown', content: ruleContent });
    boardSetupRules.push({ source: 'story', title: 'Alliance Space Lockdown', content: ruleContent });
  }

  const smugglersBluesSetup = hasRuleFlag(allRules, 'smugglersBluesSetup');
  if (smugglersBluesSetup && !(gameState.expansions.blue && gameState.expansions.kalidasa)) {
    specialRules.push({
        source: 'story',
        title: "Smuggler's Blues Contraband",
        content: ["Place 3 Contraband on each planetary sector in Alliance Space."]
    });
  }
  
  if (hasRuleFlag(allRules, 'lonelySmugglerSetup')) {
    const ruleContent: SpecialRule['content'] = ['Place ', { type: 'strong', content: '3 Contraband' }, ' on each Supply Planet ', { type: 'strong', content: 'except Persephone and Space Bazaar' }, '.'];
    specialRules.push({ source: 'story', title: "Lonely Smuggler's Stash", content: ruleContent });
    boardSetupRules.push({ source: 'story', title: "Lonely Smuggler's Stash", content: ruleContent });
  }

  if (hasRuleFlag(allRules, 'removeRiver')) {
    componentAdjustmentRules.push({ source: 'story', title: "Missing Person", content: ["Remove ", { type: 'strong', content: "River Tam" }, " from play."] });
  }

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

  return {
    credits: finalResources.credits!,
    fuel: finalResources.fuel!,
    parts: finalResources.parts!,
    warrants: finalResources.warrants!,
    goalTokens: finalResources.goalTokens!,
    tokenStacks,
    isFuelDisabled: resourceRules.some(e => e.resource === 'fuel' && e.method === 'disable'),
    isPartsDisabled: resourceRules.some(e => e.resource === 'parts' && e.method === 'disable'),
    creditModifications: finalCreditModifications,
    conflict: creditConflictInfo.conflict,
    specialRules,
    boardSetupRules,
    componentAdjustmentRules,
    creditModificationSource: creditModInfo.source,
    creditModificationDescription: creditModInfo.description,
    fuelModificationSource: fuelModInfo.source,
    partsModificationSource: partsModInfo.source,
    fuelModificationDescription: fuelModInfo.description,
    partsModificationDescription: partsModInfo.description,
    smugglersBluesVariantAvailable: hasRuleFlag(allRules, 'smugglersBluesSetup') && gameState.expansions.blue && gameState.expansions.kalidasa,
  };
};