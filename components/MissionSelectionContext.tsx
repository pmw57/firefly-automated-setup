
import React, { useState, useMemo, useCallback } from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { StoryCardDef, AdvancedRuleDef } from '../types/index';
import { useGameState } from '../hooks/useGameState';
import { MissionSelectionContext } from '../hooks/useMissionSelection';
import { getAvailableStoryCards, getFilteredStoryCards, getActiveStoryCard, getStoryCardByTitle, getAvailableAdvancedRules } from '../utils/selectors/story';
import { ActionType } from '../state/actions';

export const MissionSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: gameState, dispatch } = useGameState();
  
  // Local UI State for this step
  const [searchTerm, setSearchTerm] = useState('');
  const [filterExpansion, setFilterExpansion] = useState<string[]>([]);
  const [shortList, setShortList] = useState<StoryCardDef[]>([]);
  const [subStep, setSubStep] = useState(1);
  const [sortMode, setSortMode] = useState<'expansion' | 'name'>('expansion');

  // Memoized derived data
  const activeStoryCard = useMemo(() => getActiveStoryCard(gameState), [gameState]);

  const validStories = useMemo(() => getAvailableStoryCards(gameState), [gameState]);

  const filteredStories = useMemo(() => {
    return getFilteredStoryCards(gameState, { searchTerm, filterExpansion, sortMode });
  }, [gameState, searchTerm, filterExpansion, sortMode]);

  const availableAdvancedRules: AdvancedRuleDef[] = useMemo(() => 
    getAvailableAdvancedRules(gameState, activeStoryCard),
    [gameState, activeStoryCard]
  );

  const enablePart2 = useMemo(() => 
    gameState.gameMode === 'solo' && gameState.expansions.tenth,
    [gameState.gameMode, gameState.expansions.tenth]
  );

  // Actions wrapped in useCallback for performance
  const handleStoryCardSelect = useCallback((title: string) => {
    const card = getStoryCardByTitle(title);
    dispatch({ 
      type: ActionType.SET_STORY_CARD, 
      payload: { 
        title, 
        goal: card?.goals?.[0]?.title 
      } 
    });
  }, [dispatch]);

  const handleRandomPick = useCallback(() => {
    if (validStories.length === 0) return;
    const r = Math.floor(Math.random() * validStories.length);
    handleStoryCardSelect(validStories[r].title);
    setShortList([]);
  }, [validStories, handleStoryCardSelect]);

  const handleGenerateShortList = useCallback(() => {
    if (validStories.length === 0) return;
    const shuffled = [...validStories].sort(() => 0.5 - Math.random());
    setShortList(shuffled.slice(0, 3));
  }, [validStories]);

  const handlePickFromShortList = useCallback(() => {
    if (shortList.length === 0) return;
    const r = Math.floor(Math.random() * shortList.length);
    handleStoryCardSelect(shortList[r].title);
  }, [shortList, handleStoryCardSelect]);

  const handleCancelShortList = useCallback(() => setShortList([]), []);
  
  const toggleSortMode = useCallback(() => {
    setSortMode(prev => prev === 'expansion' ? 'name' : 'expansion');
  }, []);

  const toggleFilterExpansion = useCallback((id: string) => {
    setFilterExpansion(prev => {
        if (prev.includes(id)) {
            return prev.filter(expId => expId !== id);
        } else {
            return [...prev, id];
        }
    });
  }, []);

  const value = {
    searchTerm,
    filterExpansion,
    shortList,
    subStep,
    activeStoryCard,
    validStories,
    filteredStories,
    availableAdvancedRules,
    enablePart2,
    sortMode,
    setSearchTerm,
    setFilterExpansion,
    setSubStep,
    handleStoryCardSelect,
    handleRandomPick,
    handleGenerateShortList,
    handlePickFromShortList,
    handleCancelShortList,
    toggleSortMode,
    toggleFilterExpansion,
  };

  return (
    <MissionSelectionContext.Provider value={value}>
      {children}
    </MissionSelectionContext.Provider>
  );
}