import { 
    GameState, 
    StepOverrides, 
    AllianceReaverDetails, 
    SpecialRule, 
    SetAllianceModeRule,
    AddFlagRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';

export const getAllianceReaverDetails = (gameState: GameState, stepOverrides: StepOverrides): AllianceReaverDetails => {
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];
  
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

  const alliancePlacement = allianceMode === 'extra_cruisers' ? "Place a Cruiser at Regulus AND Persephone." : "Place the Cruiser at Londinium.";
  
  const huntForTheArcRule = allRules.find(
    (r): r is AddFlagRule => r.type === 'addFlag' && r.flag === 'huntForTheArcReaverPlacement'
  );

  const hasBlueSunReavers = hasRuleFlag(allRules, 'blueSunReaverPlacement');
  const totalReavers = hasBlueSunReavers ? 3 : 1;
  let reaverPlacement: string;

  if (huntForTheArcRule) {
      const storyReavers = huntForTheArcRule.reaverShipCount || 1;
      const remainingReavers = totalReavers - storyReavers;
      
      const placementParts = [
          `Hunt For The Arc Placement: Place ${storyReavers} Reaver ship in the Border Space sector directly below Valentine.`
      ];
      
      if (remainingReavers > 0) {
          // Standard Blue Sun rule for the rest
          placementParts.push(`Place the remaining ${remainingReavers} Cutter(s) in the border sectors closest to Miranda.`);
      }
      reaverPlacement = placementParts.join(' ');

  } else {
      reaverPlacement = hasBlueSunReavers
          ? "Place 3 Cutters in the border sectors closest to Miranda." 
          : "Place 1 Cutter at the Firefly logo (Regina/Osiris).";
  }

  return { specialRules, alliancePlacement, reaverPlacement };
};