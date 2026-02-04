
import React, { useState, useMemo } from 'react';
import { GameState, Step } from '../types/index';
import { useTheme } from './ThemeContext';
import { getHeaderDetails } from '../utils/header';
import { cls } from '../utils/style';

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
    
    // Semantic Tokens
    const stickyHeaderBg = 'bg-surface-overlay/95 backdrop-blur-sm border-border-separator';
    const labelColor = 'text-content-secondary';
    const setupNameColor = isDark ? 'text-blue-300' : 'text-[#451a03]'; // Retaining some specific brand colors for light mode for now
    const storyNameColor = isDark ? 'text-amber-200' : 'text-[#b45309]';
    const soloModeColor = isDark ? 'text-purple-400' : 'text-purple-800';

    return (
        <div className={cls(stickyHeaderBg, "p-4 rounded-lg mb-6 shadow-sm border flex flex-col sm:flex-row justify-between items-center transition-all duration-300 sticky top-0 z-30 min-h-[88px] gap-4")}>
            <div className="flex-1 min-w-0 w-full">
                <div className="flex items-baseline gap-x-2 truncate">
                    <span className={cls("text-[10px] font-bold uppercase tracking-widest", labelColor)}>
                        Setup:
                    </span>
                    <span className={cls("font-bold text-sm md:text-base leading-tight truncate", setupNameColor)}>
                        {setupName}
                    </span>
                </div>

                {storyName && (
                    <div className="flex items-baseline gap-x-2 truncate mt-1">
                        <span className={cls("text-[10px] font-bold uppercase tracking-wider", labelColor)}>
                            Story:
                        </span>
                        <span className={cls("font-bold text-sm md:text-base leading-tight truncate", storyNameColor)}>
                            {storyName}
                        </span>
                    </div>
                )}

                {soloMode && (
                    <span className={cls("block text-[10px] uppercase font-bold mt-1", soloModeColor)}>
                        Solo ({soloMode})
                    </span>
                )}
            </div>
            <button 
                type="button"
                onClick={handleResetClick}
                className={cls(
                    "text-xs font-bold underline focus:outline-none focus:ring-2 rounded px-2 py-1 transition-colors duration-200 shrink-0",
                    showConfirmReset 
                        ? 'bg-red-600 text-white hover:bg-red-700 ring-red-500 shadow-md no-underline' 
                        : 'text-content-error hover:text-red-700 hover:bg-surface-error focus:ring-[#d4af37]'
                )}
            >
                {showConfirmReset ? "Confirm Restart?" : "Restart"}
            </button>
        </div>
    );
};
