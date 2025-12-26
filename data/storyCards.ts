// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { StoryCardDef } from '../types/index';
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
import { EXPANSIONS_METADATA } from './expansions';

// Create a map of expansion IDs to their sort index for consistent ordering
const expansionIndices = EXPANSIONS_METADATA.reduce((acc, exp, idx) => {
    (acc as Record<string, number>)[exp.id] = idx;
    return acc;
}, {} as Record<string, number>);

const getSortableTitle = (str: string) => {
  // First, remove any leading non-alphanumeric characters (like quotes or ellipses).
  // Then, remove a leading "The " for sorting.
  return str.replace(/^[^a-zA-Z0-9]+/, '').replace(/^The\s+/i, '');
};

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
].sort((a, b) => {
    // Base game cards (no requiredExpansion) get index -1 to stay at the very top.
    const idxA = a.requiredExpansion ? (expansionIndices[a.requiredExpansion] ?? 999) : -1;
    const idxB = b.requiredExpansion ? (expansionIndices[b.requiredExpansion] ?? 999) : -1;

    if (idxA !== idxB) {
        return idxA - idxB;
    }

    // If both cards belong to the same expansion, sort alphabetically by title
    return getSortableTitle(a.title).localeCompare(getSortableTitle(b.title));
});