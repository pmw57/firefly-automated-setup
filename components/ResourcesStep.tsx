import React from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS } from '../constants';
import { calculateStartingResources } from '../utils';
import { SpecialRuleBlock } from './SpecialRuleBlock';

interface ResourcesStepProps {
  step: Step;
  gameState: GameState;
}

export const ResourcesStep: React.FC<ResourcesStepProps> = ({ step, gameState }) => {
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  
  const { totalCredits, bonusCredits, noFuelParts, customFuel } = calculateStartingResources(activeStoryCard, overrides);
  const { startWithWarrant, startingWarrantCount, removeRiver, nandiCrewDiscount } = activeStoryCard.setupConfig || {};

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="font-bold text-gray-700">Credits</h4>
          {bonusCredits > 0 ? (
            <p className="text-sm text-gray-500">Base ${overrides.startingCredits || 3000} + Bonus ${bonusCredits}</p>
          ) : (
            <p className="text-sm text-gray-500">Standard Allocation</p>
          )}
        </div>
        <div className="text-3xl font-bold text-green-700 font-western">${totalCredits}</div>
      </div>

      <div className={`p-4 rounded-lg border shadow-sm flex items-center justify-between ${noFuelParts ? 'bg-red-50 border-red-200' : 'bg-white border-gray-200'}`}>
        <div>
          <h4 className={`font-bold ${noFuelParts ? 'text-red-800' : 'text-gray-700'}`}>Fuel & Parts</h4>
          {noFuelParts && <p className="text-xs text-red-600 font-bold mt-1">DISABLED BY STORY CARD</p>}
        </div>
        <div className="text-right">
          {noFuelParts ? (
            <span className="text-xl font-bold text-red-800">None</span>
          ) : (
            <div className="text-sm font-bold text-gray-800">
              <div className="bg-yellow-100 px-2 py-1 rounded mb-1">{customFuel ?? 6} Fuel Tokens</div>
              <div className="bg-gray-200 px-2 py-1 rounded">2 Part Tokens</div>
            </div>
          )}
        </div>
      </div>

      {/* Special Rule for Running On Empty or similar */}
      {noFuelParts && (
        <SpecialRuleBlock source="story" title="Market Scarcity">
          <strong>Market Update:</strong> Fuel costs $300 each (unless purchased from Harken for $100).
        </SpecialRuleBlock>
      )}

      {removeRiver && (
        <SpecialRuleBlock source="story" title="Missing Person">
          Remove <strong>River Tam</strong> from play.
        </SpecialRuleBlock>
      )}

      {nandiCrewDiscount && (
        <SpecialRuleBlock source="story" title="Hiring Bonus">
          Nandi pays half price (rounded up) when hiring crew.
        </SpecialRuleBlock>
      )}

      {/* Warrant Token Rule */}
      {(startWithWarrant || (startingWarrantCount && startingWarrantCount > 0)) && (
        <SpecialRuleBlock source="story" title="Warrant Issued">
          Each player begins the game with <strong>{startingWarrantCount || 1} Warrant Token{startingWarrantCount !== 1 ? 's' : ''}</strong>.
        </SpecialRuleBlock>
      )}
    </div>
  );
};