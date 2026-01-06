import React, { useMemo } from 'react';
import { StructuredContent, SpecialRule } from '../types';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { getNavDeckDetails } from '../utils/nav';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';

export const NavDeckStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const overrides = useMemo(() => step.overrides || {}, [step.overrides]);
  
  const { 
    forceReshuffle,
    clearerSkies, 
    showStandardRules, 
    isHighPlayerCount,
    specialRules,
    hasRimDecks,
  } = useMemo(() => getNavDeckDetails(gameState, overrides), [gameState, overrides]);

  const sortedSpecialRules = useMemo(() => {
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1,
        setupCard: 2,
        story: 3,
        warning: 3,
        info: 4,
    };
    return [...specialRules].sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));
  }, [specialRules]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const panelBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const panelText = isDark ? 'text-gray-300' : 'text-gray-800';

  const forcedReshuffleContent: StructuredContent = [
    { type: 'paragraph', content: ['Place the ', { type: 'action', content: '"RESHUFFLE"' }, ' cards in their Nav Decks.'] }
  ];
  if (hasRimDecks) {
    forcedReshuffleContent.push({ type: 'paragraph', content: ["This applies to all active decks (including Rim Space)."] });
  }

  let reshuffleInstruction = '';
  if (showStandardRules) {
    if (isHighPlayerCount) {
      reshuffleInstruction = 'Place the "RESHUFFLE" card in the Discard Pile of each Nav Deck.';
    } else {
      reshuffleInstruction = 'Shuffle the "RESHUFFLE" cards directly into each Nav Deck.';
    }
  }

  return (
    <div className="space-y-4">
      {sortedSpecialRules
        .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
        .map((rule, i) => (
          <SpecialRuleBlock key={i} {...rule} />
      ))}

      <div className={cls(panelBg, "p-6 rounded-lg border shadow-sm overflow-hidden transition-colors duration-300 space-y-4", panelBorder)}>
        {showStandardRules && (
          <div className={cls(panelText, "space-y-2")}>
            <p>Shuffle the Alliance and Border Nav Decks separately.</p>
            <p>
              <span className={cls("font-bold border-b border-dotted", isDark ? 'border-zinc-500' : 'border-gray-400')}>
                For {gameState.playerCount} player{gameState.playerCount > 1 ? 's' : ''}:
              </span>
              {' '}
              {reshuffleInstruction}
            </p>
          </div>
        )}
        
        {forceReshuffle && (
          <SpecialRuleBlock source="setupCard" title="Forced Reshuffle" content={forcedReshuffleContent} />
        )}

        {clearerSkies && (
          <SpecialRuleBlock source="setupCard" title="Clearer Skies" page={6} manual="C&P" content={[
            { type: 'strong', content: 'Clearer Skies Rule:' }, ' When initiating a ', { type: 'action', content: 'Full Burn' }, ', roll a die. The result is how many sectors you may move before you start drawing Nav Cards.',
            { type: 'br' },
            "Note: You may not move farther than your Drive Core's range, regardless of the die roll."
          ]} />
        )}
      </div>
    </div>
  );
};