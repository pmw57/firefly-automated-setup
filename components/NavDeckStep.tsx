

import React, { useMemo } from 'react';
import { StructuredContent } from '../types';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { getNavDeckDetails } from '../utils/nav';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';

// Sub-component for Reshuffle Rules display
const ReshuffleRulesDisplay = ({ isSolo, isHighPlayerCount, playerCount }: { isSolo: boolean, isHighPlayerCount: boolean, playerCount: number }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
  
    const reshuffleBg = isDark ? 'bg-zinc-900' : 'bg-gray-200';
    const reshuffleBorder = isDark ? 'border-zinc-800' : 'border-gray-300';
    const reshuffleHeader = isDark ? 'text-zinc-500' : 'text-gray-800';
    
    const activeBg = isDark ? 'bg-green-900/20 border-green-600' : 'bg-green-50 border-green-600';
    const inactiveBg = isDark ? 'bg-black/40 border-zinc-800 opacity-50 grayscale' : 'bg-gray-50 border-gray-200 opacity-50 grayscale';
    const activeTitle = isDark ? 'text-green-400' : 'text-green-900';
    const inactiveTitle = isDark ? 'text-zinc-500' : 'text-gray-500';
    const activeBadgeBg = isDark ? 'bg-green-900 text-green-200' : 'bg-green-200 text-green-800';
    const activeText = isDark ? 'text-green-300' : 'text-green-900';
    const inactiveText = isDark ? 'text-zinc-500' : 'text-gray-600';
    const dividerBorder = isDark ? 'border-t-zinc-800' : 'border-t-gray-200';
  
    if (isSolo) {
        return (
            <div className={cls("border rounded-lg overflow-hidden shadow-sm transition-colors duration-300", reshuffleBorder)}>
                <div className={cls(reshuffleBg, "px-4 py-2 text-xs font-bold uppercase tracking-wider border-b", reshuffleBorder, reshuffleHeader)}>
                    Reshuffle Card Rules
                </div>
                <div className={cls("p-4 border-l-4 transition-all duration-300", activeBg)}>
                    <div className={cls("text-sm", activeText)}>Shuffle the "RESHUFFLE" cards into the deck.</div>
                </div>
            </div>
        );
    }
  
    return (
        <div className={cls("border rounded-lg overflow-hidden shadow-sm transition-colors duration-300", reshuffleBorder)}>
          <div className={cls(reshuffleBg, "px-4 py-2 text-xs font-bold uppercase tracking-wider border-b", reshuffleBorder, reshuffleHeader)}>
            Reshuffle Card Rules (Player Count: {playerCount})
          </div>
          
          <div className={cls("p-4 border-l-4 transition-all duration-300", !isHighPlayerCount ? activeBg : inactiveBg)}>
            <div className="flex justify-between items-center mb-1">
              <div className={cls("font-bold", !isHighPlayerCount ? activeTitle : inactiveTitle)}>1-2 Players</div>
              {!isHighPlayerCount && <span className={cls("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide", activeBadgeBg)}>Active</span>}
            </div>
            <div className={cls("text-sm", !isHighPlayerCount ? activeText : inactiveText)}>Shuffle the "RESHUFFLE" cards into the deck.</div>
          </div>
  
          <div className={cls("p-4 border-l-4 border-t transition-all duration-300", isHighPlayerCount ? activeBg : inactiveBg, dividerBorder)}>
            <div className="flex justify-between items-center mb-1">
              <div className={cls("font-bold", isHighPlayerCount ? activeTitle : inactiveTitle)}>3+ Players</div>
              {isHighPlayerCount && <span className={cls("text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide", activeBadgeBg)}>Active</span>}
            </div>
            <div className={cls("text-sm", isHighPlayerCount ? activeText : inactiveText)}>
                Place the "RESHUFFLE" card in the Discard Pile of <em>each</em> Nav Deck.
            </div>
          </div>
        </div>
    );
};

export const NavDeckStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const overrides = useMemo(() => step.overrides || {}, [step.overrides]);
  
  const { 
    forceReshuffle,
    clearerSkies, 
    showStandardRules, 
    isSolo, 
    isHighPlayerCount,
    specialRules,
    hasRimDecks,
  } = useMemo(() => getNavDeckDetails(gameState, overrides), [gameState, overrides]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const panelBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const panelText = isDark ? 'text-gray-300' : 'text-gray-800';

  const forcedReshuffleContent: StructuredContent = [
    { type: 'paragraph', content: ['Place the ', { type: 'action', content: '"RESHUFFLE"' }, ' cards in the Nav Decks at the start of the game, regardless of the number of players.'] }
  ];
  if (hasRimDecks) {
    forcedReshuffleContent.push({ type: 'paragraph', content: ["This applies to all active decks (including Rim Space)."] });
  }

  return (
    <div className="space-y-4">
      {specialRules.map((rule, i) => (
        <SpecialRuleBlock key={i} {...rule} />
      ))}

      <div className={cls(panelBg, "p-6 rounded-lg border shadow-sm overflow-hidden transition-colors duration-300 space-y-4", panelBorder)}>
        {showStandardRules && (
          <p className={cls(panelText)}><span className={cls("font-bold border-b border-dotted", isDark ? 'border-zinc-500' : 'border-gray-400')}>Shuffle Alliance & Border Nav Cards</span> according to standard player count rules.</p>
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

      {showStandardRules && (
        <ReshuffleRulesDisplay 
            isSolo={isSolo} 
            isHighPlayerCount={isHighPlayerCount} 
            playerCount={gameState.playerCount} 
        />
      )}
    </div>
  );
};