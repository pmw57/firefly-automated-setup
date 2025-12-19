import { describe, it, expect } from 'vitest';
import { getStoryCardSetupSummary, getDisplaySetupName, getTimerSummaryText, getActiveOptionalRulesText } from '../../utils/ui';
import { GameState, StoryCardDef, SetupCardDef } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { SETUP_CARD_IDS } from '../../data/ids';
import { SETUP_CARDS } from '../../data/setupCards';

describe('utils/ui', () => {
    const baseGameState = getDefaultGameState();

    describe('getStoryCardSetupSummary', () => {
        it('returns "Setup Changes" if there is a setupDescription', () => {
            const card: StoryCardDef = { title: 'T', intro: 'I', setupDescription: 'Do a thing' };
            expect(getStoryCardSetupSummary(card)).toBe("Setup Changes");
        });

        it('returns specific summaries for jobDrawMode', () => {
            const noJobs: StoryCardDef = { title: 'T', intro: 'I', setupConfig: { jobDrawMode: 'no_jobs' } };
            const caper: StoryCardDef = { title: 'T', intro: 'I', setupConfig: { jobDrawMode: 'caper_start' } };
            expect(getStoryCardSetupSummary(noJobs)).toBe("No Starting Jobs");
            expect(getStoryCardSetupSummary(caper)).toBe("Starts with Caper");
        });

        it('returns "Starts at Persephone" for shipPlacementMode', () => {
            const card: StoryCardDef = { title: 'T', intro: 'I', setupConfig: { shipPlacementMode: 'persephone' } };
            expect(getStoryCardSetupSummary(card)).toBe("Starts at Persephone");
        });
        
        it('returns null if no special setup rules apply', () => {
            const card: StoryCardDef = { title: 'T', intro: 'I' };
            expect(getStoryCardSetupSummary(card)).toBeNull();
        });
    });

    describe('getDisplaySetupName', () => {
        it('returns the standard setup name', () => {
            expect(getDisplaySetupName(baseGameState)).toBe('Standard Game Setup');
        });

        it('combines Flying Solo with its secondary setup card name', () => {
            const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.FLYING_SOLO, secondarySetupId: 'TheBrowncoatWay', setupCardName: 'Flying Solo' };
            const browncoatCard = SETUP_CARDS.find(c => c.id === 'TheBrowncoatWay') as SetupCardDef;
            expect(getDisplaySetupName(state, browncoatCard)).toBe('Flying Solo + The Browncoat Way');
        });
    });

    describe('getTimerSummaryText', () => {
        it('returns null for multiplayer games', () => {
            expect(getTimerSummaryText(baseGameState)).toBeNull();
        });

        it('returns "Disabled" if story card disables solo timer', () => {
            const state: GameState = { ...baseGameState, gameMode: 'solo' };
            const story: StoryCardDef = { title: 'T', intro: 'I', setupConfig: { flags: ['disableSoloTimer'] } };
            expect(getTimerSummaryText(state, story)).toBe("Disabled (Story Override)");
        });

        it('returns "Standard (20 Turns)" for Flying Solo with standard timer', () => {
            const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
            expect(getTimerSummaryText(state)).toBe("Standard (20 Turns)");
        });
        
        it('correctly describes an unpredictable timer', () => {
            const state: GameState = { 
                ...baseGameState, 
                gameMode: 'solo', 
                setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
                timerConfig: {
                    mode: 'unpredictable',
                    unpredictableSelectedIndices: [0, 1, 2, 3, 4, 5], // Extra tokens
                    randomizeUnpredictable: true
                }
            };
            expect(getTimerSummaryText(state)).toBe("Unpredictable (Extra Tokens) (Randomized)");
        });
    });

    describe('getActiveOptionalRulesText', () => {
        it('returns an empty array if no optional rules are active', () => {
            expect(getActiveOptionalRulesText(baseGameState)).toEqual([]);
        });

        it('returns a list of active solo options', () => {
            const state: GameState = { ...baseGameState, soloOptions: { noSureThings: true, shesTrouble: false, recipeForUnpleasantness: true } };
            expect(getActiveOptionalRulesText(state)).toEqual(["No Sure Things", "Recipe For Unpleasantness"]);
        });
        
        it('returns ship upgrades when active', () => {
            const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, optionalShipUpgrades: true } };
            expect(getActiveOptionalRulesText(state)).toEqual(["Ship Upgrades"]);
        });
    });
});