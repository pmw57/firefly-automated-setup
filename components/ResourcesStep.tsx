import React, { useState, useEffect } from 'react';
import { Step } from '../types';
import { getResourceDetails, getActiveStoryCard } from '../utils/selectors';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { hasFlag } from '../utils/data';
import { ConflictResolver } from './ConflictResolver';
import { ActionType } from '../state/actions';
import { cls } from '../utils/style';

interface ResourcesStepProps {
  step: Step;
}

export const ResourcesStep: React.FC<ResourcesStepProps> = () => {
  const { state: gameState, dispatch } = useGameState();
  const activeStoryCard = getActiveStoryCard(gameState);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [manualSelection, setManualSelection] = useState<'story' | 'setupCard'>('story');
  
  const resourceDetails = React.useMemo(() => 
    getResourceDetails(gameState, manualSelection),
    [gameState, manualSelection]
  );
  
  const { credits, fuel, parts, warrants, goalTokens, isFuelDisabled, isPartsDisabled, conflict, creditModifications } = resourceDetails;

  useEffect(() => {
    if (credits !== gameState.finalStartingCredits) {
        dispatch({ type: ActionType.SET_FINAL_STARTING_CREDITS, payload: credits });
    }
  }, [credits, dispatch, gameState.finalStartingCredits]);
  
  const showConflictUI = conflict && gameState.optionalRules.resolveConflictsManually;
  
  const removeRiver = hasFlag(activeStoryCard?.setupConfig, 'removeRiver');
  const nandiCrewDiscount = hasFlag(activeStoryCard?.setupConfig, 'nandiCrewDiscount');
  
  const cardBg = isDark ? 'bg-black/60' : 'bg-white';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-700';
  const creditColor = isDark ? 'text-green-400' : 'text-green-700';
  const modsBorder = isDark ? 'border-zinc-700/50' : 'border-gray-200';
  const modsText = isDark ? 'text-gray-400' : 'text-gray-600';

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
            story: { value: `$${conflict.story.value.toLocaleString()}`, label: conflict.story.source.name },
            setupCard: { value: `$${conflict.setupCard.value.toLocaleString()}`, label: conflict.setupCard.source.name }
          }}
          selection={manualSelection}
          onSelect={setManualSelection}
        />
      )}

      <div className={`${cardBg} p-4 rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300`}>
        <div className="flex items-start justify-between">
          <div>
            <h4 className={`font-bold ${textColor}`}>Starting Credits</h4>
            <div className={`text-xs mt-1 border-t ${modsBorder} pt-1 ${modsText}`}>
                {creditModifications.map((mod, i) => (
                  <div key={i} className="flex justify-between w-64 gap-2">
                    <span>{mod.description}</span>
                    <span className="font-mono">{mod.value}</span>
                  </div>
                ))}
            </div>
          </div>
          <div className={`text-3xl font-bold font-western drop-shadow-sm ${creditColor}`}>${credits.toLocaleString()}</div>
        </div>
      </div>
      
      <div className={`p-4 rounded-lg border shadow-sm flex items-center justify-between transition-colors duration-300 ${isFuelDisabled || isPartsDisabled ? disabledBg : `${cardBg} ${cardBorder}`}`}>
        <div>
          <h4 className={`font-bold ${isFuelDisabled || isPartsDisabled ? disabledTitle : textColor}`}>Fuel & Parts</h4>
          {(isFuelDisabled || isPartsDisabled) && <p className={`text-xs font-bold mt-1 ${disabledSub}`}>DISABLED</p>}
        </div>
        <div className="text-right">
          {(isFuelDisabled || isPartsDisabled) ? (
            <span className={`text-xl font-bold ${disabledValue}`}>None</span>
          ) : (
            <div className={`text-sm font-bold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
              <div className={cls("px-2 py-1 rounded mb-1 border", fuel > 6 ? 'font-black' : '', fuelBadgeBg)}>{fuel} Fuel Tokens</div>
              <div className={cls("px-2 py-1 rounded border", parts > 2 ? 'font-black' : '', partsBadgeBg)}>{parts} Part Tokens</div>
            </div>
          )}
        </div>
      </div>
      
      {warrants > 0 && (
        <SpecialRuleBlock source="story" title="Warrant Issued" content={["Each player begins the game with ", { type: 'strong', content: `${warrants} Warrant Token${warrants > 1 ? 's' : ''}` }, "."]} />
      )}

      {goalTokens > 0 && (
        <SpecialRuleBlock source="story" title="Story Override" content={["Begin play with ", { type: 'strong', content: `${goalTokens} Goal Token${goalTokens > 1 ? 's' : ''}` }, "."]} />
      )}

      {removeRiver && (
        <SpecialRuleBlock source="story" title="Missing Person" content={["Remove ", { type: 'strong', content: "River Tam" }, " from play."]} />
      )}

      {nandiCrewDiscount && (
        <SpecialRuleBlock source="story" title="Hiring Bonus" content={["Nandi pays half price (rounded up) when hiring crew."]} />
      )}
    </div>
  );
};