import React from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS } from '../constants';
import { SpecialRuleBlock } from './SpecialRuleBlock';

interface AllianceReaverStepProps {
  step: Step;
  gameState: GameState;
}

export const AllianceReaverStep: React.FC<AllianceReaverStepProps> = ({ step, gameState }) => {
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { placeAllianceAlertsInAllianceSpace, placeMixedAlertTokens, smugglersBluesSetup, startWithAlertCard, createAlertTokenStackMultiplier } = activeStoryCard.setupConfig || {};
  const useSmugglersRimRule = smugglersBluesSetup && gameState.expansions.blue && gameState.expansions.kalidasa;
  const alertStackCount = createAlertTokenStackMultiplier ? createAlertTokenStackMultiplier * gameState.playerCount : 0;

  const renderAction = (text: string) => <span className="font-bold border-b border-gray-400 border-dotted">{text}</span>;

  return (
    <div className="space-y-4">
      {overrides.noAlertTokens ? (
        <SpecialRuleBlock source="setupCard" title="Setup Card Override">
          <strong>Safe Skies:</strong> Do not use Reaver or Alliance Alert Tokens for this setup card.
        </SpecialRuleBlock>
      ) : overrides.awfulCrowdedAllianceMode && (
        <SpecialRuleBlock source="setupCard" title="Setup Card Override">
          <strong>Awful Crowded:</strong>
          <ul className="list-disc ml-4 space-y-1 mt-1">
            <li>Place an {renderAction("Alert Token")} in <strong>every planetary sector</strong>.</li>
            <li><strong>Alliance Space:</strong> Place Alliance Alert Tokens.</li>
            <li><strong>Border & Rim Space:</strong> Place Reaver Alert Tokens.</li>
            <li className="text-red-700 italic font-bold">Do not place Alert Tokens on players' starting locations.</li>
            <li><strong>Alliance Ship movement</strong> does not generate new Alert Tokens.</li>
            <li><strong>Reaver Ship movement</strong> generates new Alert Tokens.</li>
          </ul>
        </SpecialRuleBlock>
      )}

      {placeAllianceAlertsInAllianceSpace && (
        <SpecialRuleBlock source="story" title="Story Override">
          Place an {renderAction("Alliance Alert Token")} on <strong>every planetary sector in Alliance Space</strong>.
        </SpecialRuleBlock>
      )}

      {placeMixedAlertTokens && (
        <SpecialRuleBlock source="story" title="Story Override">
          Place <strong>3 Alliance Alert Tokens</strong> in the 'Verse:
          <ul className="list-disc ml-4 mt-1">
            <li>1 in <strong>Alliance Space</strong></li>
            <li>1 in <strong>Border Space</strong></li>
            <li>1 in <strong>Rim Space</strong></li>
          </ul>
        </SpecialRuleBlock>
      )}

      {alertStackCount > 0 && (
        <SpecialRuleBlock source="story" title="Story Override">
          Create a stack of <strong>{alertStackCount} Alliance Alert Tokens</strong> (3 per player).
        </SpecialRuleBlock>
      )}

      {smugglersBluesSetup && (
        <SpecialRuleBlock source="story" title="Story Override">
          {useSmugglersRimRule ? (
            <span>Place <strong>2 Contraband</strong> on each Planetary Sector in <strong>Rim Space</strong>.</span>
          ) : (
            <span>Place <strong>3 Contraband</strong> on each Planetary Sector in <strong>Alliance Space</strong>.</span>
          )}
        </SpecialRuleBlock>
      )}

      {startWithAlertCard && (
        <SpecialRuleBlock source="story" title="Story Override">
          Begin the game with one random Alliance Alert Card in play.
        </SpecialRuleBlock>
      )}

      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-4">
        <h3 className="text-lg font-bold text-gray-800 mb-3 font-western tracking-wide border-b-2 border-gray-100 pb-1">Standard Ship Placement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-blue-50 rounded border border-blue-100">
            <strong className="block text-blue-900 text-sm uppercase mb-1">Alliance Cruiser</strong>
            <p className="text-sm text-blue-800">
              {overrides.extraCruisers
                ? <span>Place a Cruiser at <strong>Regulus</strong> AND <strong>Persephone</strong>.</span>
                : <span>Place the Cruiser at <strong>Londinium</strong>.</span>}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded border border-red-100">
            <strong className="block text-red-900 text-sm uppercase mb-1">Reaver Cutter</strong>
            <p className="text-sm text-red-800">
              {gameState.expansions.blue
                ? <span>Place <strong>3 Cutters</strong> in the border sectors closest to <strong>Miranda</strong>.</span>
                : <span>Place <strong>1 Cutter</strong> at the <strong>Firefly logo</strong> (Regina/Osiris).</span>}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};