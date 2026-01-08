import React, { useMemo } from 'react';
import { SpecialRule } from '../types';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { useNavDeckDetails } from '../hooks/useNavDeckDetails';
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
  } = useNavDeckDetails(overrides);

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
  
  const forcedReshuffleInstruction = `Place the "RESHUFFLE" cards in their Nav Decks.${hasRimDecks ? " This applies to all active decks (including Rim Space)." : ""}`;

  let standardReshuffleInstruction = '';
  if (showStandardRules) {
    if (isHighPlayerCount) {
      standardReshuffleInstruction = 'Place the "RESHUFFLE" card in the Discard Pile of each Nav Deck.';
    } else {
      standardReshuffleInstruction = 'Shuffle the "RESHUFFLE" cards directly into each Nav Deck.';
    }
  }

  return (
    <div className="space-y-4">
      {sortedSpecialRules
        .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
        .map((rule, i) => (
          <OverrideNotificationBlock key={i} {...rule} />
      ))}

      <div className={cls(panelBg, "p-6 rounded-lg border shadow-sm overflow-hidden transition-colors duration-300 space-y-4", panelBorder)}>
        <div className={cls(panelText, "space-y-2")}>
          <p>Shuffle the Alliance and Border Nav Decks separately.</p>
          
          {showStandardRules && (
            <p>
              <span className={cls("font-bold border-b border-dotted", isDark ? 'border-zinc-500' : 'border-gray-400')}>
                For {gameState.playerCount} player{gameState.playerCount > 1 ? 's' : ''}:
              </span>
              {' '}
              {standardReshuffleInstruction}
            </p>
          )}
          
          {forceReshuffle && (
            <p className="font-bold">
              {forcedReshuffleInstruction}
            </p>
          )}
        </div>
        
        {clearerSkies && (
          <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-stone-200')}>
            <h4 className="font-bold text-lg text-sky-800 dark:text-sky-300">Clearer Skies Rule</h4>
            <p className={cls("text-sm mt-1", panelText)}>
              When initiating a <strong className="font-semibold">Full Burn</strong>, roll a die. The result is how many sectors you may move before you start drawing Nav Cards.
            </p>
            <p className="text-xs mt-2 italic text-gray-500 dark:text-gray-400">
              Note: You may not move farther than your Drive Core's range, regardless of the die roll.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};