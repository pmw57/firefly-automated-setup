import React from 'react';
import { useTheme } from '../../ThemeContext';
import { useGameState } from '../../../hooks/useGameState';

export const RuiningItResourcesStep = (): React.ReactElement => {
    const { state: gameState } = useGameState();
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { state: draftState } = gameState.draft;
    const player1Name = draftState?.draftOrder[0] || 'Player 1';
    const player2Name = draftState?.draftOrder[1] || 'Player 2';
    
    const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
    const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
    const sectionHeaderColor = isDark ? 'text-gray-200' : 'text-gray-800';
    const textColor = isDark ? 'text-gray-200' : 'text-gray-700';
    const creditColor = isDark ? 'text-green-400' : 'text-green-700';
    const modsText = isDark ? 'text-gray-400' : 'text-gray-600';
    const disabledBg = isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-stone-100 border-stone-300';
    const disabledText = isDark ? 'text-zinc-500' : 'text-stone-500';

    return (
        <div className="space-y-6">
            <div className={`${cardBg} rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300 overflow-hidden`}>
                {/* Twin's section */}
                <div className="p-4 md:p-6">
                    <h4 className={`font-bold text-lg mb-2 ${sectionHeaderColor}`}>{player1Name} (Your Twin)</h4>
                    <p className={`text-sm mb-4 ${textColor}`}>The Twin takes {player2Name}'s ship and outfits it with:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-black/5 dark:bg-black/20 rounded-lg">
                            <div className={`text-3xl font-bold font-western ${creditColor}`}>$2,000</div>
                            <div className={`text-xs uppercase tracking-wider mt-1 ${modsText}`}>Credits</div>
                        </div>
                        <div className="p-4 bg-black/5 dark:bg-black/20 rounded-lg space-y-2">
                            <div className={`font-bold text-sm ${textColor}`}>6 Fuel</div>
                            <div className={`font-bold text-sm ${textColor}`}>2 Parts</div>
                        </div>
                    </div>
                    <p className={`text-xs mt-4 italic ${modsText}`}>
                        This setup also includes the 2 Crew (max $500 value) and a Warrant if no crew are Wanted.
                    </p>
                </div>
                {/* Your section */}
                <div className={`p-4 md:p-6 border-t ${cardBorder} ${disabledBg}`}>
                    <h4 className={`font-bold text-lg mb-2 ${disabledText}`}>{player2Name} (You)</h4>
                    <p className={`text-sm mb-4 ${disabledText}`}>You are left with a new, empty ship of the same class and no starting resources (your resources below will be $0):</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                        <div className="p-4 bg-black/5 dark:bg-black/20 rounded-lg">
                            <div className={`text-3xl font-bold font-western ${disabledText}`}>$0</div>
                            <div className={`text-xs uppercase tracking-wider mt-1 ${disabledText}`}>Credits</div>
                        </div>
                        <div className="p-4 bg-black/5 dark:bg-black/20 rounded-lg space-y-2">
                            <div className={`font-bold text-sm ${disabledText}`}>0 Fuel</div>
                            <div className={`font-bold text-sm ${disabledText}`}>0 Parts</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};