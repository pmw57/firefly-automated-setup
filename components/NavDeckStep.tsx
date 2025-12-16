import React, { useMemo } from 'react';
import { Step } from '../types';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { determineNavDeckDetails } from '../utils/nav';

interface NavDeckStepProps {
  step: Step;
}

// FIX: Made children optional to resolve type errors.
const ActionText = ({ children }: { children?: React.ReactNode }): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <span className={`font-bold border-b border-dotted ${isDark ? 'border-zinc-500' : 'border-gray-400'}`}>
      {children}
    </span>
  );
};

export const NavDeckStep = ({ step }: NavDeckStepProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const overrides = useMemo(() => step.overrides || {}, [step.overrides]);
  
  const { 
    specialRule, 
    clearerSkies, 
    showStandardRules, 
    isSolo, 
    isHighPlayerCount 
  } = useMemo(() => determineNavDeckDetails(gameState, overrides), [gameState, overrides]);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-black/60' : 'bg-white';
  const panelBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const panelText = isDark ? 'text-gray-300' : 'text-gray-800';

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

  return (
    <>
      <div className={`${panelBg} p-6 rounded-lg border ${panelBorder} shadow-sm mb-6 overflow-hidden transition-colors duration-300 space-y-4`}>
        {specialRule === null && (
          <p className={`${panelText}`}><ActionText>Shuffle Alliance & Border Nav Cards</ActionText> standard setup.</p>
        )}

        {specialRule === 'flyingSolo' && (
           <SpecialRuleBlock source="setupCard" title="Flying Solo">
               Shuffle the <ActionText>"RESHUFFLE"</ActionText> cards into their respective Nav Decks.
           </SpecialRuleBlock>
        )}
        
        {specialRule === 'hardcore' && (
          <SpecialRuleBlock source="setupCard" title="Setup Card Override">
            <strong>Hardcore Navigation:</strong> Shuffle the <ActionText>Alliance Cruiser</ActionText> and <ActionText>Reaver Cutter</ActionText> cards into the Nav Decks immediately, regardless of player count.
          </SpecialRuleBlock>
        )}
        
        {specialRule === 'reshuffle' && (
          <SpecialRuleBlock source="setupCard" title="Setup Card Override">
            <ul className="list-disc ml-4 space-y-1">
              <li>Place the <ActionText>"RESHUFFLE"</ActionText> cards in the Nav Decks at the start of the game, regardless of player count.</li>
              <li><ActionText>Shuffle each of the Alliance and Border Nav Decks</ActionText>.</li>
              {(gameState.expansions.blue || gameState.expansions.kalidasa) && (
                <li className="italic opacity-80">Applies to all active decks (including Rim Space).</li>
              )}
            </ul>
          </SpecialRuleBlock>
        )}

        {clearerSkies && (
          <SpecialRuleBlock source="setupCard" title="Setup Card Override">
            <strong>Clearer Skies Rule:</strong> When initiating a Full Burn, roll a die. The result is how many sectors you may move before you start drawing Nav Cards.
            <br /><span className="text-xs italic opacity-75">Note: You may not move farther than your Drive Core's range, regardless of the die roll.</span>
          </SpecialRuleBlock>
        )}
      </div>

      {showStandardRules && (
        <div className={`border rounded-lg overflow-hidden shadow-sm transition-colors duration-300 ${reshuffleBorder}`}>
          <div className={`${reshuffleBg} px-4 py-2 text-xs font-bold uppercase tracking-wider border-b ${reshuffleBorder} ${reshuffleHeader}`}>
            {isSolo ? 'Reshuffle Card Rules' : `Reshuffle Card Rules (Player Count: ${gameState.playerCount})`}
          </div>
          
          {isSolo ? (
             <div className={`p-4 border-l-4 transition-all duration-300 ${activeBg}`}>
                <div className={`text-sm ${activeText}`}>Shuffle the "RESHUFFLE" cards into the deck.</div>
             </div>
          ) : (
            <>
              <div className={`p-4 border-l-4 transition-all duration-300 ${!isHighPlayerCount ? activeBg : inactiveBg}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className={`font-bold ${!isHighPlayerCount ? activeTitle : inactiveTitle}`}>1-2 Players</div>
                  {!isHighPlayerCount && <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${activeBadgeBg}`}>Active</span>}
                </div>
                <div className={`text-sm ${!isHighPlayerCount ? activeText : inactiveText}`}>Shuffle the "RESHUFFLE" cards into the deck.</div>
              </div>
              <div className={`p-4 border-l-4 border-t transition-all duration-300 ${isHighPlayerCount ? activeBg : inactiveBg} ${isDark ? 'border-t-zinc-800' : 'border-t-gray-200'}`}>
                <div className="flex justify-between items-center mb-1">
                  <div className={`font-bold ${isHighPlayerCount ? activeTitle : inactiveTitle}`}>3+ Players</div>
                  {isHighPlayerCount && <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${activeBadgeBg}`}>Active</span>}
                </div>
                <div className={`text-sm ${isHighPlayerCount ? activeText : inactiveText}`}>Place the "RESHUFFLE" card in the Discard Pile of <em>each</em> Nav Deck.</div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};
