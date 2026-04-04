import { createContext } from 'react';
import { StoryCardDef, SetupCardDef } from '../types';
import { LocationDef } from '../types/locations';

export interface DataContextType {
  stories: StoryCardDef[];
  setupCards: SetupCardDef[];
  locations: LocationDef[];
  isLoading: boolean;
}

export const DataContext = createContext<DataContextType | undefined>(undefined);
