import React from 'react';
import { StoryCardDef } from '../types';
import { InlineExpansionIcon } from './InlineExpansionIcon';
import { getStoryCardSetupSummary } from '../utils';

interface StoryCardGridItemProps {
  card: StoryCardDef;
  isSelected: boolean;
  onClick: () => void;
  isShortList?: boolean;
}

export const StoryCardGridItem: React.FC<StoryCardGridItemProps> = ({ card, isSelected, onClick, isShortList = false }) => {
    const summary = getStoryCardSetupSummary(card);
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClick();
        }
    };

    return (
        <div 
            onClick={onClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            className={`
                relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 flex flex-col h-full shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                ${isSelected 
                    ? 'border-green-500 ring-2 ring-green-200 dark:ring-green-900 bg-green-50 dark:bg-green-900/20' 
                    : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-500'
                }
                ${isShortList ? 'min-h-[120px]' : 'min-h-[160px]'}
            `}
        >
            <div className="flex items-start mb-2">
                {/* Left Column: Icon */}
                <div className="mr-3 shrink-0 pt-1">
                    {card.requiredExpansion ? (
                        <InlineExpansionIcon type={card.requiredExpansion} className="w-8 h-8" />
                    ) : (
                        <div className="w-8 h-8 bg-gray-100 dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600 flex items-center justify-center text-xs text-gray-400 dark:text-gray-500 font-bold">BG</div>
                    )}
                </div>

                {/* Right Column: Title & Intro */}
                <div>
                     <h4 className={`font-bold font-western leading-tight ${isSelected ? 'text-green-900 dark:text-green-300' : 'text-gray-800 dark:text-gray-200'}`}>
                        {card.title}
                     </h4>
                     
                     {/* Setup Badge Inline */}
                     {summary && (
                         <span className={`
                            inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mt-1
                            ${isSelected ? 'bg-green-200 text-green-800 dark:bg-green-800 dark:text-green-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-200'}
                         `}>
                            {summary}
                         </span>
                     )}
                </div>
            </div>

            <p className={`text-xs text-gray-600 dark:text-gray-400 italic line-clamp-3 mb-auto pl-11 ${isShortList ? 'hidden sm:block' : ''}`}>
                "{card.intro}"
            </p>

            {/* Setup Description Footer */}
            {card.setupDescription && !isShortList && (
                <div className="mt-3 pt-2 border-t border-gray-100 dark:border-slate-700/50 text-[10px] text-amber-700 dark:text-amber-400 font-bold pl-11">
                    ⚡ {card.setupDescription}
                </div>
            )}
            
            {isSelected && (
                <div className="absolute top-2 right-2 text-green-600 dark:text-green-400 text-lg">
                    ✓
                </div>
            )}
        </div>
    );
};