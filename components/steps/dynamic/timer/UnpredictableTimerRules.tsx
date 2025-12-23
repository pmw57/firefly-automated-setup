import React from 'react';
import { SpecialRuleBlock } from '../../../SpecialRuleBlock';
import { useTheme } from '../../../ThemeContext';

interface UnpredictableTimerRulesProps {
  unpredictableSelectedIndices: number[];
  randomizeUnpredictable: boolean;
  totalTokens: number;
  onToggleTimerMode: () => void;
}

const AVAILABLE_TOKENS = [1, 1, 2, 2, 3, 4];

export const UnpredictableTimerRules: React.FC<UnpredictableTimerRulesProps> = ({
  unpredictableSelectedIndices,
  randomizeUnpredictable,
  totalTokens,
  onToggleTimerMode
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const selectedTokens = unpredictableSelectedIndices.map(i => AVAILABLE_TOKENS[i]);
  const displayStack = [...selectedTokens];
  
  if (!randomizeUnpredictable) {
    displayStack.sort((a, b) => a - b);
  }

  const numNumbered = selectedTokens.length;
  const topDisgruntled = Math.max(0, totalTokens - 1 - numNumbered);

  const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className="animate-fade-in space-y-4">
      <SpecialRuleBlock source="expansion" title="Pirates & Bounty Hunters Rule" content={[
        { type: 'paragraph', content: ["Replace the bottom Game Length Tokens with numbered Destination Tokens."] },
        { type: 'paragraph', content: [{ type: 'strong', content: 'The Mechanic:' }, " Whenever you discard a numbered Game Length Token, ", { type: 'strong', content: 'roll a die' }, ". If you roll ", { type: 'strong', content: 'equal to or lower' }, " than the number, discard all remaining Game Length Tokens. Take one final turn."] }
      ]}/>

      <div className={`${panelBg} p-4 rounded-lg border ${panelBorder}`}>
        <h5 className={`font-bold text-sm uppercase tracking-wide mb-3 ${textColor}`}>Configure Stack</h5>
        
        <div className="space-y-3 mb-6">
          <label className={`flex items-center cursor-pointer p-2 rounded border ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-50'}`}>
            <input 
              type="checkbox" 
              checked={true}
              onChange={onToggleTimerMode}
              className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600"
            />
            <div className="ml-3">
              <span className={`block text-sm font-medium ${textColor}`}>Unpredictable Timer Active</span>
              <span className={`block text-xs ${subText}`}>Tokens can end game early.</span>
            </div>
          </label>
        </div>

        <div className={`mt-4 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800`}>
          <h6 className={`font-bold text-xs uppercase mb-2 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Stack Construction (Top to Bottom)</h6>
          <ol className={`list-decimal ml-5 text-sm space-y-1 ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
            <li>Stack <strong>{topDisgruntled}</strong> Disgruntled Tokens.</li>
            {randomizeUnpredictable ? (
              <li>Stack the <strong>{numNumbered} numbered tokens</strong> in <strong>RANDOM</strong> order.</li>
            ) : (
              displayStack.map((val, i) => (
                <li key={i}>Place <strong>Token #{val}</strong>.</li>
              ))
            )}
            <li>Place <strong>1 Disgruntled Token</strong> at the very bottom (Last Turn).</li>
          </ol>
        </div>
      </div>
    </div>
  );
};