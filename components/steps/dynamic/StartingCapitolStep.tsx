
import React from 'react';
import { GameState, Step } from '../../../types';
import { STORY_CARDS } from '../../../constants';
import { calculateStartingResources } from '../../../utils';
import { useTheme } from '../../ThemeContext';

interface StartingCapitolStepProps {
  step: Step;
  gameState: GameState;
}

export const StartingCapitolStep: React.FC<StartingCapitolStepProps> = ({ step, gameState }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

  const { totalCredits, bonusCredits } = calculateStartingResources(activeStoryCard, overrides);

  const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const numberColor = isDark ? 'text-green-400' : 'text-green-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`text-center p-8 rounded-lg border shadow-sm transition-colors duration-300 ${panelBg} ${panelBorder}`}>
      <p className={`text-lg mb-2 ${textColor}`}>Each player receives:</p>
      <div className={`text-5xl font-bold font-western my-4 ${numberColor}`}>${totalCredits}</div>
      {bonusCredits > 0 && <p className={`text-sm ${subText}`}>(Includes ${bonusCredits} Story Bonus)</p>}
    </div>
  );
};
