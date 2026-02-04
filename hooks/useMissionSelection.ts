
import { createContext, useContext } from 'react';
import { StoryCardDef, AdvancedRuleDef, GameState, StoryTag } from '../types';

export interface MissionSelectionContextType {
  searchTerm: string;
  filterExpansion: string[];
  filterTheme: StoryTag | 'all';
  shortList: StoryCardDef[];
  subStep: number;
  sortMode: 'expansion' | 'name' | 'rating';
  activeStoryCard: StoryCardDef | undefined;
  selectedStoryCardIndex: number | null;
  validStories: StoryCardDef[];
  filteredStories: StoryCardDef[];
  allPotentialAdvancedRules: AdvancedRuleDef[];
  enablePart2: boolean;
  
  // Loading State
  isLoading: boolean;
  
  setSearchTerm: (term: string) => void;
  setFilterExpansion: (ids: string[]) => void;
  toggleFilterExpansion: (id: string) => void;
  setFilterTheme: (theme: StoryTag | 'all') => void;
  setSubStep: (step: number) => void;
  toggleSortMode: () => void;
  
  // Async Handler
  handleStoryCardSelect: (index: number | null) => Promise<void>;
  
  handleRandomPick: () => void;
  handleGenerateShortList: () => void;
  handlePickFromShortList: () => void;
  handleCancelShortList: () => void;
  handleJump?: (index: number) => void;
  gameState: GameState;
}

export const MissionSelectionContext = createContext<MissionSelectionContextType | undefined>(undefined);

export const useMissionSelection = (): MissionSelectionContextType => {
  const context = useContext(MissionSelectionContext);
  if (context === undefined) {
    throw new Error('useMissionSelection must be used within a MissionSelectionProvider');
  }
  return context;
};
