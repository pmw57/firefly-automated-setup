
import React, { useState, useMemo } from 'react';
import { GameState, Step } from '../types';
import { getDisplaySetupName } from '../utils';
import { useTheme } from './ThemeContext';

interface WizardHeaderProps {
    gameState: GameState;
    onReset: () => void;
    flow: Step[];
    currentStepIndex: number;
}

export const WizardHeader: React.FC<WizardHeaderProps> = ({ gameState, onReset, flow, currentStepIndex }) => {
    const [showConfirmReset, setShowConfirmReset] = useState(false);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const displaySetupName = getDisplaySetupName(gameState);
    
    const { showSetupCard, showStoryCard } = useMemo(() => {
        const setupCardStepIndex = flow.findIndex(step => step.id === 'setup-2');
        const storyCardStepIndex = flow.findIndex(step => step.id === 'core-4');
    
        const shouldShowSetup = setupCardStepIndex !== -1 && currentStepIndex >= setupCardStepIndex;
        const shouldShowStory = storyCardStepIndex !== -1 && currentStepIndex >= storyCardStepIndex;
    
        return { showSetupCard: shouldShowSetup, showStoryCard: shouldShowStory };
    }, [flow, currentStepIndex]);


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
        <div className={`${stickyHeaderBg} backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm border flex justify-between items-center transition-all duration-300 sticky top-0 z-30`}>
            <div className="flex flex-col">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-[#78350f]'}`}>Active Game</span>
                <div className={`flex flex-wrap items-center gap-x-2 font-bold text-sm md:text-base leading-tight ${isDark ? 'text-green-400' : 'text-[#7f1d1d]'}`}>
                    <span className={isDark ? 'text-blue-300' : 'text-[#451a03]'}>
                        {showSetupCard ? displaySetupName : 'Game Setup'}
                    </span>
                    {showStoryCard && gameState.selectedStoryCard && (
                        <>
                            <span className={`${isDark ? 'text-gray-600' : 'text-[#a8a29e]'} hidden sm:inline`}>•</span>
                            <span className={`${isDark ? 'text-amber-200' : 'text-[#b45309]'} block sm:inline`}>{gameState.selectedStoryCard}</span>
                        </>
                    )}
                </div>
                {gameState.gameMode !== 'multiplayer' && (
                    <span className={`text-[10px] uppercase font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-800'}`}>
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
