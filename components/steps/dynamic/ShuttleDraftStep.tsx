import React from 'react';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';

export const ShuttleDraftStep = (): React.ReactElement => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
  
    const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const headerColor = isDark ? 'text-cyan-400' : 'text-cyan-800';

    return (
        <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
            <h4 className={cls("font-bold text-lg mb-2", headerColor)}>Draft Shuttles from Supply</h4>
            <ol className={cls("list-decimal list-inside space-y-2", textColor)}>
                <li>Pull all <strong>Shuttles</strong> from the Supply Decks.</li>
                <li>Starting with the winner of the Ship Roll, each player takes <strong>1 Shuttle</strong> for free.</li>
                <li>Selection passes to the <strong>left</strong>.</li>
                <li>Place remaining Shuttles in their respective discard piles.</li>
            </ol>
        </div>
    );
};