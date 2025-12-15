
import { StoryCardDef } from '../types';
import { SOLO_STORIES } from './storyCards/solo';
import { CORE_STORIES } from './storyCards/core';
import { TENTH_STORIES } from './storyCards/tenth';
import { STILL_FLYING_STORIES } from './storyCards/stillFlying';
import { BLUE_SUN_STORIES } from './storyCards/blueSun';
import { KALIDASA_STORIES } from './storyCards/kalidasa';
import { PIRATES_STORIES } from './storyCards/pirates';
import { CRIME_STORIES } from './storyCards/crime';
import { COACHWORKS_STORIES } from './storyCards/coachworks';
import { BLACK_MARKET_STORIES } from './storyCards/blackMarket';
import { COMMUNITY_STORIES } from './storyCards/community';

export const STORY_CARDS: StoryCardDef[] = [
  ...SOLO_STORIES,
  ...CORE_STORIES,
  ...TENTH_STORIES,
  ...STILL_FLYING_STORIES,
  ...BLUE_SUN_STORIES,
  ...KALIDASA_STORIES,
  ...PIRATES_STORIES,
  ...CRIME_STORIES,
  ...COACHWORKS_STORIES,
  ...BLACK_MARKET_STORIES,
  ...COMMUNITY_STORIES
];
