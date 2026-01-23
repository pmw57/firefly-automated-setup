
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
    AddBoardComponentRule
} from '../types/index';
import { getResolvedRules } from './selectors/rules';
import { getActiveStoryCard } from './selectors/story';
import { RULE_PRIORITY_ORDER } from '../data/constants';
import { mapRuleSourceToBlockSource } from './ruleProcessing';

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
): { value: number; modifications: { description: string; value: string }[], overruledRules: SpecialRule[] } => {
    let finalValue = baseValue;
    let modifications: { description: string; value: string }[] = [];
    const overruledRules: SpecialRule[] = [];

    if (rulesForResource.some(r => r.method === 'disable')) {
        const disablingRule = rulesForResource.find(r => r.method === 'disable')!;
        modifications.push({ description: disablingRule.description, value: '0' });
        return { value: 0, modifications, overruledRules: [] };
    }

    // Handle 'set' rules
    if (resourceType === 'credits' && creditConflictInfo.conflict && manualSelection) {
        const selectedRule = manualSelection === 'story' ? creditConflictInfo.storyRule : creditConflictInfo.setupRule;
        if (selectedRule?.value !== undefined) {
            finalValue = selectedRule.value;
            modifications = [{ description: selectedRule.description, value: `$${finalValue.toLocaleString()}` }];
        }
        // In manual conflict, we don't treat the other as "overruled" in the badge sense, 
        // as the user made an explicit choice via UI.
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

            // Identify overridden 'set' rules
            for (let i = 1; i < setRules.length; i++) {
                const loser = setRules[i];
                if (loser.value !== undefined && loser.value !== topRule.value) {
                     overruledRules.push({
                        source: mapRuleSourceToBlockSource(loser.source),
                        title: `${resourceType === 'credits' ? 'Starting Capitol' : 'Starting Resource'} (${loser.sourceName})`,
                        badge: 'Overruled',
                        content: [{ type: 'paragraph-small-italic', content: [`Original value: ${loser.value}`] }]
                     });
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
    
    if (resourceType === 'credits' && modifications.length === 0) {
        modifications.push({ description: "Standard Allocation", value: `$${finalValue.toLocaleString()}` });
    }

    return { value: finalValue, modifications, overruledRules };
};

export const getResourceDetails = (gameState: GameState, manualSelection?: 'story' | 'setupCard'): ResourceDetails => {
  const allRules = getResolvedRules(gameState);
  const resourceRules = allRules.filter(r => r.type === 'modifyResource') as ModifyResourceRule[];
  const activeStoryCard = getActiveStoryCard(gameState);
  
  const specialRules: SpecialRule[] = [];
  const boardSetupRules: SpecialRule[] = [];
  const componentAdjustmentRules: SpecialRule[] = [];
  const tokenStacks: TokenStack[] = [];
  const createTokenStackRules = allRules.filter(r => r.type === 'createAlertTokenStack') as CreateAlertTokenStackRule[];

  for (const rule of createTokenStackRules) {
    let count = 0;
    const description: string | undefined = rule.description;
    
    if (rule.valuesByGoal && gameState.selectedGoal) {
      const goalMatch = Object.keys(rule.valuesByGoal).find(
          key => key.toLowerCase() === gameState.selectedGoal!.toLowerCase()
      );
      if (goalMatch) {
          count = rule.valuesByGoal[goalMatch];
      }
    } else if (rule.fixedValue !== undefined) {
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
  }
  
  const smugglersBluesVariantAvailable = 
      !!activeStoryCard?.challengeOptions?.some(o => o.id === 'smugglers_blues_rim_variant') &&
      gameState.expansions.blue && 
      gameState.expansions.kalidasa;
  
  const addBoardComponentRules = allRules
      .filter((r): r is AddBoardComponentRule => r.type === 'addBoardComponent')
      .map(r => ({ ...r }));

  addBoardComponentRules.forEach(rule => {
    if (rule.sourceName === "Smuggler's Blues" && rule.title === 'A Lucrative Opportunity') {
        if (gameState.challengeOptions['smugglers_blues_rim_variant']) {
            rule.count = 2;
            rule.targetRegion = 'Rim Space';
            rule.locations = [];
            rule.locationTitle = undefined;
            rule.locationSubtitle = undefined;
        }
    }

    let locationTitle = rule.locationTitle;
    let locationSubtitle = rule.locationSubtitle;

    if (!locationTitle && rule.distribution) {
        if (rule.distribution === 'region' && rule.targetRegion) {
            locationTitle = `${rule.count} on each Planetary Sector`;
            locationSubtitle = `In ${rule.targetRegion}`;
        } else if (rule.distribution === 'all_supply_planets') {
            locationTitle = `${rule.count} on each Supply Planet`;
        }
        
        if (rule.excludeLocations && rule.excludeLocations.length > 0) {
            locationSubtitle = (locationSubtitle ? `${locationSubtitle} ` : '') + `(except ${rule.excludeLocations.join(', ')})`;
        }
    }

    boardSetupRules.push({
      source: mapRuleSourceToBlockSource(rule.source),
      title: rule.title,
      content: [],
      icon: rule.icon,
      locationTitle: locationTitle,
      locationSubtitle: locationSubtitle
    } as SpecialRule & { icon?: string; locationTitle?: string; locationSubtitle?: string });
  });

  allRules.forEach(rule => {
    if (rule.type === 'addSpecialRule' && rule.category === 'resources') {
        const newRule = { source: mapRuleSourceToBlockSource(rule.source), ...rule.rule };
        
        if (!newRule.flags?.includes('hideFromTop')) {
                specialRules.push(newRule);
        }
        
        if (newRule.title === 'Missing Person' || newRule.flags?.includes('showInResourceList')) {
            componentAdjustmentRules.push(newRule);
        }
    }
  });

  const baseResources: Record<ResourceType, number> = { credits: 3000, fuel: 6, parts: 2, warrants: 0, goalTokens: 0 };
  const finalResources: Partial<Record<ResourceType, number>> = {};
  let finalCreditModifications: { description: string; value: string }[] = [];

  const creditConflictInfo = _findCreditConflict(resourceRules, !!gameState.optionalRules.resolveConflictsManually);
  
  (Object.keys(baseResources) as ResourceType[]).forEach(resource => {
    const { value, modifications, overruledRules } = _applyResourceRules(
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
    // Add any overruled rules found during calculation
    specialRules.push(...overruledRules);
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
  
  const infoRules = specialRules.filter(r => r.source === 'info' || r.source === 'warning');
  const overrideRules = specialRules.filter(r => r.source !== 'info' && r.source !== 'warning');

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
    infoRules,
    overrideRules,
    boardSetupRules,
    componentAdjustmentRules,
    creditModificationSource: creditModInfo.source,
    creditModificationDescription: creditModInfo.description,
    fuelModificationSource: fuelModInfo.source,
    partsModificationSource: partsModInfo.source,
    fuelModificationDescription: fuelModInfo.description,
    partsModificationDescription: partsModInfo.description,
    smugglersBluesVariantAvailable,
  };
};
