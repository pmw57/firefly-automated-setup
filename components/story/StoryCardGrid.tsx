import React, { useMemo, useState, useRef, useEffect } from 'react';
import { StoryCardGridItem } from './StoryCardGridItem';
import { Button } from '../Button';
import { useMissionSelection } from '../../hooks/useMissionSelection';
import { useTheme } from '../ThemeContext';
import { getFilterableExpansions, getStoryIncompatibilityReason } from '../../utils/selectors/story';
import { EXPANSIONS_METADATA } from '../../data/expansions';
import { STORY_CARDS } from '../../data/storyCards';
import { cls } from '../../utils/style';
import { InlineExpansionIcon } from '../InlineExpansionIcon';
import { ExpansionId, StoryTag } from '../../types';

interface StoryCardGridProps {
  onSelect: (index: number) => void;
}

type FilterOption = { id: StoryTag, label: string };
type FilterGroup = { label: string, options: FilterOption[] };

const FILTER_GROUPS: FilterGroup[] = [
    {
        label: 'By Game Type',
        options: [
            { id: 'solo', label: 'Solo' },
            { id: 'coop', label: 'Co-Op' },
            { id: 'pvp', label: 'PvP' },
        ]
    },
    {
        label: "Heists & High Stakes",
        options: [
            { id: 'classic_heist', label: 'Classic Heists' },
            { id: 'smugglers_run', label: "Smuggler's Run" },
            { id: 'jailbreak', label: 'Jailbreaks & Rescues' },
            { id: 'criminal_enterprise', label: 'Criminal Enterprise' },
        ]
    },
    {
        label: "Galactic Conflict",
        options: [
            { id: 'faction_war', label: 'Faction Wars' },
            { id: 'survival', label: 'Survival & Evasion' },
        ]
    },
    {
        label: "Tales from the 'Verse",
        options: [
            { id: 'character', label: 'Character Episodes' },
            { id: 'mystery', label: "Mysteries & Misadventures" },
            { id: 'reputation', label: "Reputation & Renown" },
        ]
    },
    {
        label: "Other Themes",
        options: [
            { id: 'doing_the_job', label: "Doing the Job" },
            { id: 'against_the_black', label: "Against the Black" },
            { id: 'verse_variant', label: "'Verse Variants" },
            { id: 'community', label: "Community Spotlight" }
        ]
    }
];


