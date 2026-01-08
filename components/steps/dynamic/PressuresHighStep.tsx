import React from 'react';
import { useTheme } from '../../ThemeContext';
import { cls } from '../../../utils/style';

export const PressuresHighStep = (): React.ReactElement => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
  
    const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const headerColor = isDark ? 'text-red-400' : 'text-red-800';

    return (
        <div className={cls(cardBg, "p-6 rounded-lg border shadow-sm", cardBorder)}>
            <h4 className={cls("font-bold text-lg mb-2", headerColor)}>The Pressure's High</h4>
            <div className={cls("space-y-2", textColor)}>
                <p>
                    <strong>Alliance Alert:</strong> Begin the game with one random Alliance Alert Card in play.
                </p>
                <div>
                    <strong>Wanted Accumulation:</strong>
                    <ul className="list-disc list-inside ml-4 text-sm">
                        <li>Wanted Crew and Leaders may accumulate Wanted tokens.</li>
                        <li>
                            <strong>Roll Check:</strong> When making Alliance Wanted Crew rolls, you must roll higher than the number of current Wanted tokens for that Crew/Leader to avoid effects.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};