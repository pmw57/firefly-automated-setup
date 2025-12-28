
import React from 'react';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { SetupCardDef } from '../../types/index';
import { ExpansionIcon } from '../ExpansionIcon';
import { useTheme } from '../ThemeContext';
import { PageReference } from '../PageReference';

interface FlyingSoloBannerProps {
    isActive: boolean;
    isEligible: boolean;
    cardDef?: SetupCardDef;
    onToggle: () => void;
}

export const FlyingSoloBanner: React.FC<FlyingSoloBannerProps> = ({ 
    isActive, 
    isEligible, 
    cardDef, 
    onToggle 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!isEligible || !cardDef) return null;

    const bannerBg = isDark 
        ? (isActive ? 'bg-indigo-900/30 border-indigo-800' : 'bg-zinc-800/40 border-zinc-700')
        : (isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200');
    
    const titleColor = isDark 
        ? (isActive ? 'text-indigo-300' : 'text-gray-400')
        : (isActive ? 'text-indigo-900' : 'text-gray-600');

    return (
        <div className={`mb-6 p-4 rounded-lg border-2 transition-colors duration-300 ${bannerBg} flex items-start gap-4 shadow-sm`}>
            <div className={`w-16 h-16 shrink-0 rounded overflow-hidden border shadow-sm transition-colors ${isActive ? 'border-indigo-300 dark:border-indigo-700' : 'border-gray-300 dark:border-zinc-600 grayscale opacity-70'}`}>
                <ExpansionIcon id="tenth" />
            </div>
            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div className="flex items-baseline gap-2">
                        <h3 id="flying-solo-label" className={`font-bold text-lg ${titleColor}`}>Flying Solo (10th)</h3>
                        <PageReference page={50} manual="10th AE" />
                    </div>
                    
                    <div 
                        role="switch"
                        aria-checked={isActive}
                        aria-labelledby="flying-solo-label"
                        tabIndex={0}
                        onClick={onToggle}
                        className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center cursor-pointer ${isActive ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-600'}`}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle()}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                </div>
                
                <div className={`transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                    <p className={`text-sm mt-1 ${isDark ? 'text-indigo-200/70' : 'text-indigo-700'}`}>{cardDef.description}</p>
                    {isActive && (
                        <p className="text-xs mt-2 font-bold opacity-80 uppercase tracking-wide">▼ Select your Board Setup below to pair with Flying Solo</p>
                    )}
                </div>
                {!isActive && (
                    <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 italic">Toggle ON to use the automated solo rules.</p>
                )}
            </div>
        </div>
    );
};