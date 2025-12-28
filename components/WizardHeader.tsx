
import React, { useState, useMemo } from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { GameState, Step } from '../types/index';
import { useTheme } from './ThemeContext';
import { getHeaderDetails } from '../utils/header';

interface WizardHeaderProps {
    gameState: GameState;
    onReset: () => void;
    flow: Step[];
    currentStepIndex: number;
}

export const WizardHeader = ({ gameState, onReset, flow, currentStepIndex }: WizardHeaderProps): React.ReactElement => {
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const { setupName, storyName, soloMode } = useMemo(() => 
        getHeaderDetails(gameState, flow, currentStepIndex),
        [gameState, flow, currentStepIndex]
    );

    const handleResetClick = () => {
        if (showConfirmReset) {
            onReset();
        } else {
            setShowConfirmReset(true);
            setTimeout(() => setShowConfirmReset(false), 3000);
        }
    };
    
    const stickyHeaderBg = isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-[#faf8ef]/95 border-[#d6cbb0]';

    return (
        <div className={`${stickyHeaderBg} backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm border flex justify-between items-center transition-all duration-300 sticky top-0 z-30 min-h-[88px]`}>
            <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-x-2 truncate">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-[#78350f]'}`}>
                        Setup:
                    </span>
                    <span className={`font-bold text-sm md:text-base leading-tight truncate ${isDark ? 'text-blue-300' : 'text-[#451a03]'}`}>
                        {setupName}
                    </span>
                </div>

                {storyName && (
                    <div className="flex items-baseline gap-x-2 truncate mt-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-[#78350f]'}`}>
                            Story:
                        </span>
                        <span className={`font-bold text-sm md:text-base leading-tight truncate ${isDark ? 'text-amber-200' : 'text-[#b45309]'}`}>
                            {storyName}
                        </span>
                    </div>
                )}

                {soloMode && (
                    <span className={`block text-[10px] uppercase font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-800'}`}>
                        Solo ({soloMode})
                    </span>
                )}
            </div>
            <button 
                type="button"
                onClick={handleResetClick}
                className={`
                    text-xs font-bold underline focus:outline-none focus:ring-2 rounded px-2 py-1 transition-colors duration-200 ml-4 shrink-0
                    ${showConfirmReset ? 'bg-red-600 text-white hover:bg-red-700 ring-red-500 shadow-md no-underline' : (isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-[#7f1d1d] hover:text-[#991b1b] hover:bg-red-50 focus:ring-[#d4af37]')}
                `}
            >
                {showConfirmReset ? "Confirm Restart?" : "Restart"}
            </button>
        </div>
    );
};