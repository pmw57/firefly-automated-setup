import { storyService } from './src/services/storyService';
import { setupCardService } from './src/services/setupCardService';
import { locationService } from './src/services/locationService';
import { STORY_CARDS } from './data/storyCards/index';
import { SETUP_CARDS } from './data/setupCards';
import { ALL_LOCATIONS } from './data/locations/index';
import { StoryCardDef, SetupCardDef } from './types';
import { LocationDef } from './types/locations';

/**
 * Migration script to upload static story cards to Firestore.
 */
export const migrateStoriesToFirestore = async () => {
  console.log('Starting migration of story cards to Firestore...');
  let successCount = 0;
  let errorCount = 0;

  for (const story of STORY_CARDS) {
    try {
      await storyService.saveStory(story as StoryCardDef);
      successCount++;
      console.log(`Successfully migrated story: ${story.title}`);
    } catch (error) {
      errorCount++;
      console.error(`Failed to migrate story: ${story.title}`, error);
    }
  }

  console.log(`Story migration complete. Success: ${successCount}, Errors: ${errorCount}`);
  return { successCount, errorCount, total: STORY_CARDS.length };
};

/**
 * Migration script to upload static setup cards to Firestore.
 */
export const migrateSetupCardsToFirestore = async () => {
  console.log('Starting migration of setup cards to Firestore...');
  let successCount = 0;
  let errorCount = 0;

  for (const card of SETUP_CARDS) {
    try {
      await setupCardService.saveSetupCard(card as SetupCardDef);
      successCount++;
      console.log(`Successfully migrated setup card: ${card.label}`);
    } catch (error) {
      errorCount++;
      console.error(`Failed to migrate setup card: ${card.label}`, error);
    }
  }

  console.log(`Setup card migration complete. Success: ${successCount}, Errors: ${errorCount}`);
  return { successCount, errorCount, total: SETUP_CARDS.length };
};

/**
 * Migration script to upload static locations to Firestore.
 */
export const migrateLocationsToFirestore = async () => {
  console.log('Starting migration of locations to Firestore...');
  let successCount = 0;
  let errorCount = 0;

  for (const location of ALL_LOCATIONS) {
    try {
      await locationService.saveLocation(location as LocationDef);
      successCount++;
      console.log(`Successfully migrated location: ${location.label}`);
    } catch (error) {
      errorCount++;
      console.error(`Failed to migrate location: ${location.label}`, error);
    }
  }

  console.log(`Location migration complete. Success: ${successCount}, Errors: ${errorCount}`);
  return { successCount, errorCount, total: ALL_LOCATIONS.length };
};
