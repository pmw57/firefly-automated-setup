
import React from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS } from '../constants';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';

interface PrimePumpStepProps {
  step: Step;
  gameState: GameState;
}

export const PrimePumpStep: React.FC<PrimePumpStepProps> = ({ step, gameState }) => {
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const multiplier = activeStoryCard.setupConfig?.primingMultiplier || 1;
  const isBlitz = overrides.blitzPrimeMode;

  // Base Discard Count Logic
  let baseDiscard = 3;
  if (gameState.expansions.blue || gameState.expansions.kalidasa || gameState.expansions.pirates) {
    baseDiscard = 4;
  }

  // Blitz Override ("Double Dip" logic is roughly x2 but explicitly "top 6")
  let finalCount = baseDiscard * multiplier;
  
  if (isBlitz) {
    finalCount = 6;
  }

  const cardBg = isDark ? 'bg-black/60' : 'bg-white';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const titleColor = isDark ? 'text-white' : 'text-gray-800';
  const iconColor = isDark ? 'text-gray-600' : 'text-gray-300';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  
  const highlightBg = isDark ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200';
  const numberColor = isDark ? 'text-green-400' : 'text-green-700';
  const labelColor = isDark ? 'text-green-300' : 'text-green-800';
  const subTextColor = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="space-y-4">
      {isBlitz && (
        <SpecialRuleBlock source="setupCard" title="Setup Card Override">
          <strong>The Blitz:</strong> "Double Dip" rules are in effect. Discard the top <strong>6 cards</strong> from each deck instead of the standard amount.
        </SpecialRuleBlock>
      )}

      {multiplier > 1 && !isBlitz && (
        <SpecialRuleBlock source="story" title="Story Override">
          <strong>{activeStoryCard.title}:</strong> Prime counts are increased by {multiplier}x.
        </SpecialRuleBlock>
      )}

      <div className={`${cardBg} p-6 rounded-lg border ${cardBorder} shadow-sm text-center transition-colors duration-300`}>
        <h4 className={`font-bold text-xl font-western mb-4 ${titleColor}`}>Priming The Pump</h4>
        <div className={`text-5xl font-bold mb-4 ${iconColor}`}>🃏</div>
        <p className={`text-lg ${textColor}`}>
          Shuffle all Supply Decks.
        </p>
        <div className={`my-6 p-4 rounded-lg inline-block border ${highlightBg}`}>
          <span className={`block text-4xl font-bold mb-1 ${numberColor}`}>{finalCount}</span>
          <span className={`text-sm font-bold uppercase tracking-wide ${labelColor}`}>Cards Discarded</span>
        </div>
        <p className={`text-sm italic ${subTextColor}`}>
          (From the top of each Supply Deck)
        </p>
      </div>
    </div>
  );
};
