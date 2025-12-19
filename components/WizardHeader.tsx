import React, { useState, useMemo } from 'react';
import { GameState, Step } from '../types';
import { getDisplaySetupName } from '../utils/ui';
import { useTheme } from './ThemeContext';
import { STEP_IDS } from '../data/ids';

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

    const displaySetupName = getDisplaySetupName(gameState);
    
    const { showSetupCard, showStoryCard, setupCardStepIndex } = useMemo(() => {
        const setupCardIdx = flow.findIndex(step => step.id === STEP_IDS.SETUP_CARD_SELECTION);
        // Fix: Include D_FIRST_GOAL to correctly detect when a story has been selected in all setup flows.
        const storyCardIdx = flow.findIndex(step => 
            step.id === STEP_IDS.CORE_MISSION || step.id === STEP_IDS.D_FIRST_GOAL
        );
    
        // UX Change: Show info on the step *after* selection for a cleaner flow.
        const shouldShowSetup = setupCardIdx !== -1 && currentStepIndex > setupCardIdx;
        const shouldShowStory = storyCardIdx !== -1 && currentStepIndex > storyCardIdx;
    
        return { 
            showSetupCard: shouldShowSetup, 
            showStoryCard: shouldShowStory,
            setupCardStepIndex: setupCardIdx
        };
    }, [flow, currentStepIndex]);

    const showSoloModeIndicator = gameState.gameMode !== 'multiplayer' && setupCardStepIndex !== -1 && currentStepIndex > setupCardStepIndex;

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
            {/* UX Improvement: Redesigned header for clarity and better responsiveness */}
            <div className="flex-1 min-w-0"> {/* Use min-w-0 to allow truncation in flexbox */}
                <div className="flex items-baseline gap-x-2 truncate">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-[#78350f]'}`}>
                        Setup:
                    </span>
                    <span className={`font-bold text-sm md:text-base leading-tight truncate ${isDark ? 'text-blue-300' : 'text-[#451a03]'}`}>
                        {showSetupCard && gameState.setupCardName ? displaySetupName : 'Configuring...'}
                    </span>
                </div>

                {showStoryCard && gameState.selectedStoryCard && (
                    <div className="flex items-baseline gap-x-2 truncate mt-1">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-[#78350f]'}`}>
                            Story:
                        </span>
                        <span className={`font-bold text-sm md:text-base leading-tight truncate ${isDark ? 'text-amber-200' : 'text-[#b45309]'}`}>
                            {gameState.selectedStoryCard}
                        </span>
                    </div>
                )}

                {showSoloModeIndicator && (
                    <span className={`block text-[10px] uppercase font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-800'}`}>
                        {gameState.setupCardId === 'FlyingSolo' ? 'Solo (Expanded)' : 'Solo (Classic)'}
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
