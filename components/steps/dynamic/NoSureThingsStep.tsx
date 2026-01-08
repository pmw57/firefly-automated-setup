import React from 'react';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';

export const NoSureThingsStep = (): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const headerColor = isDark ? 'text-purple-400' : 'text-purple-800';

  return (
    <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
      <h4 className={cls("font-bold text-lg mb-2", headerColor)}>No Sure Things In Life</h4>
      <p className={cls("mb-2", textColor)}>
        Before "Priming the Pump", <strong>remove 5 cards from play</strong> for <strong>each</strong> Supply and Contact Deck to simulate a lived-in 'Verse.
      </p>
      <p className={cls("text-sm italic", textColor)}>
        These cards are kept face down and cannot be accessed in any way during the game.
      </p>
    </div>
  );
};