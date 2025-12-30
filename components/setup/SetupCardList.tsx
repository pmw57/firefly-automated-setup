
import React, { useRef, useEffect } from 'react';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { SetupCardDef } from '../../types/index';
import { ExpansionIcon } from '../ExpansionIcon';
import { useTheme } from '../ThemeContext';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { cls } from '../../utils/style';

interface SetupCardListProps {
    cards: SetupCardDef[];
    selectedId: string;
    isFlyingSoloActive: boolean;
    onSelect: (id: string, label: string) => void;
}

export const SetupCardList: React.FC<SetupCardListProps> = ({ 
    cards, 
    selectedId, 
    isFlyingSoloActive, 
    onSelect 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const selectedRef = useRef<HTMLButtonElement>(null);

    // Scroll to selected item on mount or change
    useEffect(() => {
        if (selectedRef.current) {
            setTimeout(() => {
                selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [selectedId]);

    const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
    const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';
    let lastExpansionId: string | null | undefined = '___INITIAL___'; // Unique initial value

    return (
        <>
            <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>
                {isFlyingSoloActive ? 'Available Board Setups' : 'Available Setup Cards'}
            </label>
            
            <div className={`w-full h-[400px] overflow-y-auto custom-scrollbar border ${containerBorder} rounded-lg shadow-sm ${isDark ? 'bg-black/40' : 'bg-[#f5f5f4]'} transition-colors`}>
                {cards.map(card => {
                    const isSelected = selectedId === card.id;
                    const showHeader = card.requiredExpansion !== lastExpansionId;
                    lastExpansionId = card.requiredExpansion;

                    const expansionMeta = card.requiredExpansion 
                        ? EXPANSIONS_METADATA.find(e => e.id === card.requiredExpansion) 
                        : null;
                    
                    const headerLabel = expansionMeta ? expansionMeta.label : 'Base Game';
                    
                    // Dynamic Styles for items
                    const itemBg = isSelected 
                        ? (isDark ? 'bg-emerald-900/30' : 'bg-[#fff1f2]')
                        : (isDark ? 'bg-zinc-900/40' : 'bg-[#faf8ef]');
                    const itemBorder = isSelected
                        ? (isDark ? 'border-emerald-800' : 'border-[#7f1d1d]')
                        : (isDark ? 'border-zinc-800/50' : 'border-[#e7e5e4]');
                    const iconBg = isSelected
                        ? (isDark ? 'bg-emerald-900/40 border-emerald-800' : 'bg-[#fee2e2] border-[#7f1d1d]')
                        : (isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#e7e5e4] border-[#d6cbb0]');
                    const titleColor = isSelected 
                        ? (isDark ? 'text-emerald-400' : 'text-[#7f1d1d]') 
                        : (isDark ? 'text-gray-300' : 'text-[#292524]');
                    const descColor = isSelected 
                        ? (isDark ? 'text-emerald-200/70' : 'text-[#991b1b]') 
                        : (isDark ? 'text-zinc-400' : 'text-[#57534e]');

                    return (
                        <React.Fragment key={card.id}>
                            {showHeader && (
                                <div className={cls(
                                    "sticky top-0 z-10 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm",
                                    isDark ? 'bg-zinc-800 text-zinc-400 border-y border-zinc-700' : 'bg-gray-100 text-gray-600 border-y border-gray-200'
                                )}>
                                    {headerLabel}
                                </div>
                            )}
                            <button 
                                ref={isSelected ? selectedRef : null}
                                type="button"
                                onClick={() => onSelect(card.id, card.label)}
                                className={`flex items-stretch text-left cursor-pointer border-b last:border-0 transition-all duration-200 focus:outline-none focus:z-10 focus:ring-inset focus:ring-2 focus:ring-[#d4af37] ${itemBg} ${itemBorder} ${!isSelected ? (isDark ? 'hover:bg-zinc-800' : 'hover:bg-[#f5f5f4]') : ''}`}
                                aria-pressed={isSelected}
                            >
                                <div className={`w-16 flex items-center justify-center border-r p-2 shrink-0 ${iconBg} ${itemBorder}`}>
                                    <div className={`w-10 h-10 rounded overflow-hidden shadow-sm border ${isDark ? 'border-zinc-600' : 'border-[#d6cbb0]'}`}>
                                        <ExpansionIcon id={card.iconOverride || card.requiredExpansion || 'base'} />
                                    </div>
                                </div>

                                <div className="flex-1 p-4 flex flex-col justify-center relative">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'} ${titleColor}`}>
                                            {card.label}
                                        </span>
                                        {isSelected && <span className={`${isDark ? 'text-emerald-400' : 'text-[#7f1d1d]'} font-bold text-xl`}>✓</span>}
                                    </div>
                                    {card.description && (
                                        <p className={`text-sm ${descColor} line-clamp-2`}>
                                            {card.description}
                                        </p>
                                    )}
                                    {card.sourceUrl && (
                                        <a
                                            href={card.sourceUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className={`inline-flex items-center text-xs font-bold uppercase tracking-wider underline mt-2 self-start ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-800 hover:text-blue-600'} transition-opacity`}
                                            aria-label={`View source for ${card.label}`}
                                        >
                                            View Source
                                            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                                        </a>
                                    )}
                                </div>
                            </button>
                        </React.Fragment>
                    );
                })}
            </div>
        </>
    );
};