
import { StoryCardDef } from '../types';
import { STORY_CARDS } from '../data/storyCards';

/**
 * Abstraction layer for loading story card data.
 * Since all story cards are now loaded directly in the main bundle,
 * this function simply returns the story card at the given index.
 *
 * @param index The index of the story card in the main manifest.
 * @returns A Promise resolving to the full StoryCardDef.
 */
export const loadStoryData = async (index: number): Promise<StoryCardDef> => {
    const manifest = STORY_CARDS[index];
    if (!manifest) {
        throw new Error(`Story card at index ${index} not found.`);
    }

    return manifest as StoryCardDef;
};
