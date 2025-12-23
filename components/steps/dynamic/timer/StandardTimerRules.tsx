import React from 'react';
import { useTheme } from '../../../ThemeContext';

interface StandardTimerRulesProps {
  totalTokens: number;
}

export const StandardTimerRules: React.FC<StandardTimerRulesProps> = ({ totalTokens }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`${panelBg} p-4 rounded-lg border ${panelBorder} shadow-sm animate-fade-in`}>
      <h4 className={`font-bold mb-2 ${textColor}`}>Standard Solo Timer</h4>
      <p className={subText}>Set aside <strong>{totalTokens} Disgruntled Tokens</strong> to use as Game Length Tokens.</p>
      <p className={`text-sm mt-2 opacity-80 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-2`}>
        Discard one token at the start of every turn. When the last token is gone, you have one final turn.
      </p>
    </div>
  );
};