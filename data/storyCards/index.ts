import { StoryCardDef } from '../../types/index';
import { EXPANSIONS_METADATA } from '../expansions';

import { ACES_EIGHTS_STORIES } from './acesAndEights';
import { BLACK_MARKET_STORIES } from './blackMarket';
import { BLUE_SUN_STORIES } from './blueSun';
import { CANTANKEROUS_STORIES } from './cantankerous';
import { COACHWORKS_STORIES } from './coachworks';
import { COMMUNITY_STORIES } from './community/index';
import { CORE_STORIES } from './core';
import { CRIME_STORIES } from './crime';
import { HUNTINGDONS_BOLT_STORIES } from './huntingdonsBolt';
import { KALIDASA_STORIES } from './kalidasa';
import { PIRATES_STORIES } from './pirates';
import { SOLO_STORIES } from './solo';
import { STILL_FLYING_STORIES } from './stillFlying';
import { TENTH_STORIES } from './tenth';
import { WHITE_LIGHTNING_STORIES } from './whiteLightning';

const expansionIndices = EXPANSIONS_METADATA.reduce((acc, exp, idx) => {
    (acc as Record<string, number>)[exp.id] = idx;
    return acc;
}, {} as Record<string, number>);

const getSortableTitle = (str: string) => {
  return str.replace(/^[^a-zA-Z0-9]+/, '').replace(/^The\s+/i, '');
};

const sortStories = (stories: StoryCardDef[]) => {
    return stories.sort((a, b) => {
        if (a.sortOrder !== undefined && b.sortOrder !== undefined) {
            return a.sortOrder - b.sortOrder;
        }
        if (a.sortOrder !== undefined) return -1;
        if (b.sortOrder !== undefined) return 1;

        const idxA = a.requiredExpansion ? (expansionIndices[a.requiredExpansion] ?? 999) : -1;
        const idxB = b.requiredExpansion ? (expansionIndices[b.requiredExpansion] ?? 999) : -1;

        if (idxA !== idxB) {
            return idxA - idxB;
        }

        return getSortableTitle(a.title).localeCompare(getSortableTitle(b.title));
    });
};

const RAW_MANIFEST: StoryCardDef[] = [
    ...ACES_EIGHTS_STORIES,
    ...BLACK_MARKET_STORIES,
    ...BLUE_SUN_STORIES,
    ...CANTANKEROUS_STORIES,
    ...COACHWORKS_STORIES,
    ...COMMUNITY_STORIES,
    ...CORE_STORIES,
    ...CRIME_STORIES,
    ...HUNTINGDONS_BOLT_STORIES,
    ...KALIDASA_STORIES,
    ...PIRATES_STORIES,
    ...SOLO_STORIES,
    ...STILL_FLYING_STORIES,
    ...TENTH_STORIES,
    ...WHITE_LIGHTNING_STORIES,
];

export const STORY_CARDS: StoryCardDef[] = sortStories(RAW_MANIFEST);
