
import React from 'react';
import { useTheme } from '../../../ThemeContext';

interface StandardTimerRulesProps {
  totalTokens: number;
  onToggleTimerMode: () => void;
}

export const StandardTimerRules: React.FC<StandardTimerRulesProps> = ({ totalTokens, onToggleTimerMode }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';

  const optionBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
  const optionHover = isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50';

  return (
    <div className={`${panelBg} p-4 rounded-lg border ${panelBorder} shadow-sm animate-fade-in`}>
      <div className="mb-4">
        <h4 className={`font-bold mb-2 ${textColor}`}>Standard Solo Timer</h4>
        <p className={subText}>Set aside <strong>{totalTokens} Disgruntled Tokens</strong> to use as Game Length Tokens.</p>
        <p className={`text-sm mt-2 opacity-80 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-2`}>
          Discard one token at the start of every turn. When the last token is gone, you have one final turn.
        </p>
      </div>

      <div className="border-t border-dashed border-zinc-700/50 pt-4">
        <label className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}>
          <input 
            type="checkbox" 
            checked={false}
            onChange={onToggleTimerMode}
            className="mt-1 mr-4 shrink-0 w-5 h-5 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:bg-zinc-700 dark:border-zinc-600"
            aria-label="Enable Unpredictable Timer"
          />
          <div>
            <span className={`font-bold ${textColor}`}>Enable Unpredictable Timer</span>
            <p className={`text-sm leading-relaxed mt-1 ${subText}`}>
              Use numbered tokens that can end the game early. (This was an option on the Settings page).
            </p>
          </div>
        </label>
      </div>
    </div>
  );
};
