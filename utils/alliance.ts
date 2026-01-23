
import { 
    GameState, 
    AllianceReaverDetails, 
    SpecialRule, 
    SetAlliancePlacementRule,
    SetReaverPlacementRule,
    RuleSourceType
} from '../types/index';
import { getResolvedRules } from './selectors/rules';

// Maps the broader RuleSourceType to the more specific source type expected by the
// SpecialRuleBlock component. This ensures type safety by explicitly handling sources
// like 'challenge' and 'optionalRule' which have distinct UI representations.
const mapRuleSourceToBlockSource = (source: RuleSourceType): SpecialRule['source'] => {
  if (source === 'challenge') return 'warning';
  if (source === 'optionalRule') return 'info';
  if (source === 'combinableSetupCard') return 'setupCard';
  return source as SpecialRule['source'];
};

export const getAllianceReaverDetails = (gameState: GameState): AllianceReaverDetails => {
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];
  
  let allianceOverride: SpecialRule | undefined;
  let reaverOverride: SpecialRule | undefined;

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

  // --- Process Alliance Cruiser placement ---
  const alliancePlacementRule = allRules.find(r => r.type === 'setAlliancePlacement') as SetAlliancePlacementRule | undefined;
  
  const isAllianceDisabled = alliancePlacementRule?.placement === 'disabled';
  let finalAlliancePlacement = standardAlliancePlacement;

  if (isAllianceDisabled) {
      finalAlliancePlacement = 'disabled';
      allianceOverride = {
          source: mapRuleSourceToBlockSource(alliancePlacementRule?.source || 'story'),
          title: 'Alliance Cruiser Disabled',
          content: ['The Alliance Cruiser is not used in this scenario.']
      };
  } else if (alliancePlacementRule) {
      finalAlliancePlacement = alliancePlacementRule.placement;
      if (finalAlliancePlacement !== standardAlliancePlacement) {
        allianceOverride = {
            source: mapRuleSourceToBlockSource(alliancePlacementRule.source),
            title: 'Alliance Cruiser Placement Override',
            content: [finalAlliancePlacement]
        };
      }
  }

  // --- Process Reaver Cutter placement ---
  const reaverPlacementRule = allRules.find(r => r.type === 'setReaverPlacement') as SetReaverPlacementRule | undefined;
  
  let finalReaverPlacement = standardReaverPlacement;
  const isReaverDisabled = reaverPlacementRule?.placement === 'disabled';

  if (isReaverDisabled) {
      finalReaverPlacement = 'disabled';
      reaverOverride = {
          source: mapRuleSourceToBlockSource(reaverPlacementRule?.source || 'story'),
          title: 'Reaver Cutter Disabled',
          content: ['Reaver Cutters are not used in this scenario.']
      };
  } else if (reaverPlacementRule) {
      finalReaverPlacement = reaverPlacementRule.placement;
      // Default to 'expansion' if not provided, though typically rules have a source.
      // Special logic: Reaver placements often come from expansions (Blue Sun) or Setup Cards.
      // We generally want to show these unless they are standard.
      // Note: "Place 1 Cutter at the Firefly logo" is standard.
      // But reaverPlacementRule.placement might be different.
      if (finalReaverPlacement !== standardReaverPlacement) {
          reaverOverride = {
              source: mapRuleSourceToBlockSource(reaverPlacementRule.source),
              title: 'Reaver Placement',
              content: [finalReaverPlacement]
          };
      }
  }
  
  const infoRules = specialRules.filter(r => r.source === 'info' || r.source === 'warning');
  const overrideRules = specialRules.filter(r => r.source !== 'info' && r.source !== 'warning');

  return { 
    infoRules, 
    overrideRules,
    standardAlliancePlacement,
    standardReaverPlacement,
    allianceOverride,
    reaverOverride,
    alliancePlacement: finalAlliancePlacement,
    reaverPlacement: finalReaverPlacement,
    isAllianceDisabled,
    isReaverDisabled
  };
};
