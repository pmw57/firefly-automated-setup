
import React from 'react';
import { StoryCardDef } from '../../types';
import { EXPANSIONS_METADATA } from '../../constants';
import { StoryCardGridItem } from '../StoryCardGridItem';
import { Button } from '../Button';
import { useTheme } from '../ThemeContext';

interface StoryCardGridProps {
  filteredStories: StoryCardDef[];
  validStories: StoryCardDef[];
  selectedStoryCard: string;
  onSelect: (title: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterExpansion: string;
  setFilterExpansion: (id: string) => void;
  isClassicSolo: boolean;
}

export const StoryCardGrid: React.FC<StoryCardGridProps> = ({
  filteredStories,
  validStories,
  selectedStoryCard,
  onSelect,
  searchTerm,
  setSearchTerm,
  filterExpansion,
  setFilterExpansion,
  isClassicSolo
}) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const availableExpansionsForFilter = EXPANSIONS_METADATA.filter(e => {
    if (e.id === 'base') return false;
    if (isClassicSolo && e.id === 'community') return false;
    // In the future, we could check if any valid stories use this expansion
    return true;
  });

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
      <div className="flex gap-3 flex-col sm:flex-row">
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
      </div>
      
      <div className={`h-[350px] overflow-y-auto border ${listContainerBorder} rounded-lg ${listContainerBg} p-2 custom-scrollbar`}>
        {filteredStories.length > 0 ? (
          <div className="space-y-3">
            {filteredStories.map((card) => (
              <StoryCardGridItem 
                key={card.title}
                card={card}
                isSelected={selectedStoryCard === card.title}
                onClick={() => onSelect(card.title)}
              />
            ))}
          </div>
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
