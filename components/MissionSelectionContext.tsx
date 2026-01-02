import React, { useMemo, useCallback, useReducer, useEffect } from 'react';
import { StoryCardDef, AdvancedRuleDef } from '../types';
import { useGameState } from '../hooks/useGameState';
import { MissionSelectionContext } from '../hooks/useMissionSelection';
import { getAvailableStoryCards, getFilteredStoryCards, getActiveStoryCard, getAvailableAdvancedRules } from '../utils/selectors/story';
import { ActionType } from '../state/actions';
import { STORY_CARDS } from '../data/storyCards';

interface LocalState {
  searchTerm: string;
  filterExpansion: string[];
  filterCoOpOnly: boolean;
  shortList: StoryCardDef[];
  subStep: number;
  sortMode: 'expansion' | 'name' | 'rating';
}

type LocalAction =
  | { type: 'SET_SEARCH_TERM'; payload: string }
  | { type: 'SET_FILTER_EXPANSION'; payload: string[] }
  | { type: 'TOGGLE_FILTER_EXPANSION'; payload: string }
  | { type: 'TOGGLE_FILTER_CO_OP' }
  | { type: 'SET_SHORT_LIST'; payload: StoryCardDef[] }
  | { type: 'SET_SUB_STEP'; payload: number }
  | { type: 'TOGGLE_SORT_MODE' };

const initialState: LocalState = {
  searchTerm: '',
  filterExpansion: [],
  filterCoOpOnly: false,
  shortList: [],
  subStep: 1,
  sortMode: 'expansion',
};

function reducer(state: LocalState, action: LocalAction): LocalState {
  switch (action.type) {
    case 'SET_SEARCH_TERM':
      return { ...state, searchTerm: action.payload };
    case 'SET_FILTER_EXPANSION':
      return { ...state, filterExpansion: action.payload };
    case 'TOGGLE_FILTER_EXPANSION': {
      const { payload: id } = action;
      const newFilter = state.filterExpansion.includes(id)
        ? state.filterExpansion.filter(expId => expId !== id)
        : [...state.filterExpansion, id];
      return { ...state, filterExpansion: newFilter };
    }
    case 'TOGGLE_FILTER_CO_OP':
      return { ...state, filterCoOpOnly: !state.filterCoOpOnly };
    case 'SET_SHORT_LIST':
      return { ...state, shortList: action.payload };
    case 'SET_SUB_STEP':
      return { ...state, subStep: action.payload };
    case 'TOGGLE_SORT_MODE': {
      const nextMode = state.sortMode === 'expansion' 
        ? 'name' 
        : state.sortMode === 'name'
        ? 'rating'
        : 'expansion';
      return { ...state, sortMode: nextMode };
    }
    default:
      return state;
  }
}

export const MissionSelectionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state: gameState, dispatch: gameDispatch } = useGameState();
  const [localState, localDispatch] = useReducer(reducer, initialState);
  const { searchTerm, filterExpansion, filterCoOpOnly, shortList, subStep, sortMode } = localState;
  
  // Memoized derived data
  const activeStoryCard = useMemo(() => getActiveStoryCard(gameState), [gameState]);
  const validStories = useMemo(() => getAvailableStoryCards(gameState), [gameState]);
  const filteredStories = useMemo(() => {
    return getFilteredStoryCards(gameState, { searchTerm, filterExpansion, filterCoOpOnly, sortMode });
  }, [gameState, searchTerm, filterExpansion, filterCoOpOnly, sortMode]);
  const availableAdvancedRules: AdvancedRuleDef[] = useMemo(() => 
    getAvailableAdvancedRules(gameState, activeStoryCard),
    [gameState, activeStoryCard]
  );
  const enablePart2 = useMemo(() => 
    gameState.gameMode === 'solo' && gameState.expansions.tenth,
    [gameState.gameMode, gameState.expansions.tenth]
  );

  // When valid stories change, sanitize the expansion filter to remove any
  // selections that are no longer relevant.
  useEffect(() => {
    const storyExpansionIds = new Set<string>();
    validStories.forEach(story => {
      storyExpansionIds.add(story.requiredExpansion || 'base');
    });

    const newFilterExpansion = filterExpansion.filter(expId => storyExpansionIds.has(expId));

    if (newFilterExpansion.length !== filterExpansion.length) {
      localDispatch({ type: 'SET_FILTER_EXPANSION', payload: newFilterExpansion });
    }
  }, [validStories, filterExpansion]);

  // --- Action Dispatchers ---
  const setSearchTerm = useCallback((term: string) => localDispatch({ type: 'SET_SEARCH_TERM', payload: term }), []);
  const setFilterExpansion = useCallback((ids: string[]) => localDispatch({ type: 'SET_FILTER_EXPANSION', payload: ids }), []);
  const setSubStep = useCallback((step: number) => localDispatch({ type: 'SET_SUB_STEP', payload: step }), []);
  const toggleSortMode = useCallback(() => localDispatch({ type: 'TOGGLE_SORT_MODE' }), []);
  const toggleFilterExpansion = useCallback((id: string) => localDispatch({ type: 'TOGGLE_FILTER_EXPANSION', payload: id }), []);
  const toggleFilterCoOp = useCallback(() => localDispatch({ type: 'TOGGLE_FILTER_CO_OP' }), []);
  const handleCancelShortList = useCallback(() => localDispatch({ type: 'SET_SHORT_LIST', payload: [] }), []);

  // --- Handlers with Logic ---
  const handleStoryCardSelect = useCallback((index: number | null) => {
    const card = index !== null ? STORY_CARDS[index] : undefined;
    gameDispatch({ 
      type: ActionType.SET_STORY_CARD, 
      payload: { 
        index, 
        goal: card?.goals?.[0]?.title 
      } 
    });
  }, [gameDispatch]);

  const handleRandomPick = useCallback(() => {
    if (validStories.length === 0) return;
    const r = Math.floor(Math.random() * validStories.length);
    const card = validStories[r];
    const originalIndex = STORY_CARDS.indexOf(card);
    handleStoryCardSelect(originalIndex);
    localDispatch({ type: 'SET_SHORT_LIST', payload: [] });
  }, [validStories, handleStoryCardSelect]);

  const handleGenerateShortList = useCallback(() => {
    if (validStories.length === 0) return;
    const shuffled = [...validStories].sort(() => 0.5 - Math.random());
    localDispatch({ type: 'SET_SHORT_LIST', payload: shuffled.slice(0, 3) });
  }, [validStories]);

  const handlePickFromShortList = useCallback(() => {
    if (shortList.length === 0) return;
    const r = Math.floor(Math.random() * shortList.length);
    const card = shortList[r];
    const originalIndex = STORY_CARDS.indexOf(card);
    handleStoryCardSelect(originalIndex);
  }, [shortList, handleStoryCardSelect]);

  const value = {
    // State
    searchTerm,
    filterExpansion,
    filterCoOpOnly,
    shortList,
    subStep,
    sortMode,
    // Derived Data
    activeStoryCard,
    selectedStoryCardIndex: gameState.selectedStoryCardIndex,
    validStories,
    filteredStories,
    availableAdvancedRules,
    enablePart2,
    // Actions
    setSearchTerm,
    setFilterExpansion,
    toggleFilterExpansion,
    toggleFilterCoOp,
    setSubStep,
    toggleSortMode,
    // Handlers
    handleStoryCardSelect,
    handleRandomPick,
    handleGenerateShortList,
    handlePickFromShortList,
    handleCancelShortList,
  };

  return (
    <MissionSelectionContext.Provider value={value}>
      {children}
    </MissionSelectionContext.Provider>
  );
}