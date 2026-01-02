import { createContext, useContext } from 'react';
import { StoryCardDef, AdvancedRuleDef, GameState } from '../types';

// Define the shape of the context data
export interface MissionSelectionContextType {
  searchTerm: string;
  filterExpansion: string[];
  filterCoOpOnly: boolean;
  shortList: StoryCardDef[];
  subStep: number;
  sortMode: 'expansion' | 'name' | 'rating';
  activeStoryCard: StoryCardDef | undefined;
  selectedStoryCardIndex: number | null;
  validStories: StoryCardDef[];
  filteredStories: StoryCardDef[];
  availableAdvancedRules: AdvancedRuleDef[];
  enablePart2: boolean;
  setSearchTerm: (term: string) => void;
  setFilterExpansion: (ids: string[]) => void;
  toggleFilterExpansion: (id: string) => void;
  toggleFilterCoOp: () => void;
  setSubStep: (step: number) => void;
  toggleSortMode: () => void;
  handleStoryCardSelect: (index: number | null) => void;
  handleRandomPick: () => void;
  handleGenerateShortList: () => void;
  handlePickFromShortList: () => void;
  handleCancelShortList: () => void;
  gameState: GameState;
}

// Create and export the context object. The initial value is undefined
// because the provider will supply the real value.
export const MissionSelectionContext = createContext<MissionSelectionContextType | undefined>(undefined);

// Create and export the custom hook for consuming the context.
export const useMissionSelection = (): MissionSelectionContextType => {
  const context = useContext(MissionSelectionContext);
  if (context === undefined) {
    throw new Error('useMissionSelection must be used within a MissionSelectionProvider');
  }
  return context;
};