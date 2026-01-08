import React from 'react';
import { useGameState } from '../../../hooks/useGameState';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';

export const StripMiningStep = (): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const headerColor = isDark ? 'text-purple-400' : 'text-purple-800';

  return (
    <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
        <h4 className={cls("font-bold text-lg mb-2", headerColor)}>The Dinosaur Draft</h4>
        <ol className={cls("list-decimal list-inside space-y-2", textColor)}>
            <li>Choose 1 Supply Deck to be "Strip Mined".</li>
            <li>The winner of the Ship Roll claims the <strong>Dinosaur</strong>.</li>
            <li>Reveal <strong>{gameState.playerCount} cards</strong> from the top of the chosen deck.</li>
            <li>Starting at the Dinosaur and going left, draft one card for free.</li>
            <li>Pass the Dinosaur to the left. Repeat until all players have been the Dinosaur once.</li>
        </ol>
    </div>
  );
};