

import React from 'react';
import { Step } from '../types';
import { STORY_CARDS } from '../constants';
import { calculateStartingResources } from '../utils';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';

interface ResourcesStepProps {
  step: Step;
}

export const ResourcesStep: React.FC<ResourcesStepProps> = ({ step }) => {
  const { gameState } = useGameState();
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { totalCredits, bonusCredits, noFuelParts, customFuel } = calculateStartingResources(activeStoryCard, overrides);
  const { startWithWarrant, startingWarrantCount, removeRiver, nandiCrewDiscount, startWithGoalToken, startingCreditsOverride } = activeStoryCard.setupConfig || {};
  
  const cardBg = isDark ? 'bg-black/60' : 'bg-white';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-700';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-600';
  const creditColor = isDark ? 'text-green-400' : 'text-green-700';

  const disabledBg = isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200';
  const disabledTitle = isDark ? 'text-red-300' : 'text-red-800';
  const disabledSub = isDark ? 'text-red-400' : 'text-red-600';
  const disabledValue = isDark ? 'text-red-400' : 'text-red-800';

  const fuelBadgeBg = isDark ? 'bg-yellow-900/40 text-yellow-200 border-yellow-800' : 'bg-yellow-100 text-yellow-900 border-yellow-200';
  const partsBadgeBg = isDark ? 'bg-zinc-800 text-gray-200 border-zinc-700' : 'bg-gray-200 text-gray-800 border-gray-300';

  // Helper to determine the source description
  const getCreditsLabel = () => {
      if (startingCreditsOverride !== undefined) {
          return `Story Override (${activeStoryCard.title})`;
      }
      if (bonusCredits > 0) {
          return `Base $${overrides.startingCredits || 3000} + Bonus $${bonusCredits}`;
      }
      return "Standard Allocation";
  };

  return (
    <div className="space-y-4">
      <div className={`${cardBg} p-4 rounded-lg border ${cardBorder} shadow-sm flex items-center justify-between transition-colors duration-300`}>
        <div>
          <h4 className={`font-bold ${textColor}`}>Credits</h4>
          <p className={`text-sm ${subTextColor}`}>{getCreditsLabel()}</p>
        </div>
        <div className={`text-3xl font-bold font-western drop-shadow-sm ${creditColor}`}>${totalCredits}</div>
      </div>

      <div className={`p-4 rounded-lg border shadow-sm flex items-center justify-between transition-colors duration-300 ${noFuelParts ? disabledBg : `${cardBg} ${cardBorder}`}`}>
        <div>
          <h4 className={`font-bold ${noFuelParts ? disabledTitle : textColor}`}>Fuel & Parts</h4>
          {noFuelParts && <p className={`text-xs font-bold mt-1 ${disabledSub}`}>DISABLED BY STORY CARD</p>}
        </div>
        <div className="text-right">
          {noFuelParts ? (
            <span className={`text-xl font-bold ${disabledValue}`}>None</span>
          ) : (
            <div className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              <div className={`px-2 py-1 rounded mb-1 border ${fuelBadgeBg}`}>{customFuel ?? 6} Fuel Tokens</div>
              <div className={`px-2 py-1 rounded border ${partsBadgeBg}`}>2 Part Tokens</div>
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

      {/* Goal Token Rule */}
      {startWithGoalToken && (
        <SpecialRuleBlock source="story" title="Story Override">
          Begin play with <strong>1 Goal Token</strong>.
        </SpecialRuleBlock>
      )}
    </div>
  );
};