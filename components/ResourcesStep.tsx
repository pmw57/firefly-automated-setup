import React, { useState, useEffect } from 'react';
import { Step } from '../types';
import { calculateStartingResources, getCreditsLabel } from '../utils/resources';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { STORY_CARDS } from '../data/storyCards';
import { hasFlag } from '../utils/data';
import { ConflictResolver } from './ConflictResolver';
import { ActionType } from '../state/actions';

interface ResourcesStepProps {
  step: Step;
}

export const ResourcesStep: React.FC<ResourcesStepProps> = ({ step }) => {
  const { state: gameState, dispatch } = useGameState();
  const overrides = React.useMemo(() => step.overrides || {}, [step.overrides]);
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [manualSelection, setManualSelection] = useState<'story' | 'setupCard'>('story');
  
  const resourceDetails = React.useMemo(() => 
    calculateStartingResources(gameState, activeStoryCard, overrides, manualSelection),
    [gameState, activeStoryCard, overrides, manualSelection]
  );
  
  const { totalCredits, noFuelParts, customStartingFuel, conflict } = resourceDetails;

  useEffect(() => {
    if (totalCredits !== gameState.finalStartingCredits) {
        dispatch({ type: ActionType.SET_FINAL_STARTING_CREDITS, payload: totalCredits });
    }
  }, [totalCredits, dispatch, gameState.finalStartingCredits]);
  
  const showConflictUI = conflict && gameState.optionalRules.resolveConflictsManually;
  
  const startWithWarrant = hasFlag(activeStoryCard?.setupConfig, 'startWithWarrant');
  const removeRiver = hasFlag(activeStoryCard?.setupConfig, 'removeRiver');
  const nandiCrewDiscount = hasFlag(activeStoryCard?.setupConfig, 'nandiCrewDiscount');
  const startWithGoalToken = hasFlag(activeStoryCard?.setupConfig, 'startWithGoalToken');
  const { startingWarrantCount } = activeStoryCard?.setupConfig || {};
  
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

  return (
    <div className="space-y-4">
      {showConflictUI && conflict && (
        <ConflictResolver
          title="Starting Credits Conflict"
          conflict={{
            story: { value: `$${conflict.story.value.toLocaleString()}`, label: conflict.story.label },
            setupCard: { value: `$${conflict.setupCard.value.toLocaleString()}`, label: conflict.setupCard.label }
          }}
          selection={manualSelection}
          onSelect={setManualSelection}
        />
      )}

      {!showConflictUI && (resourceDetails.bonusCredits > 0 || activeStoryCard?.setupConfig?.startingCreditsOverride !== undefined) && (
        <SpecialRuleBlock source="story" title={activeStoryCard?.setupConfig?.startingCreditsOverride !== undefined ? "Credits Override" : "Bonus Credits"}>
           Your crew begins with <strong>${totalCredits.toLocaleString()}</strong>.
        </SpecialRuleBlock>
      )}


      <div className={`${cardBg} p-4 rounded-lg border ${cardBorder} shadow-sm flex items-center justify-between transition-colors duration-300`}>
        <div>
          <h4 className={`font-bold ${textColor}`}>Credits</h4>
          <p className={`text-sm ${subTextColor}`}>
            {getCreditsLabel(resourceDetails, overrides, activeStoryCard, showConflictUI ? manualSelection : undefined)}
          </p>
        </div>
        <div className={`text-3xl font-bold font-western drop-shadow-sm ${creditColor}`}>${totalCredits.toLocaleString()}</div>
      </div>
      
      {customStartingFuel !== undefined && !noFuelParts && (
        <SpecialRuleBlock source="story" title="Fuel Override">
            Your crew begins with <strong>{customStartingFuel} Fuel Tokens</strong> instead of the standard 6.
        </SpecialRuleBlock>
      )}

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
              <div className={`px-2 py-1 rounded mb-1 border ${fuelBadgeBg}`}>{customStartingFuel ?? 6} Fuel Tokens</div>
              <div className={`px-2 py-1 rounded border ${partsBadgeBg}`}>2 Part Tokens</div>
            </div>
          )}
        </div>
      </div>

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

      {(startWithWarrant || (startingWarrantCount && startingWarrantCount > 0)) && (
        <SpecialRuleBlock source="story" title="Warrant Issued">
          Each player begins the game with <strong>{startingWarrantCount || 1} Warrant Token{startingWarrantCount !== 1 ? 's' : ''}</strong>.
        </SpecialRuleBlock>
      )}

      {startWithGoalToken && (
        <SpecialRuleBlock source="story" title="Story Override">
          Begin play with <strong>1 Goal Token</strong>.
        </SpecialRuleBlock>
      )}
    </div>
  );
};