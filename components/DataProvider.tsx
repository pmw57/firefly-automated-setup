import React, { useState, useEffect } from 'react';
import { StoryCardDef, SetupCardDef } from '../types';
import { LocationDef } from '../types/locations';
import { STORY_CARDS as STATIC_STORIES } from '../data/storyCards/index';
import { SETUP_CARDS as STATIC_SETUP } from '../data/setupCards';
import { ALL_LOCATIONS as STATIC_LOCATIONS } from '../data/locations/index';

import { DataContext } from './DataContext';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories] = useState<StoryCardDef[]>(STATIC_STORIES as StoryCardDef[]);
  const [setupCards] = useState<SetupCardDef[]>(STATIC_SETUP as SetupCardDef[]);
  const [locations] = useState<LocationDef[]>(STATIC_LOCATIONS as LocationDef[]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // We can still simulate loading or for future-proofing,
    // but for now, we just set isLoading to false.
    setIsLoading(false);
  }, []);

  return (
    <DataContext.Provider value={{ stories, setupCards, locations, isLoading }}>
      {children}
    </DataContext.Provider>
  );
};
