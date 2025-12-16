
import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';
import { useTheme } from '../../ThemeContext';

export const TimeLimitStep: React.FC = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const warningText = isDark ? 'text-red-400' : 'text-red-700';

  return (
    <SpecialRuleBlock source="setupCard" title="Setup Card Override">
      <strong>Game Timer:</strong>
      <div className="space-y-3 mt-1">
        <p>Give a pile of <strong>20 Disgruntled Tokens</strong> to the player taking the first turn. These tokens will be used as Game Length Tokens.</p>
        <p>Each time that player takes a turn, discard one of the Disgruntled Tokens. When the final token is discarded, everyone gets one final turn, then the game is over.</p>
        <p className={`font-bold ${warningText}`}>If time runs out before the Story Card is completed, the player with the most credits wins.</p>
      </div>
    </SpecialRuleBlock>
  );
};
