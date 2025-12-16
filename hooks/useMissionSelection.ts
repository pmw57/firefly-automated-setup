
import { createContext, useContext } from 'react';
import { StoryCardDef, AdvancedRuleDef } from '../types';

export interface MissionSelectionContextType {
  // State
  searchTerm: string;
  filterExpansion: string;
  shortList: StoryCardDef[];
  subStep: number;
  
  // Derived Data
  activeStoryCard: StoryCardDef | undefined;
  validStories: StoryCardDef[];
  filteredStories: StoryCardDef[];
  availableAdvancedRules: AdvancedRuleDef[];
  isClassicSolo: boolean;
  enablePart2: boolean;

  // Actions
  setSearchTerm: (term: string) => void;
  setFilterExpansion: (id: string) => void;
  setSubStep: (step: number) => void;
  handleStoryCardSelect: (title: string) => void;
  handleRandomPick: () => void;
  handleGenerateShortList: () => void;
  handlePickFromShortList: () => void;
  handleCancelShortList: () => void;
}

export const MissionSelectionContext = createContext<MissionSelectionContextType | undefined>(undefined);

export const useMissionSelection = (): MissionSelectionContextType => {
  const context = useContext(MissionSelectionContext);
  if (context === undefined) {
    throw new Error('useMissionSelection must be used within a MissionSelectionProvider');
  }
  return context;
};