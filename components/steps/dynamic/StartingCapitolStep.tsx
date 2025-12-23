import React, { useState, useEffect } from 'react';
import { getResourceDetails } from '../../../utils/resources';
import { useTheme } from '../../ThemeContext';
import { useGameState } from '../../../hooks/useGameState';
import { ConflictResolver } from '../../ConflictResolver';
import { ActionType } from '../../../state/actions';
import { StepComponentProps } from '../../StepContent';

export const StartingCapitolStep: React.FC<StepComponentProps> = () => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [manualSelection, setManualSelection] = useState<'story' | 'setupCard'>('story');

  const resourceDetails = getResourceDetails(gameState, manualSelection);
  const { credits, conflict, creditModifications } = resourceDetails;

  useEffect(() => {
    if (credits !== gameState.finalStartingCredits) {
        dispatch({ type: ActionType.SET_FINAL_STARTING_CREDITS, payload: credits });
    }
  }, [credits, dispatch, gameState.finalStartingCredits]);
  
  const showConflictUI = conflict && gameState.optionalRules.resolveConflictsManually;
  
  const getCreditsLabel = (): string => {
    if (showConflictUI && conflict) {
        return manualSelection === 'setupCard'
            ? conflict.setupCard.label
            : conflict.story.label;
    }
    return creditModifications[0]?.description || "Allocation";
  };


  const panelBg = isDark ? 'bg-black/60' : 'bg-white';
  const panelBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const numberColor = isDark ? 'text-green-400' : 'text-green-700';
  const subText = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="space-y-4">
      {showConflictUI && conflict && (
        <ConflictResolver
          title="Starting Capitol Conflict"
          conflict={conflict}
          selection={manualSelection}
          onSelect={setManualSelection}
        />
      )}

      <div className={`text-center p-8 rounded-lg border shadow-sm transition-colors duration-300 ${panelBg} ${panelBorder}`}>
        <p className={`text-lg font-bold mb-2 ${textColor}`}>Each Player's Starting Capitol</p>
        <div className={`text-5xl font-bold font-western my-4 ${numberColor}`}>${credits.toLocaleString()}</div>
        <p className={`text-sm ${subText}`}>{getCreditsLabel()}</p>
      </div>
    </div>
  );
};