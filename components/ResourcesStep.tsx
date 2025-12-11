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
      <div className="bg-white dark:bg-slate-900/80 p-4 rounded-lg border border-gray-200 dark:border-slate-700 shadow-sm flex items-center justify-between transition-colors duration-300">
        <div>
          <h4 className="font-bold text-gray-700 dark:text-gray-200">Credits</h4>
          {bonusCredits > 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">Base ${overrides.startingCredits || 3000} + Bonus ${bonusCredits}</p>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">Standard Allocation</p>
          )}
        </div>
        <div className="text-3xl font-bold text-green-700 dark:text-green-400 font-western drop-shadow-sm">${totalCredits}</div>
      </div>

      <div className={`p-4 rounded-lg border shadow-sm flex items-center justify-between transition-colors duration-300 ${noFuelParts ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'bg-white dark:bg-slate-900/80 border-gray-200 dark:border-slate-700'}`}>
        <div>
          <h4 className={`font-bold ${noFuelParts ? 'text-red-800 dark:text-red-300' : 'text-gray-700 dark:text-gray-200'}`}>Fuel & Parts</h4>
          {noFuelParts && <p className="text-xs text-red-600 dark:text-red-400 font-bold mt-1">DISABLED BY STORY CARD</p>}
        </div>
        <div className="text-right">
          {noFuelParts ? (
            <span className="text-xl font-bold text-red-800 dark:text-red-400">None</span>
          ) : (
            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
              <div className="bg-yellow-100 dark:bg-yellow-900/40 px-2 py-1 rounded mb-1 text-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800">{customFuel ?? 6} Fuel Tokens</div>
              <div className="bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-slate-600">2 Part Tokens</div>
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