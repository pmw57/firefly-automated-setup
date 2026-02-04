
import { StoryCardDef } from '../../types';
import { CORE_STORIES } from '../../data/storyCards/core';
import { BLUE_SUN_STORIES } from '../../data/storyCards/blueSun';
import { KALIDASA_STORIES } from '../../data/storyCards/kalidasa';
import { PIRATES_STORIES } from '../../data/storyCards/pirates';
import { CRIME_STORIES } from '../../data/storyCards/crime';
import { COACHWORKS_STORIES } from '../../data/storyCards/coachworks';
import { TENTH_STORIES } from '../../data/storyCards/tenth';
import { ACES_EIGHTS_STORIES } from '../../data/storyCards/acesAndEights';
import { WHITE_LIGHTNING_STORIES } from '../../data/storyCards/whiteLightning';
import { CANTANKEROUS_STORIES } from '../../data/storyCards/cantankerous';
import { HUNTINGDONS_BOLT_STORIES } from '../../data/storyCards/huntingdonsBolt';
import { BLACK_MARKET_STORIES } from '../../data/storyCards/blackMarket';
import { STILL_FLYING_STORIES } from '../../data/storyCards/stillFlying';
import { COMMUNITY_STORIES } from '../../data/storyCards/community';
import { SOLO_STORIES } from '../../data/storyCards/solo';

// Aggregates all split story chunks into a single array for unit testing data integrity.
// This bypasses the manifest/lazy-loading system to ensure the actual rules are validated.
export const ALL_FULL_STORIES: StoryCardDef[] = [
    ...CORE_STORIES,
    ...BLUE_SUN_STORIES,
    ...KALIDASA_STORIES,
    ...PIRATES_STORIES,
    ...CRIME_STORIES,
    ...COACHWORKS_STORIES,
    ...TENTH_STORIES,
    ...ACES_EIGHTS_STORIES,
    ...WHITE_LIGHTNING_STORIES,
    ...CANTANKEROUS_STORIES,
    ...HUNTINGDONS_BOLT_STORIES,
    ...BLACK_MARKET_STORIES,
    ...STILL_FLYING_STORIES,
    ...COMMUNITY_STORIES,
    ...SOLO_STORIES
];

export const getTestStory = (title: string): StoryCardDef => {
    const story = ALL_FULL_STORIES.find(c => c.title === title);
    if (!story) {
        throw new Error(`Test Helper Error: Story card with title "${title}" not found in ALL_FULL_STORIES. Verify data file exports.`);
    }
    return story;
};
