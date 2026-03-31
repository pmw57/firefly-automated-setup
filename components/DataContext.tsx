import { createContext } from 'react';
import { StoryCardDef, SetupCardDef } from '../types';
import { LocationDef } from '../types/locations';

export interface DataContextType {
  stories: StoryCardDef[];
  setupCards: SetupCardDef[];
  locations: LocationDef[];
  isLoading: boolean;
  isFromDb: boolean;
  refreshData: () => Promise<void>;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);
