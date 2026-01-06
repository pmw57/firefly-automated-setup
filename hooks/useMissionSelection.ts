import { createContext, useContext } from 'react';
import { StoryCardDef, AdvancedRuleDef, GameState } from '../types';

export interface MissionSelectionContextType {
  searchTerm: string;
  filterExpansion: string[];
  filterGameType: 'all' | 'solo' | 'co-op' | 'pvp';
  shortList: StoryCardDef[];
  subStep: number;
  sortMode: 'expansion' | 'name' | 'rating';
  activeStoryCard: StoryCardDef | undefined;
  selectedStoryCardIndex: number | null;
  validStories: StoryCardDef[];
  filteredStories: StoryCardDef[];
  allPotentialAdvancedRules: AdvancedRuleDef[];
  enablePart2: boolean;
  setSearchTerm: (term: string) => void;
  setFilterExpansion: (ids: string[]) => void;
  toggleFilterExpansion: (id: string) => void;
  setFilterGameType: (type: 'all' | 'solo' | 'co-op' | 'pvp') => void;
  setSubStep: (step: number) => void;
  toggleSortMode: () => void;
  handleStoryCardSelect: (index: number | null) => void;
  handleRandomPick: () => void;
  handleGenerateShortList: () => void;
  handlePickFromShortList: () => void;
  handleCancelShortList: () => void;
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