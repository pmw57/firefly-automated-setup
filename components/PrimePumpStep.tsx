import React, { useMemo } from 'react';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { usePrimeDetails } from '../hooks/usePrimeDetails';
import { StepComponentProps } from './StepContent';
import { SpecialRule } from '../types';
import { cls } from '../utils/style';

export const PrimePumpStep: React.FC<StepComponentProps> = ({ step }) => {
  const { state: gameState } = useGameState();
  const overrides = React.useMemo(() => step.overrides || {}, [step.overrides]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    baseDiscard,
    finalCount,
    isHighSupplyVolume,
    isBlitz,
    specialRules,
    hasStartWithAlertCard,
  } = usePrimeDetails(overrides);
  
  const allInfoBlocks = useMemo(() => {
    const blocks: SpecialRule[] = [...specialRules];

    // Check if a story already provides a custom 'prime' rule to avoid redundant messages.
    const hasStoryPrimeOverride = specialRules.some(r => r.source === 'story');

    if (isHighSupplyVolume && gameState.optionalRules.highVolumeSupply) {
      blocks.push({ source: 'info', title: 'House Rule Active: High Volume Supply', content: [{ type: 'paragraph', content: ["Due to the number of large supply expansions, the base discard count for Priming the Pump is increased to 4 cards."] }] });
    }

    if (isBlitz && !hasStoryPrimeOverride) {
      blocks.push({ source: 'setupCard', title: 'The Blitz: Double Dip', page: 22, manual: 'Core', content: [{ type: 'paragraph', content: [`"Double Dip" rules are in effect. Discard the top ${baseDiscard * 2} cards (2x Base) from each deck.`] }] });
    }
    
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1,
        setupCard: 2,
        story: 3,
        warning: 3,
        info: 4,
    };

    return blocks
      .sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99))
      .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
      .map((rule, i) => <OverrideNotificationBlock key={`rule-${i}`} {...rule} />);
  }, [
    isHighSupplyVolume, gameState.optionalRules.highVolumeSupply, isBlitz, 
    specialRules, gameState.setupMode, baseDiscard
  ]);

  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-[#faf8ef]/70 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const titleColor = isDark ? 'text-white' : 'text-[#292524]';
  const iconColor = isDark ? 'text-gray-600' : 'text-[#a8a29e]';
  const textColor = isDark ? 'text-gray-300' : 'text-[#57534e]';
  
  const highlightBg = isDark ? 'bg-green-900/30 border-green-800' : 'bg-[#e6ddc5] border-[#d6cbb0]';
  const numberColor = isDark ? 'text-green-400' : 'text-[#7f1d1d]';
  const labelColor = isDark ? 'text-green-300' : 'text-[#78350f]';
  const subTextColor = isDark ? 'text-gray-400' : 'text-[#a8a29e]';

  return (
    <div className="space-y-4">
      {allInfoBlocks}
      
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

        {hasStartWithAlertCard && (
          <div className={cls("mt-6 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-stone-200')}>
            <h4 className={cls("font-bold text-lg", isDark ? 'text-blue-300' : 'text-blue-800')}>Alliance Alert</h4>
            <p className={cls("text-sm mt-1", textColor)}>
              Reveal one <strong>Alliance Alert Card</strong> from the deck and put it into play.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};