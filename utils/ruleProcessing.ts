
import { SetupRule, SpecialRule, RuleSourceType } from '../types/index';
import { RULE_PRIORITY_ORDER } from '../data/constants';

// Maps the broader RuleSourceType to the more specific source type expected by the
// SpecialRuleBlock component.
export const mapRuleSourceToBlockSource = (source: RuleSourceType): SpecialRule['source'] => {
  if (source === 'challenge') return 'warning';
  if (source === 'optionalRule') return 'info';
  if (source === 'combinableSetupCard') return 'setupCard';
  return source as SpecialRule['source'];
};

export interface ProcessedRuleResult<T extends SetupRule> {
    activeRule: T | undefined;
    overruledRules: SpecialRule[];
}

/**
 * Processes a list of conflicting rules of the same type.
 * Sorts them by priority, selects the active one, and converts the rest into
 * "Overruled" notification blocks if their effect differs from the active one.
 */
export function processOverrulableRules<T extends SetupRule>(
    rules: T[],
    getLabel: (rule: T) => string,
    getTitle: (rule: T) => string
): ProcessedRuleResult<T> {
    if (rules.length === 0) return { activeRule: undefined, overruledRules: [] };

    // Sort: Index 0 is highest priority (e.g. Story)
    const sorted = [...rules].sort((a, b) => 
        RULE_PRIORITY_ORDER.indexOf(a.source) - RULE_PRIORITY_ORDER.indexOf(b.source)
    );

    const activeRule = sorted[0];
    const activeLabel = getLabel(activeRule);
    
    const overruledRules: SpecialRule[] = [];
    
    // Iterate through losers
    for (let i = 1; i < sorted.length; i++) {
        const loser = sorted[i];
        const loserLabel = getLabel(loser);
        
        // If the effect is identical to the winner, it's redundant/agreement, not an override.
        if (loserLabel === activeLabel) continue;

        overruledRules.push({
            source: mapRuleSourceToBlockSource(loser.source),
            title: `${getTitle(loser)} (${loser.sourceName})`,
            badge: 'Overruled',
            content: [{ type: 'paragraph-small-italic', content: [loserLabel] }]
        });
    }

    return { activeRule, overruledRules };
}
