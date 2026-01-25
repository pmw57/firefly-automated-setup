
import { 
    GameState, 
    AllianceReaverDetails, 
    SpecialRule, 
    SetAlliancePlacementRule, 
    SetReaverPlacementRule
} from '../types/index';
import { getResolvedRules } from './selectors/rules';
import { RULE_PRIORITY_ORDER } from '../data/constants';
import { mapRuleSourceToBlockSource } from './ruleProcessing';

export const getAllianceReaverDetails = (gameState: GameState): AllianceReaverDetails => {
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];
  
  const standardAlliancePlacement = "Place the Cruiser at Londinium.";
  const standardReaverPlacement = "Place 1 Cutter at the Firefly logo.";

  // --- Process general alert token rules ---
  allRules.forEach(rule => {
      if (rule.type === 'addSpecialRule' && rule.category === 'allianceReaver') {
          specialRules.push({
              source: mapRuleSourceToBlockSource(rule.source),
              ...rule.rule
          });
      }
  });

  // Helper to process placement rules with priority and visibility for overrides
  const processPlacement = (
    type: 'setAlliancePlacement' | 'setReaverPlacement',
    standardText: string,
    defaultTitle: string
  ) => {
    // 1. Find all rules of this type
    const rules = allRules.filter(r => r.type === type) as (SetAlliancePlacementRule | SetReaverPlacementRule)[];

    // 2. Sort by Priority (Lower index in RULE_PRIORITY_ORDER = Higher Priority)
    // Story (0) > Setup (3) > Expansion (5)
    rules.sort((a, b) => RULE_PRIORITY_ORDER.indexOf(a.source) - RULE_PRIORITY_ORDER.indexOf(b.source));

    // 3. Determine Winner and Losers
    const winner = rules[0];
    const losers = rules.slice(1);

    // 4. Create Main Override Object (if winner exists)
    let activePlacement = standardText;
    let overrideObj: SpecialRule | undefined;
    let isDisabled = false;

    if (winner) {
        if (winner.placement === 'disabled') {
            isDisabled = true;
            activePlacement = 'disabled';
            // CRITICAL CHANGE: Do NOT create an overrideObj for 'disabled'.
            // The UI will handle the greyed-out box via `isDisabled`.
            // Any explanation text should come from a manual `addSpecialRule` in the Story Card data,
            // preventing "Auto-generated" blocks from cluttering the UI.
            overrideObj = undefined;
        } else {
            activePlacement = winner.placement;
            // Only create an override object if it differs from standard, 
            // OR if it comes from a specific source we usually want to highlight (like a story/setup card).
            if (activePlacement !== standardText || winner.source !== 'expansion') {
                overrideObj = {
                    source: mapRuleSourceToBlockSource(winner.source),
                    title: defaultTitle, // e.g. "Reaver Placement"
                    content: [activePlacement]
                };
            }
        }
    }

    // 5. Convert Losers to "Overruled" Notifications
    // Keep the original source styling (e.g., Expansion) but mark as Overruled.
    losers.forEach(loser => {
        // Skip if it's the exact same text (redundant)
        if (loser.placement === activePlacement) return;
        
        const loserContent = loser.placement === 'disabled' ? 'Disabled' : loser.placement;

        specialRules.push({
            source: mapRuleSourceToBlockSource(loser.source),
            title: `${defaultTitle} (${loser.sourceName})`,
            badge: 'Overruled',
            content: [{ type: 'paragraph-small-italic', content: [loserContent] }]
        });
    });

    return { activePlacement, overrideObj, isDisabled };
  };

  const allianceResult = processPlacement('setAlliancePlacement', standardAlliancePlacement, 'Alliance Cruiser');
  const reaverResult = processPlacement('setReaverPlacement', standardReaverPlacement, 'Reaver Cutter');
  
  const infoRules = specialRules.filter(r => r.source === 'info' || r.source === 'warning');
  const overrideRules = specialRules.filter(r => r.source !== 'info' && r.source !== 'warning');

  return { 
    infoRules, 
    overrideRules,
    standardAlliancePlacement,
    standardReaverPlacement,
    allianceOverride: allianceResult.overrideObj,
    reaverOverride: reaverResult.overrideObj,
    alliancePlacement: allianceResult.activePlacement,
    reaverPlacement: reaverResult.activePlacement,
    isAllianceDisabled: allianceResult.isDisabled,
    isReaverDisabled: reaverResult.isDisabled
  };
};
