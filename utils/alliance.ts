import { 
    GameState, 
    AllianceReaverDetails, 
    SpecialRule, 
    SetAlliancePlacementRule,
    SetReaverPlacementRule,
    RuleSourceType
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';

// Maps the broader RuleSourceType to the more specific source type expected by the
// SpecialRuleBlock component. This ensures type safety by explicitly handling sources
// like 'challenge' and 'optionalRule' which have distinct UI representations.
const mapRuleSourceToBlockSource = (source: RuleSourceType): SpecialRule['source'] => {
  if (source === 'challenge') {
    return 'warning';
  }
  if (source === 'optionalRule') {
    return 'info';
  }
  if (source === 'combinableSetupCard') {
    return 'setupCard';
  }
  return source;
};

export const getAllianceReaverDetails = (gameState: GameState): AllianceReaverDetails => {
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];
  
  let allianceOverride: SpecialRule | undefined;
  let reaverOverride: SpecialRule | undefined;

  const standardAlliancePlacement = "Place the Cruiser at Londinium.";
  const standardReaverPlacement = "Place 1 Cutter at the Firefly logo.";

  // --- Process general alert token rules ---
  // Note: Specific rule text for 'awful_crowded' and 'no_alerts' modes is now
  // handled via explicit `addSpecialRule` entries in data/setupCards.ts.
  // This block processes any other generic rules added by stories/expansions.
  
  if (hasRuleFlag(allRules, 'placeMixedAlertTokens')) {
    specialRules.push({ source: 'story', title: 'Verse-Wide Tension', content: ['Place ', { type: 'strong', content: '3 Alliance Alert Tokens' }, " in the 'Verse:", { type: 'list', items: [['1 in ', { type: 'strong', content: 'Alliance Space' }], ['1 in ', { type: 'strong', content: 'Border Space' }], ['1 in ', { type: 'strong', content: 'Rim Space' }]] }] });
  }

  allRules.forEach(rule => {
      if (rule.type === 'addSpecialRule' && rule.category === 'allianceReaver') {
          if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
              specialRules.push({
                  source: rule.source as SpecialRule['source'],
                  ...rule.rule
              });
          }
      }
  });

  // --- Process Alliance Cruiser placement ---
  const alliancePlacementRule = allRules.find(r => r.type === 'setAlliancePlacement') as SetAlliancePlacementRule | undefined;
  
  const finalAlliancePlacement = alliancePlacementRule
    ? alliancePlacementRule.placement
    : standardAlliancePlacement;

  if (finalAlliancePlacement !== standardAlliancePlacement) {
    allianceOverride = {
        // Use the mapping function to ensure the source type is compatible with the UI component.
        source: mapRuleSourceToBlockSource(alliancePlacementRule?.source || 'setupCard'),
        title: 'Alliance Cruiser Placement Override',
        content: [finalAlliancePlacement]
    };
  }

  // --- Process Reaver Cutter placement ---
  const reaverPlacementRule = allRules.find(r => r.type === 'setReaverPlacement') as SetReaverPlacementRule | undefined;
  const hasBlueSunReavers = hasRuleFlag(allRules, 'blueSunReaverPlacement');
  
  let finalReaverPlacement: string;
  let reaverOverrideSource: RuleSourceType = 'expansion';
  let reaverOverrideTitle = 'Reaver Placement';
  
  if (reaverPlacementRule) {
      reaverOverrideSource = reaverPlacementRule.source;
      reaverOverrideTitle = 'Special Reaver Placement';
      finalReaverPlacement = reaverPlacementRule.placement;
  } else if (hasBlueSunReavers) {
      reaverOverrideTitle = 'Blue Sun Reavers';
      finalReaverPlacement = "Place 3 Cutters in the border sectors closest to Miranda.";
  } else {
      finalReaverPlacement = standardReaverPlacement;
  }

  if (finalReaverPlacement !== standardReaverPlacement) {
    reaverOverride = {
        // Use the mapping function to ensure the source type is compatible with the UI component.
        source: mapRuleSourceToBlockSource(reaverOverrideSource),
        title: reaverOverrideTitle,
        content: [finalReaverPlacement]
    };
  }

  return { 
    specialRules, 
    standardAlliancePlacement,
    standardReaverPlacement,
    allianceOverride,
    reaverOverride,
    // The final resolved placement strings are included for consumption by legacy tests
    // that don't parse the more complex override objects.
    alliancePlacement: finalAlliancePlacement,
    reaverPlacement: finalReaverPlacement,
  };
};