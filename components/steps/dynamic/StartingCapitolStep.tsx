import React from 'react';
import { Step } from '../../../types';
import { calculateStartingResources, getCreditsLabel } from '../../../utils/resources';
import { useTheme } from '../../ThemeContext';
import { useGameState } from '../../../hooks/useGameState';
import { STORY_CARDS } from '../../../data/storyCards';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

interface StartingCapitolStepProps {
  step: Step;
}

export const StartingCapitolStep = ({ step }: StartingCapitolStepProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

  const resourceDetails = calculateStartingResources(activeStoryCard, overrides);
  const { totalCredits, bonusCredits } = resourceDetails;
  const { startingCreditsOverride } = activeStoryCard.setupConfig || {};

  const panelBg = isDark ? 'bg-black/60' : 'bg-white';
  const panelBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const numberColor = isDark ? 'text-green-400' : 'text-green-700';
  const subText = isDark ? 'text-gray-400' : 'text-gray-600';

  return (
    <div className="space-y-4">
       {startingCreditsOverride !== undefined ? (
        <SpecialRuleBlock source="story" title="Credits Override">
          Your crew begins with <strong>${startingCreditsOverride.toLocaleString()}</strong>.
        </SpecialRuleBlock>
      ) : bonusCredits > 0 && (
        <SpecialRuleBlock source="story" title="Bonus Credits">
          Receive a bonus of <strong>${bonusCredits.toLocaleString()} credits</strong>.
        </SpecialRuleBlock>
      )}

      <div className={`text-center p-8 rounded-lg border shadow-sm transition-colors duration-300 ${panelBg} ${panelBorder}`}>
        <p className={`text-lg font-bold mb-2 ${textColor}`}>Each Player's Starting Capitol</p>
        <div className={`text-5xl font-bold font-western my-4 ${numberColor}`}>${totalCredits.toLocaleString()}</div>
        <p className={`text-sm ${subText}`}>{getCreditsLabel(resourceDetails, overrides, activeStoryCard)}</p>
      </div>
    </div>
  );
};