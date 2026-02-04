
import { StoryCardDef } from '../types';
import { STORY_CARDS } from '../data/storyCards';

/**
 * Abstraction layer for loading story card data.
 * Dynamically imports the heavy rule data based on the story's expansion metadata.
 *
 * @param index The index of the story card in the main manifest.
 * @returns A Promise resolving to the full StoryCardDef.
 */
export const loadStoryData = async (index: number): Promise<StoryCardDef> => {
    const manifest = STORY_CARDS[index];
    if (!manifest) {
        throw new Error(`Story card at index ${index} not found.`);
    }

    const expansionId = manifest.requiredExpansion || 'base';
    let module;

    // Map expansion IDs to their respective data file chunks
    switch (expansionId) {
        case 'base':
            module = await import('../data/storyCards/core');
            break;
        case 'community':
            module = await import('../data/storyCards/community/index');
            break;
        case 'breakin_atmo':
            // Breakin' Atmo has no story cards of its own, but we handle it safely.
            // If a story claims this requirement, it might be in a shared file or mislabeled.
            // For now, assume it might be in core or throw.
            throw new Error(`No story file for expansion: ${expansionId}`);
        case 'big_damn_heroes':
            // Similarly, BDH has no stories.
             throw new Error(`No story file for expansion: ${expansionId}`);
        case 'blue':
            module = await import('../data/storyCards/blueSun');
            break;
        case 'kalidasa':
            module = await import('../data/storyCards/kalidasa');
            break;
        case 'pirates':
            module = await import('../data/storyCards/pirates');
            break;
        case 'crime':
            module = await import('../data/storyCards/crime');
            break;
        case 'coachworks':
            module = await import('../data/storyCards/coachworks');
            break;
        case 'tenth':
            module = await import('../data/storyCards/tenth');
            break;
        case 'aces_eights':
            module = await import('../data/storyCards/acesAndEights');
            break;
        case 'white_lightning':
            module = await import('../data/storyCards/whiteLightning');
            break;
        case 'cantankerous':
            module = await import('../data/storyCards/cantankerous');
            break;
        case 'huntingdons_bolt':
            module = await import('../data/storyCards/huntingdonsBolt');
            break;
        case 'black_market':
            module = await import('../data/storyCards/blackMarket');
            break;
        case 'still_flying':
            module = await import('../data/storyCards/stillFlying');
            break;
        // Local Color doesn't have its own stories usually, but handled safely
        default:
            // Fallback: If we can't map it, we might be looking at a solo story or something
            // that is categorized differently in the file system.
            // Check for specific "Solo" files if the card is solo.
            if (manifest.isSolo) {
                if (manifest.requiredExpansion === 'tenth' || manifest.requiredExpansion === undefined) {
                     // Solo stories are split between solo.ts and expansion files.
                     // Try loading solo.ts first.
                     try {
                        module = await import('../data/storyCards/solo');
                        const stories = Object.values(module).flat() as StoryCardDef[];
                        const found = stories.find(s => s.title === manifest.title);
                        if (found) return found;
                     } catch (e) {
                        // ignore and try standard mapping
                     }
                }
            }
            throw new Error(`Unknown expansion ID for story loading: ${expansionId}`);
    }

    // Flatten the export (handles default exports or named array exports)
    const stories = Object.values(module).flat() as StoryCardDef[];
    const fullStory = stories.find(s => s.title === manifest.title);

    if (!fullStory) {
        // Special case: Some solo stories are in `solo.ts` but might be tagged with an expansion.
        // If not found in the expansion file, try the generic solo file.
        if (manifest.isSolo) {
             const soloModule = await import('../data/storyCards/solo');
             const soloStories = Object.values(soloModule).flat() as StoryCardDef[];
             const found = soloStories.find(s => s.title === manifest.title);
             if (found) return found;
        }
        
        throw new Error(`Story "${manifest.title}" not found in loaded chunk for ${expansionId}.`);
    }

    return fullStory;
};
