import React from 'react';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';

export const AllianceAlertStep = (): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const headerColor = isDark ? 'text-blue-300' : 'text-blue-800';

  return (
    <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
        <h4 className={cls("font-bold text-lg mb-2", headerColor)}>Alliance High Alert</h4>
        <p className={cls("mb-2", textColor)}>
            Begin the game with <strong>one random Alliance Alert Card</strong> in play.
        </p>
        <p className={cls("text-sm", textColor)}>
            Each Alert has a rule that affects all players. When a Misbehave Card directs you to draw a new Alert Card, place the current Alert at the bottom of the Alert Deck.
        </p>
    </div>
  );
};