import React from 'react';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';

export const TimeLimitStep = (): React.ReactElement => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
  
    const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const headerColor = isDark ? 'text-orange-400' : 'text-orange-800';

    return (
        <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
            <h4 className={cls("font-bold text-lg mb-2", headerColor)}>Game Timer</h4>
            <div className={cls("space-y-2", textColor)}>
                <p>
                    Give a pile of <strong>20 Disgruntled Tokens</strong> to the player taking the first turn. These tokens will be used as Game Length Tokens.
                </p>
                <p>
                    Each time that player takes a turn, discard one of the Disgruntled Tokens. When the final token is discarded, everyone gets one final turn, then the game is over.
                </p>
                <div className="text-sm p-2 rounded bg-red-500/10 text-red-800 dark:text-red-300 border border-red-500/20">
                    If time runs out before the Story Card is completed, the player with the most credits wins.
                </div>
            </div>
        </div>
    );
};