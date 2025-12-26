// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { 
    GameState, 
    StepOverrides, 
    AllianceReaverDetails, 
    SpecialRule, 
    CreateAlertTokenStackRule,
    SetAllianceModeRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';

export const getAllianceReaverDetails = (gameState: GameState, stepOverrides: StepOverrides): AllianceReaverDetails => {
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];
  
  const allianceModeRule = allRules.find(r => r.type === 'setAllianceMode') as SetAllianceModeRule | undefined;
  const allianceMode = allianceModeRule?.mode || stepOverrides.allianceMode;

  switch (allianceMode) {
    case 'no_alerts':
      specialRules.push({ source: 'setupCard', title: 'Setup Card Override', content: [{ type: 'strong', content: 'Safe Skies:' }, ' Do not place any Alert Tokens at the start of the game.'] });
      break;
    case 'awful_crowded':
      specialRules.push({
        source: 'setupCard', title: 'Setup Card Override',
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
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place an ', { type: 'action', content: 'Alliance Alert Token' }, ' on ', { type: 'strong', content: 'every planetary sector in Alliance Space' }, '.'] });
  }
  
  if (hasRuleFlag(allRules, 'placeMixedAlertTokens')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place ', { type: 'strong', content: '3 Alliance Alert Tokens' }, " in the 'Verse:", { type: 'list', items: [['1 in ', { type: 'strong', content: 'Alliance Space' }], ['1 in ', { type: 'strong', content: 'Border Space' }], ['1 in ', { type: 'strong', content: 'Rim Space' }]] }] });
  }

  const createAlertTokenStackRule = allRules.find(r => r.type === 'createAlertTokenStack') as CreateAlertTokenStackRule | undefined;
  if (createAlertTokenStackRule) {
    const alertStackCount = createAlertTokenStackRule.multiplier * gameState.playerCount;
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Create a stack of ', { type: 'strong', content: `${alertStackCount} Alliance Alert Tokens` }, ` (${createAlertTokenStackRule.multiplier} per player).`] });
  }

  const smugglersBluesSetup = hasRuleFlag(allRules, 'smugglersBluesSetup');
  if (smugglersBluesSetup) {
    const useSmugglersRimRule = smugglersBluesSetup && gameState.expansions.blue && gameState.expansions.kalidasa;
    specialRules.push({ source: 'story', title: 'Story Override', content: useSmugglersRimRule 
      ? ['Place ', { type: 'strong', content: '2 ' }, 'Contraband on each Planetary Sector in ', { type: 'strong', content: 'Rim Space' }, '.']
      : ['Place ', { type: 'strong', content: '3 ' }, 'Contraband on each Planetary Sector in ', { type: 'strong', content: 'Alliance Space' }, '.'] });
  }
  
  if (hasRuleFlag(allRules, 'lonelySmugglerSetup')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place ', { type: 'strong', content: '3 ' }, 'Contraband on each Supply Planet ', { type: 'strong', content: 'except Persephone and Space Bazaar' }, '.'] });
  }

  if (hasRuleFlag(allRules, 'startWithAlertCard')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Begin the game with one random Alliance Alert Card in play.'] });
  }

  const alliancePlacement = allianceMode === 'extra_cruisers' ? "Place a Cruiser at Regulus AND Persephone." : "Place the Cruiser at Londinium.";
  const reaverPlacement = gameState.expansions.blue ? "Place 3 Cutters in the border sectors closest to Miranda." : "Place 1 Cutter at the Firefly logo (Regina/Osiris).";

  return { specialRules, alliancePlacement, reaverPlacement };
};