export const StoryCardGrid: React.FC<StoryCardGridProps> = ({ onSelect }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const {
    filteredStories,
    validStories,
    searchTerm,
    setSearchTerm,
    filterExpansion,
    setFilterExpansion,
    toggleFilterExpansion,
    selectedStoryCardIndex,
    sortMode,
    toggleSortMode,
    filterTheme,
    setFilterTheme,
    gameState,
  } = useMissionSelection();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const expansionsForFilter = useMemo(() => {
    // 1. Get all unique expansion IDs present in the currently valid stories.
    const storyExpansionIds = new Set<string>();
    validStories.forEach(story => {
      storyExpansionIds.add(story.requiredExpansion || 'base');
    });

    // 2. Get the base list of all possible filterable expansions.
    const allPossibleFilters = [{ id: 'base', label: 'Base Game' }, ...getFilterableExpansions(gameState.showHiddenContent)];
    
    // 3. Filter this list to only include expansions that have valid stories.
    return allPossibleFilters.filter(exp => storyExpansionIds.has(exp.id));
  }, [validStories, gameState.showHiddenContent]);

  const hiddenMatches = useMemo(() => {
    if (searchTerm === '' || filteredStories.length > 0) {
        return [];
    }

    const allMatchingSearch = STORY_CARDS.filter(card =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.intro.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const visibleTitles = new Set(filteredStories.map(s => s.title));
    
    return allMatchingSearch
        .filter(card => !visibleTitles.has(card.title))
        .map(card => ({
            card,
            reason: getStoryIncompatibilityReason(card, gameState),
        }))
        .filter(item => item.reason !== null);
  }, [searchTerm, filteredStories, gameState]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterButtonText = filterExpansion.length === 0 || filterExpansion.length === expansionsForFilter.length
    ? "All Expansions"
    : filterExpansion.length === 1
    ? expansionsForFilter.find(e => e.id === filterExpansion[0])?.label
    : `${filterExpansion.length} Selected`;

  let lastExpansionId: string | null | undefined = '___INITIAL___'; // Unique initial value

  const inputBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const inputBg = isDark ? 'bg-zinc-900/50' : 'bg-[#faf8ef]';
  const inputText = isDark ? 'text-gray-200' : 'text-[#292524]';
  const inputPlaceholder = isDark ? 'placeholder-zinc-500' : 'placeholder-[#a8a29e]';
  const listContainerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const listContainerBg = isDark ? 'bg-black/20' : 'bg-[#f5f5f4]';
  const emptyStateText = isDark ? 'text-zinc-500' : 'text-[#78716c]';
  const countText = isDark ? 'text-zinc-500' : 'text-[#78350f]';

  const nextSortMode = sortMode === 'expansion' ? 'Name' : sortMode === 'name' ? 'Rating' : 'Expansion';
  const availableFilterGroups = useMemo(() => {
    const themesInStories = new Set<StoryTag>();
    validStories.forEach(story => {
        story.tags?.forEach(tag => themesInStories.add(tag));
    });

    return FILTER_GROUPS
        .map(group => ({
            ...group,
            options: group.options.filter(option => themesInStories.has(option.id))
        }))
        .filter(group => group.options.length > 0);
  }, [validStories]);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3">
        {/* Row 1: Dropdown filters */}
        <div className="flex gap-3 flex-wrap items-stretch">
          <div ref={filterRef} className="relative w-full sm:w-auto sm:flex-1 md:flex-none md:w-56">
            <button
              type="button"
              onClick={() => setIsFilterOpen(prev => !prev)}
              className={`w-full h-full flex items-center justify-between p-3 border ${inputBorder} rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg} ${inputText} transition-colors text-left`}
            >
              <span className="truncate">{filterButtonText}</span>
              <svg className={`w-5 h-5 ml-2 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            
            {isFilterOpen && (
              <div className={`absolute z-20 mt-1 w-full rounded-md shadow-lg border animate-fade-in-up ${isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-gray-200'}`}>
                <div className={`flex justify-between p-2 border-b ${isDark ? 'border-zinc-700' : 'border-gray-100'}`}>
                  <button onClick={() => setFilterExpansion(expansionsForFilter.map(e => e.id))} className={`text-xs font-bold px-2 py-1 rounded ${isDark ? 'hover:bg-zinc-700 text-blue-400' : 'hover:bg-gray-100 text-blue-600'}`}>Select All</button>
                  <button onClick={() => setFilterExpansion([])} className={`text-xs font-bold px-2 py-1 rounded ${isDark ? 'hover:bg-zinc-700 text-red-400' : 'hover:bg-gray-100 text-red-600'}`}>Clear</button>
                </div>
                <div className="max-h-60 overflow-y-auto custom-scrollbar">
                  {expansionsForFilter.map(exp => (
                    <label key={exp.id} className={`flex items-center gap-3 p-3 cursor-pointer ${isDark ? 'hover:bg-zinc-700' : 'hover:bg-gray-50'}`}>
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 dark:bg-zinc-600 dark:border-zinc-500"
                        checked={filterExpansion.includes(exp.id)}
                        onChange={() => toggleFilterExpansion(exp.id)}
                      />
                      <InlineExpansionIcon type={exp.id as ExpansionId} className="w-6 h-6 shrink-0" />
                      <span className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{exp.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {availableFilterGroups.length > 0 && (
              <div className="relative w-full sm:w-auto sm:flex-1 md:flex-none md:w-48">
                  <select
                      value={filterTheme}
                      onChange={(e) => setFilterTheme(e.target.value as StoryTag | 'all')}
                      className={`w-full h-full p-3 border ${inputBorder} rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg} ${inputText} transition-colors text-left appearance-none pr-8`}
                      aria-label="Filter by theme"
                  >
                      <option value="all">All Stories</option>
                      {availableFilterGroups.map(group => (
                          <optgroup label={group.label} key={group.label}>
                              {group.options.map(opt => <option key={opt.id} value={opt.id}>{opt.label}</option>)}
                          </optgroup>
                      ))}
                  </select>
                  <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
              </div>
          )}
        </div>

        {/* Row 2: Search and Sort */}
        <div className="flex gap-3 items-stretch">
          <input 
            type="text" 
            placeholder="Search Title or Intro..." 
            className={`flex-1 p-3 border ${inputBorder} rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:outline-none ${inputBg} ${inputText} ${inputPlaceholder} transition-colors min-w-[150px]`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <Button
              onClick={toggleSortMode}
              variant="secondary"
              className="py-2 px-4 text-xs shrink-0"
              title={`Currently sorted by ${sortMode}. Click to change.`}
          >
              Sort by {nextSortMode}
          </Button>
        </div>
      </div>
      
      <div className={`h-[350px] overflow-y-auto border ${listContainerBorder} rounded-lg ${listContainerBg} custom-scrollbar`}>
        {filteredStories.length > 0 ? (
          <>
            {filteredStories.map((card) => {
              const originalIndex = STORY_CARDS.indexOf(card);
              const showHeader = sortMode === 'expansion' && card.requiredExpansion !== lastExpansionId;
              if (showHeader) {
                lastExpansionId = card.requiredExpansion;
              }
              const expansionMeta = card.requiredExpansion ? EXPANSIONS_METADATA.find(e => e.id === card.requiredExpansion) : null;
              const headerLabel = expansionMeta ? expansionMeta.label : 'Base Game';

              return (
                <React.Fragment key={`${card.title}-${originalIndex}`}>
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
                      isSelected={selectedStoryCardIndex === originalIndex}
                      onClick={() => onSelect(originalIndex)}
                    />
                  </div>
                </React.Fragment>
              );
            })}
          </>
        ) : hiddenMatches.length > 0 ? (
          <div className="p-4">
            <h4 className="font-bold text-center mb-2 text-yellow-600 dark:text-yellow-400">Unavailable Stories Matching Your Search</h4>
            <p className="text-xs text-center text-gray-500 dark:text-gray-400 mb-4">
                These stories exist but are hidden due to your current game settings.
            </p>
            <div className="space-y-3">
                {hiddenMatches.map(({ card, reason }) => (
                    <div key={card.title} className="bg-gray-100 dark:bg-zinc-800/50 p-3 rounded-lg border border-gray-200 dark:border-zinc-700 flex items-center gap-3">
                        <div className="shrink-0 w-8 h-8">
                            <InlineExpansionIcon type={card.requiredExpansion || 'base'} />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-gray-800 dark:text-gray-200">{card.title}</p>
                            <p className="text-xs text-red-600 dark:text-red-400">{reason}</p>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        ) : (
          <div className={`flex flex-col items-center justify-center h-full ${emptyStateText} italic`}>
            <span className="text-4xl mb-2">🕵️</span>
            <p>No stories found.</p>
            <Button onClick={() => { setSearchTerm(''); setFilterExpansion([]); setFilterTheme('all'); }} variant="secondary" className="mt-4 text-sm">Clear Filters</Button>
          </div>
        )}
      </div>
      <div className={`text-right text-xs ${countText}`}>
        Showing {filteredStories.length} of {validStories.length} available stories
      </div>
    </div>
  );
};