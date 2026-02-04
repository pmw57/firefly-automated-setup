
/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { STORY_CARDS } from '../../../data/storyCards';
import { SETUP_CARDS } from '../../../data/setupCards';
import { StoryCardSchema, SetupCardSchema } from '../../../data/schemas';

describe('Data Integrity (Schema Validation)', () => {
    describe('Story Cards', () => {
        STORY_CARDS.forEach(card => {
            it.concurrent(`"${card.title}" should be valid`, () => {
                const result = StoryCardSchema.safeParse(card);
                if (!result.success) {
                    console.error(`Validation Error in Story Card "${card.title}":`, result.error.format());
                }
                expect(result.success).toBe(true);
            });
        });
    });

    describe('Setup Cards', () => {
        SETUP_CARDS.forEach(card => {
            it.concurrent(`"${card.label}" should be valid`, () => {
                const result = SetupCardSchema.safeParse(card);
                if (!result.success) {
                    console.error(`Validation Error in Setup Card "${card.label}":`, result.error.format());
                }
                expect(result.success).toBe(true);
            });
        });
    });
});
