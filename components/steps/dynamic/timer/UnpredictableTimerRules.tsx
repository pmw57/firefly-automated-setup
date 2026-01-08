import React from 'react';
import { OverrideNotificationBlock } from '../../../SpecialRuleBlock';
import { useTheme } from '../../../ThemeContext';
import { GameState } from '../../../../types';
import { cls } from '../../../../utils/style';

interface TimerRulesProps {
  timerConfig: GameState['timerConfig'];
  totalTokens: number;
  onToggleTimerMode: () => void;
  onToggleUnpredictableToken: (index: number) => void;
}

const AVAILABLE_TOKENS = [1, 1, 2, 2, 3, 4];

export const UnpredictableTimerRules: React.FC<TimerRulesProps> = ({
  timerConfig,
  totalTokens,
  onToggleTimerMode,
  onToggleUnpredictableToken,
}) => {
  const { mode, unpredictableSelectedIndices } = timerConfig;
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';

  const selectedTokens = unpredictableSelectedIndices.map(i => AVAILABLE_TOKENS[i]);
  const displayStack = [...selectedTokens].sort((a, b) => a - b);
  
  const numNumbered = selectedTokens.length;
  const topDisgruntled = Math.max(0, totalTokens - 1 - numNumbered);

  return (
    <div className={`${panelBg} p-4 rounded-lg border ${panelBorder} shadow-sm animate-fade-in`}>
      <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${isDark ? 'border-zinc-700 hover:bg-zinc-800/50' : 'border-gray-200 hover:bg-gray-50'}`}>
        <input 
          type="checkbox" 
          checked={mode === 'unpredictable'}
          onChange={onToggleTimerMode}
          className="mt-1 mr-4 shrink-0 w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:bg-zinc-700 dark:border-zinc-600"
          aria-label="Enable Unpredictable Timer"
        />
        <div>
          <span className={`font-bold ${textColor}`}>Unpredictable Timer</span>
          <p className={`text-sm leading-relaxed mt-1 ${subText}`}>
            Use numbered tokens that can end the game early. (This was an option on the Settings page).
          </p>
        </div>
      </label>
      
      {mode === 'unpredictable' ? (
        <div className="mt-4 pt-4 border-t border-dashed border-zinc-700/50 animate-fade-in space-y-4">
          <OverrideNotificationBlock source="expansion" title="Pirates & Bounty Hunters Rule" content={[
            { type: 'paragraph', content: ["Replace the bottom Game Length Tokens with numbered Destination Tokens."] },
            { type: 'paragraph', content: [{ type: 'strong', content: 'The Mechanic:' }, " Whenever you discard a numbered Game Length Token, ", { type: 'strong', content: 'roll a die' }, ". If you roll ", { type: 'strong', content: 'equal to or lower' }, " than the number, discard all remaining Game Length Tokens. Take one final turn."] }
          ]}/>

          <div className={cls("p-4 rounded-lg border", isDark ? 'bg-zinc-800/30 border-zinc-700' : 'bg-gray-50 border-gray-200')}>
            <h4 className={`font-bold text-sm uppercase tracking-wide mb-3 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>
                Customize Timer Tokens
            </h4>
            <div className="grid grid-cols-6 gap-2 mb-4">
                {AVAILABLE_TOKENS.map((token, index) => {
                    const isSelected = unpredictableSelectedIndices.includes(index);
                    return (
                        <button
                            key={index}
                            onClick={() => onToggleUnpredictableToken(index)}
                            className={cls(
                                'h-10 rounded-md border-2 font-bold text-lg flex items-center justify-center transition-all duration-200 shadow-sm transform active:scale-95',
                                isSelected 
                                    ? (isDark ? 'bg-amber-800 border-amber-600 text-white' : 'bg-amber-400 border-amber-500 text-black')
                                    : (isDark ? 'bg-zinc-700 border-zinc-600 hover:bg-zinc-600 text-zinc-300' : 'bg-gray-200 border-gray-300 hover:bg-gray-300 text-gray-700')
                            )}
                            aria-pressed={isSelected}
                            title={`Token #${token}`}
                        >
                            {token}
                        </button>
                    );
                })}
            </div>
          </div>

          <div className={`p-4 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800`}>
            <h6 className={`font-bold text-xs uppercase mb-2 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Stack Construction (Top to Bottom)</h6>
            <ol className={`list-decimal ml-5 text-sm space-y-1 ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
              <li>Stack <strong>{topDisgruntled}</strong> Disgruntled Tokens.</li>
              {numNumbered > 0 ? (
                displayStack.map((val, i) => (
                  <li key={i}>Place <strong>Token #{val}</strong>.</li>
                ))
              ) : (
                <li className='italic opacity-70'>No numbered tokens selected.</li>
              )}
              <li>Place <strong>1 Disgruntled Token</strong> at the very bottom (Last Turn).</li>
            </ol>
            <p className={cls("text-xs italic mt-3 pt-2 border-t", isDark ? 'border-amber-800/50 text-amber-200/60' : 'border-amber-200 text-amber-900/70')}>
                For a more unpredictable game, you may shuffle the numbered tokens before placing them in the stack.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-4 pt-4 border-t border-dashed border-zinc-700/50 animate-fade-in">
          <h4 className={`font-bold mb-2 ${textColor}`}>Standard Solo Timer</h4>
          <p className={subText}>Set aside <strong>{totalTokens} Disgruntled Tokens</strong> to use as Game Length Tokens.</p>
          <p className={`text-sm mt-2 opacity-80 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-2`}>
            Discard one token at the start of every turn. When the last token is gone, you have one final turn.
          </p>
        </div>
      )}
    </div>
  );
};