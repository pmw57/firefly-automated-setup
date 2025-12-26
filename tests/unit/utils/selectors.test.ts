/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getAvailableStoryCards, getAvailableSetupCards } from '../../../utils/selectors/story';
import { GameState } from '../../../types';
import { getDefaultGameState } from '../../../state/reducer';
import { SETUP_CARD_IDS } from '../../../data/ids';
import { SETUP_CARDS } from '../../../data/setupCards';

describe('utils/selectors', () => {
    const baseGameState = getDefaultGameState();

    describe('getAvailableSetupCards', () => {
        it.concurrent('should return all non-FlyingSolo cards when all expansions are enabled', () => {
            const cards = getAvailableSetupCards(baseGameState);
            // Total setup cards (12) minus Flying Solo (1) = 11
            expect(cards.length).toBe(SETUP_CARDS.length - 1);
            expect(cards.find(c => c.id === SETUP_CARD_IDS.FLYING_SOLO)).toBeUndefined();
        });

        it.concurrent('should filter out cards whose required expansion is disabled', () => {
            const state: GameState = {
                ...baseGameState,
                expansions: { ...baseGameState.expansions, crime: false }
            };
            const cards = getAvailableSetupCards(state);
            expect(cards.find(c => c.id === SETUP_CARD_IDS.ALLIANCE_HIGH_ALERT)).toBeUndefined();
        });

        it.concurrent('should not filter out cards that have no required expansion', () => {
            const state: GameState = {
                ...baseGameState,
                expansions: { ...baseGameState.expansions, crime: false }
            };
            const cards = getAvailableSetupCards(state);
            expect(cards.find(c => c.id === SETUP_CARD_IDS.STANDARD)).toBeDefined();
        });

        it.concurrent('should sort cards by expansion order, then alphabetically', () => {
            const cards = getAvailableSetupCards(baseGameState);
            // Standard is first (no expansion)
            expect(cards[0].id).toBe(SETUP_CARD_IDS.STANDARD);
            // Blue Sun card comes before Kalidasa card
            const blueSunIndex = cards.findIndex(c => c.id === SETUP_CARD_IDS.AWFUL_CROWDED);
            const kalidasaIndex = cards.findIndex(c => c.id === SETUP_CARD_IDS.RIMS_THE_THING);
            expect(blueSunIndex).toBeLessThan(kalidasaIndex);
        });
    });

    describe('getAvailableStoryCards', () => {
        it.concurrent('should filter out solo stories in multiplayer mode', () => {
            const multiplayerState: GameState = { ...baseGameState, gameMode: 'multiplayer' };
            const cards = getAvailableStoryCards(multiplayerState);
            expect(cards.some(c => c.isSolo)).toBe(false);
        });

        it.concurrent('should only return "Awful Lonely" in classic solo mode', () => {
            const classicSoloState: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.STANDARD };
            const cards = getAvailableStoryCards(classicSoloState);
            expect(cards.length).toBe(1);
            expect(cards[0].title).toBe("Awful Lonely In The Big Black");
        });

        it.concurrent('should filter based on expansion requirements', () => {
            const stateNoBlue: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false }};
            const cards = getAvailableStoryCards(stateNoBlue);
            const blueSunStory = cards.find(c => c.title === 'The Great Recession');
            expect(blueSunStory).toBeUndefined();
        });

        it.concurrent('should return a wide range of cards in Flying Solo mode', () => {
             const flyingSoloState: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
             const cards = getAvailableStoryCards(flyingSoloState);
             expect(cards.length).toBeGreaterThan(1);
             // Should not contain the classic solo story, as that's in the excluded list
             expect(cards.find(c => c.title === "Awful Lonely In The Big Black")).toBeUndefined();
        });
    });
});