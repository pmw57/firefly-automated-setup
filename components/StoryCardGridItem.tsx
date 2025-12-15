
import React from 'react';
import { StoryCardDef } from '../types';
import { InlineExpansionIcon } from './InlineExpansionIcon';
import { getStoryCardSetupSummary } from '../utils';
import { useTheme } from './ThemeContext';

interface StoryCardGridItemProps {
  card: StoryCardDef;
  isSelected: boolean;
  onClick: () => void;
  isShortList?: boolean;
}

export const StoryCardGridItem: React.FC<StoryCardGridItemProps> = ({ card, isSelected, onClick, isShortList = false }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const summary = getStoryCardSetupSummary(card);
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    const containerClass = isSelected
        ? (isDark ? 'border-green-500 ring-2 ring-green-900 bg-green-900/20' : 'border-[#7f1d1d] ring-2 ring-[#7f1d1d] bg-[#fff1f2]')
        : (isDark ? 'bg-zinc-800 border-zinc-700 hover:border-zinc-500' : 'bg-[#faf8ef] border-[#d6cbb0] hover:border-[#a8a29e]');

    const titleColor = isSelected
        ? (isDark ? 'text-green-300' : 'text-[#7f1d1d]')
        : (isDark ? 'text-gray-200' : 'text-[#292524]');

    const bgIconBg = isDark ? 'bg-zinc-700 border-zinc-600' : 'bg-[#e5e5e5] border-[#d4d4d4]';
    const bgIconText = isDark ? 'text-gray-500' : 'text-gray-500';

    const badgeClass = isSelected
        ? (isDark ? 'bg-green-800 text-green-200' : 'bg-[#991b1b] text-white')
        : (isDark ? 'bg-amber-900/60 text-amber-200' : 'bg-[#fef3c7] text-[#92400e]');
        
    const soloBadgeClass = isDark ? 'bg-indigo-900/60 text-indigo-200' : 'bg-indigo-100 text-indigo-800';

    const introColor = isDark ? 'text-gray-400' : 'text-[#57534e]';
    const footerBorder = isDark ? 'border-zinc-700/50' : 'border-[#e7e5e4]';
    const footerText = isDark ? 'text-amber-400' : 'text-[#b45309]';
    const checkMarkColor = isDark ? 'text-green-400' : 'text-[#7f1d1d]';

    return (
        <div 
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            className={`
                relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 flex flex-col h-full shadow-sm hover:shadow-md focus:outline-none focus:z-10 focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2
                ${containerClass}
                ${isShortList ? 'min-h-[120px]' : 'min-h-[160px]'}
            `}
        >
            <div className="flex items-start mb-2">
                {/* Left Column: Icon */}
                <div className="mr-3 shrink-0 pt-1">
                    {card.requiredExpansion ? (
                        <InlineExpansionIcon type={card.requiredExpansion} className="w-8 h-8" />
                    ) : (
                        <div className={`w-8 h-8 rounded border flex items-center justify-center text-xs font-bold ${bgIconBg} ${bgIconText}`}>BG</div>
                    )}
                </div>

                {/* Right Column: Title & Intro */}
                <div>
                     <h4 className={`font-bold font-western leading-tight ${titleColor}`}>
                        {card.title}
                     </h4>
                     
                     {/* Badges Container */}
                     <div className="flex flex-wrap gap-1 mt-1">
                         {card.isSolo && (
                             <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${soloBadgeClass}`}>
                                Solo Play
                             </span>
                         )}
                         {summary && (
                             <span className={`inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded ${badgeClass}`}>
                                {summary}
                             </span>
                         )}
                     </div>
                </div>
            </div>

            <p className={`text-xs italic line-clamp-3 mb-auto pl-11 ${introColor} ${isShortList ? 'hidden sm:block' : ''}`}>
                "{card.intro}"
            </p>

            {/* Setup Description Footer */}
            {card.setupDescription && !isShortList && (
                <div className={`mt-3 pt-2 border-t text-[10px] font-bold pl-11 ${footerBorder} ${footerText}`}>
                    ⚡ {card.setupDescription}
                </div>
            )}
            
            {isSelected && (
                <div className={`absolute top-2 right-2 text-lg ${checkMarkColor}`}>
                    ✓
                </div>
            )}
        </div>
    );
};
