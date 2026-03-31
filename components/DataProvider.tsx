import React, { useState, useEffect } from 'react';
import { StoryCardDef, SetupCardDef } from '../types';
import { LocationDef } from '../types/locations';
import { storyService } from '../src/services/storyService';
import { setupCardService } from '../src/services/setupCardService';
import { locationService } from '../src/services/locationService';
import { STORY_CARDS as STATIC_STORIES } from '../data/storyCards/index';
import { SETUP_CARDS as STATIC_SETUP } from '../data/setupCards';
import { ALL_LOCATIONS as STATIC_LOCATIONS } from '../data/locations/index';

import { DataContext } from './DataContext';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stories, setStories] = useState<StoryCardDef[]>(STATIC_STORIES as StoryCardDef[]);
  const [setupCards, setSetupCards] = useState<SetupCardDef[]>(STATIC_SETUP as SetupCardDef[]);
  const [locations, setLocations] = useState<LocationDef[]>(STATIC_LOCATIONS as LocationDef[]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFromDb, setIsFromDb] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dbStories, dbSetup, dbLocations] = await Promise.all([
        storyService.getAllStories(),
        setupCardService.getAllSetupCards(),
        locationService.getAllLocations()
      ]);

      if (dbStories.length > 0) {
        setStories(dbStories);
        setIsFromDb(true);
      }
      if (dbSetup.length > 0) {
        setSetupCards(dbSetup);
        setIsFromDb(true);
      }
      if (dbLocations.length > 0) {
        setLocations(dbLocations);
        setIsFromDb(true);
      }
    } catch (error) {
      console.error("Failed to fetch data from Firestore, falling back to static data", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Set up real-time subscriptions
    const unsubStories = storyService.subscribeToStories((data: StoryCardDef[]) => {
      if (data.length > 0) {
        setStories(data);
        setIsFromDb(true);
      }
    });

    const unsubSetup = setupCardService.subscribeToSetupCards((data: SetupCardDef[]) => {
      if (data.length > 0) {
        setSetupCards(data);
        setIsFromDb(true);
      }
    });

    const unsubLocations = locationService.subscribeToLocations((data: LocationDef[]) => {
      if (data.length > 0) {
        setLocations(data);
        setIsFromDb(true);
      }
    });

    return () => {
      unsubStories();
      unsubSetup();
      unsubLocations();
    };
  }, []);

  return (
    <DataContext.Provider value={{ stories, setupCards, locations, isLoading, isFromDb, refreshData: fetchData }}>
      {children}
    </DataContext.Provider>
  );
};
