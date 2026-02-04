
import React, { useRef, useEffect } from 'react';
import { SetupCardDef } from '../../types/index';
import { ExpansionIcon } from '../ExpansionIcon';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { cls } from '../../utils/style';
import { useGameState } from '../../hooks/useGameState';

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
    const { state: gameState } = useGameState();
    const selectedRef = useRef<HTMLButtonElement>(null);

    // Scroll to selected item on mount or change
    useEffect(() => {
        if (selectedRef.current) {
            setTimeout(() => {
                selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [selectedId]);

    const labelColor = 'text-content-secondary';
    let lastExpansionId: string | null | undefined = '___INITIAL___'; // Unique initial value

    return (
        <>
            <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>
                {isFlyingSoloActive ? 'Available Board Setups' : 'Available Setup Cards'}
            </label>
            
            <div className={`w-full h-[400px] overflow-y-auto custom-scrollbar border border-border-separator rounded-lg shadow-sm bg-surface-subtle transition-colors`}>
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
                        ? 'bg-surface-success' // e.g. green-50
                        : 'bg-surface-card hover:bg-surface-subtle';
                    
                    const itemBorder = isSelected
                        ? 'border-border-success' // e.g. green-300
                        : 'border-border-subtle';
                        
                    const iconBg = isSelected
                        ? 'bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800'
                        : 'bg-surface-subtle border-border-subtle';
                    
                    const titleColor = isSelected 
                        ? 'text-content-success' 
                        : 'text-content-primary';
                        
                    const descColor = isSelected 
                        ? 'text-green-700 dark:text-green-300/80' 
                        : 'text-content-secondary';
                    
                    const isRecommended = gameState.setupMode === 'quick' && card.id === 'Standard';

                    return (
                        <React.Fragment key={card.id}>
                            {showHeader && (
                                <div className={cls(
                                    "sticky top-0 z-10 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm border-y",
                                    "bg-surface-subtle text-content-secondary border-border-subtle"
                                )}>
                                    {headerLabel}
                                </div>
                            )}
                            <button 
                                ref={isSelected ? selectedRef : null}
                                type="button"
                                onClick={() => onSelect(card.id, card.label)}
                                className={cls(
                                    "flex items-stretch text-left cursor-pointer border-b last:border-0 transition-all duration-200 focus:outline-none focus:z-10 focus:ring-inset focus:ring-2 focus:ring-[#d4af37]",
                                    itemBg, itemBorder
                                )}
                                aria-pressed={isSelected}
                            >
                                <div className={`w-16 flex items-center justify-center border-r p-2 shrink-0 ${iconBg} ${itemBorder}`}>
                                    <div className={cls("w-10 h-10 rounded overflow-hidden shadow-sm border", isSelected ? 'border-green-300 dark:border-green-700' : 'border-border-subtle')}>
                                        <ExpansionIcon id={card.iconOverride || card.requiredExpansion || 'base'} />
                                    </div>
                                </div>

                                <div className="flex-1 p-4 flex flex-col justify-center relative">
                                    <div className="flex items-center justify-between mb-1">
                                      <div className="flex items-center gap-2">
                                        <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'} ${titleColor}`}>
                                            {card.label}
                                        </span>
                                        {isRecommended && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">Recommended</span>}
                                      </div>
                                      {isSelected && <span className={`text-content-success font-bold text-xl`}>✓</span>}
                                    </div>
                                    {gameState.setupMode === 'detailed' && card.description && (
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
                                            className={`inline-flex items-center text-xs font-bold uppercase tracking-wider underline mt-2 self-start text-content-info hover:text-blue-600 transition-opacity`}
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
