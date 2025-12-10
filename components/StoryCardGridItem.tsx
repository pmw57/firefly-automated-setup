import React from 'react';
import { StoryCardDef } from '../types';
import { InlineExpansionIcon } from './InlineExpansionIcon';

interface StoryCardGridItemProps {
  card: StoryCardDef;
  isSelected: boolean;
  onClick: () => void;
  isShortList?: boolean;
}

// Helper to extract a summarized badge text from the card config
export const getStoryCardSetupSummary = (card: StoryCardDef): string | null => {
    if (card.setupDescription) return "Setup Changes";
    if (card.setupConfig?.jobDrawMode === 'no_jobs') return "No Starting Jobs";
    if (card.setupConfig?.jobDrawMode === 'caper_start') return "Starts with Caper";
    if (card.setupConfig?.shipPlacementMode === 'persephone') return "Starts at Persephone";
    return null;
};

export const StoryCardGridItem: React.FC<StoryCardGridItemProps> = ({ card, isSelected, onClick, isShortList = false }) => {
    const summary = getStoryCardSetupSummary(card);
    
    return (
        <div 
            onClick={onClick}
            className={`
                relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200 flex flex-col h-full bg-white shadow-sm hover:shadow-md
                ${isSelected 
                    ? 'border-green-500 ring-2 ring-green-200 bg-green-50' 
                    : 'border-gray-200 hover:border-gray-300'
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
                        <div className="w-8 h-8 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-xs text-gray-400 font-bold">BG</div>
                    )}
                </div>

                {/* Right Column: Title & Intro */}
                <div>
                     <h4 className={`font-bold font-western leading-tight ${isSelected ? 'text-green-900' : 'text-gray-800'}`}>
                        {card.title}
                     </h4>
                     
                     {/* Setup Badge Inline */}
                     {summary && (
                         <span className={`
                            inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded mt-1
                            ${isSelected ? 'bg-green-200 text-green-800' : 'bg-amber-100 text-amber-800'}
                         `}>
                            {summary}
                         </span>
                     )}
                </div>
            </div>

            <p className={`text-xs text-gray-600 italic line-clamp-3 mb-auto pl-11 ${isShortList ? 'hidden sm:block' : ''}`}>
                "{card.intro}"
            </p>

            {/* Setup Description Footer */}
            {card.setupDescription && !isShortList && (
                <div className="mt-3 pt-2 border-t border-gray-100 text-[10px] text-amber-700 font-bold pl-11">
                    ⚡ {card.setupDescription}
                </div>
            )}
            
            {isSelected && (
                <div className="absolute top-2 right-2 text-green-600 text-lg">
                    ✓
                </div>
            )}
        </div>
    );
};
