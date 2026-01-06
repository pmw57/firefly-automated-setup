import { 
    GameState, 
    StepOverrides, 
    AllianceReaverDetails, 
    SpecialRule, 
    SetAllianceModeRule,
    AddFlagRule,
    RuleSourceType
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';

// FIX: Added a helper function to safely map the broader RuleSourceType
// to the narrower source type expected by SpecialRuleBlock. This resolves the
// TypeScript error by explicitly handling 'challenge', 'optionalRule', and 'combinableSetupCard' cases.
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

export const getAllianceReaverDetails = (gameState: GameState, stepOverrides: StepOverrides): AllianceReaverDetails => {
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];
  
  let allianceOverride: SpecialRule | undefined;
  let reaverOverride: SpecialRule | undefined;

  const standardAlliancePlacement = "Place the Cruiser at Londinium.";
  const standardReaverPlacement = "Place 1 Cutter at the Firefly logo.";

  // --- Process general alert token rules ---
  const allianceModeRule = allRules.find(r => r.type === 'setAllianceMode') as SetAllianceModeRule | undefined;
  const allianceMode = allianceModeRule?.mode || stepOverrides.allianceMode;

  switch (allianceMode) {
    case 'no_alerts':
      specialRules.push({ source: 'setupCard', title: 'Safe Skies', content: [{ type: 'strong', content: 'Safe Skies:' }, ' Do not place any Alert Tokens at the start of the game.'] });
      break;
    case 'awful_crowded':
      specialRules.push({
        source: 'setupCard', title: 'Awful Crowded',
        content: [
          { type: 'strong', content: 'Awful Crowded:' },
          { type: 'list', items: [
            ['Place an ', { type: 'action', content: 'Alert Token' }, ' in ', { type: 'strong', content: 'every planetary sector' }, '.'],
            [{ type: 'strong', content: 'Alliance Space:' }, ' Place Alliance Alert Tokens.'],
            [{ type: 'strong', content: 'Border & Rim Space:' }, ' Place Reaver Alert Tokens.'],
            [{ type: 'warning-box', content: ["Do not place Alert Tokens on players' starting locations."] }],
            [{ type: 'strong', content: 'Alliance Ship movement' }, ' does not generate new Alert Tokens.'],
            [{ type: 'strong', content: 'Reaver Ship movement' }, ' generates new Alert Tokens.']
          ]}
        ]
      });
      break;
  }
  
  if (hasRuleFlag(allRules, 'placeAllianceAlertsInAllianceSpace')) {
    specialRules.push({ source: 'story', title: 'Alliance Space Lockdown', content: ['Place an ', { type: 'action', content: 'Alliance Alert Token' }, ' on ', { type: 'strong', content: 'every planetary sector in Alliance Space' }, '.'] });
  }
  
  if (hasRuleFlag(allRules, 'placeMixedAlertTokens')) {
    specialRules.push({ source: 'story', title: 'Verse-Wide Tension', content: ['Place ', { type: 'strong', content: '3 Alliance Alert Tokens' }, " in the 'Verse:", { type: 'list', items: [['1 in ', { type: 'strong', content: 'Alliance Space' }], ['1 in ', { type: 'strong', content: 'Border Space' }], ['1 in ', { type: 'strong', content: 'Rim Space' }]] }] });
  }
  
  // --- Process Alliance Cruiser placement ---
  const finalAlliancePlacement = allianceMode === 'extra_cruisers' ? "Place a Cruiser at Regulus AND Persephone." : standardAlliancePlacement;
  if (finalAlliancePlacement !== standardAlliancePlacement) {
    allianceOverride = {
        // FIX: Use mapping function to prevent type error.
        source: mapRuleSourceToBlockSource(allianceModeRule?.source || 'setupCard'),
        title: 'Alliance Cruiser Placement Override',
        content: [finalAlliancePlacement]
    };
  }

  // --- Process Reaver Cutter placement ---
  const huntForTheArcRule = allRules.find(
    (r): r is AddFlagRule => r.type === 'addFlag' && r.flag === 'huntForTheArcReaverPlacement'
  );
  const hasBlueSunReavers = hasRuleFlag(allRules, 'blueSunReaverPlacement');
  
  let finalReaverPlacement: string;
  let reaverOverrideSource: RuleSourceType = 'expansion';
  let reaverOverrideTitle = 'Reaver Placement';
  
  if (huntForTheArcRule) {
      reaverOverrideSource = huntForTheArcRule.source;
      reaverOverrideTitle = 'Special Reaver Placement';
      const storyReavers = huntForTheArcRule.reaverShipCount || 1;
      const totalReavers = hasBlueSunReavers ? 3 : 1;
      const remainingReavers = totalReavers - storyReavers;
      
      const placementParts = [
          `Place ${storyReavers} Reaver ship in the Border Space sector directly below Valentine.`
      ];
      
      if (remainingReavers > 0) {
          placementParts.push(`Place the remaining ${remainingReavers} Cutter(s) in the border sectors closest to Miranda.`);
      }
      finalReaverPlacement = placementParts.join(' ');

  } else if (hasBlueSunReavers) {
      reaverOverrideTitle = 'Blue Sun Reavers';
      finalReaverPlacement = "Place 3 Cutters in the border sectors closest to Miranda.";
  } else {
      finalReaverPlacement = standardReaverPlacement;
  }

  if (finalReaverPlacement !== standardReaverPlacement) {
    reaverOverride = {
        // FIX: Use mapping function to prevent type error.
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
    // FIX: Add final resolved placement strings to the return object to satisfy legacy tests.
    alliancePlacement: finalAlliancePlacement,
    reaverPlacement: finalReaverPlacement,
  };
};