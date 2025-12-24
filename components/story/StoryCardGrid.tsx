import React, { useMemo } from 'react';
import { StoryCardGridItem } from './StoryCardGridItem';
import { Button } from '../Button';
import { useMissionSelection } from '../../hooks/useMissionSelection';
import { useTheme } from '../ThemeContext';
import { getFilterableExpansions } from '../../utils/selectors/story';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { cls } from '../../utils/style';

interface StoryCardGridProps {
  onSelect: (title: string) => void;
  isClassicSolo: boolean;
}

export const StoryCardGrid: React.FC<StoryCardGridProps> = ({ onSelect, isClassicSolo }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    filteredStories,
    validStories,
    searchTerm,
    setSearchTerm,
    filterExpansion,
    setFilterExpansion,
    activeStoryCard,
    sortMode,
    toggleSortMode,
  } = useMissionSelection();

  const availableExpansionsForFilter = useMemo(() => 
    getFilterableExpansions(isClassicSolo), 
    [isClassicSolo]
  );

  let lastExpansionId: string | null | undefined = '___INITIAL___';

  const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const inputBg = isDark ? 'bg-zinc-900/50' : 'bg-[#faf8ef]';
  const inputText = isDark ? 'text-gray-200' : 'text-[#292524]';
  const inputPlaceholder = isDark ? 'placeholder-zinc-500' : 'placeholder-[#a8a29e]';
  const listContainerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const listContainerBg = isDark ? 'bg-black/20' : 'bg-[#f5f5f4]';
  const emptyStateText = isDark ? 'text-zinc-500' : 'text-[#78716c]';
  const countText = isDark ? 'text-zinc-500' : 'text-[#78350f]';

  return (
    <div className="space-y-3">
      <div className="flex gap-3 flex-col sm:flex-row items-center">
        <input 
          type="text" 
          placeholder="Search Title or Intro..." 
          className={`flex-1 p-3 border ${inputBorder} rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg} ${inputText} ${inputPlaceholder} transition-colors`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select 
          value={filterExpansion} 
          onChange={(e) => setFilterExpansion(e.target.value)}
          className={`p-3 border ${inputBorder} rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg} ${inputText} transition-colors`}
        >
          <option value="all">All Expansions</option>
          <option value="base">Base Game</option>
          {availableExpansionsForFilter.map(e => (
            <option key={e.id} value={e.id}>{e.label}</option>
          ))}
        </select>
         <Button
            onClick={toggleSortMode}
            variant="secondary"
            className="py-2 px-4 text-xs w-full sm:w-auto shrink-0"
            title={`Currently sorted by ${sortMode}. Click to change.`}
        >
            Sort by {sortMode === 'expansion' ? 'Name' : 'Expansion'}
        </Button>
      </div>
      
      <div className={`h-[350px] overflow-y-auto border ${listContainerBorder} rounded-lg ${listContainerBg} custom-scrollbar`}>
        {filteredStories.length > 0 ? (
          <>
            {filteredStories.map((card) => {
              const showHeader = sortMode === 'expansion' && card.requiredExpansion !== lastExpansionId;
              if (showHeader) {
                lastExpansionId = card.requiredExpansion;
              }
              const expansionMeta = card.requiredExpansion ? EXPANSIONS_METADATA.find(e => e.id === card.requiredExpansion) : null;
              const headerLabel = expansionMeta ? expansionMeta.label : 'Base Game';

              return (
                <React.Fragment key={card.title}>
                  {showHeader && (
                    <div className={cls(
                        "sticky top-0 z-10 px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-sm",
                        isDark ? 'bg-zinc-800 text-zinc-400 border-y border-zinc-700' : 'bg-gray-100 text-gray-600 border-y border-gray-200'
                    )}>
                        {headerLabel}
                    </div>
                  )}
                  <div className="p-2">
                    <StoryCardGridItem 
                      card={card}
                      isSelected={activeStoryCard?.title === card.title}
                      onClick={() => onSelect(card.title)}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </>
        ) : (
          <div className={`flex flex-col items-center justify-center h-full ${emptyStateText} italic`}>
            <span className="text-4xl mb-2">🕵️</span>
            <p>No stories found.</p>
            {isClassicSolo && (
              <p className="text-xs mt-2 text-red-500">Classic Solo is restricted to 'Awful Lonely in the Big Black'.</p>
            )}
            <Button onClick={() => { setSearchTerm(''); setFilterExpansion('all'); }} variant="secondary" className="mt-4 text-sm">Clear Filters</Button>
          </div>
        )}
      </div>
      <div className={`text-right text-xs ${countText}`}>
        Showing {filteredStories.length} of {validStories.length} available stories
      </div>
    </div>
  );
};