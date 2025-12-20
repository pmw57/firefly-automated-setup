import { describe, it, expect } from 'vitest';
import { getStoryCardSetupSummary, getDisplaySetupName, getTimerSummaryText, getActiveOptionalRulesText } from '../../utils/ui';
import { GameState, StoryCardDef, SetupCardDef, SetJobModeRule, SetShipPlacementRule } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { SETUP_CARD_IDS, STORY_TITLES } from '../../data/ids';
import { SETUP_CARDS } from '../../data/setupCards';

describe('utils/ui', () => {
    const baseGameState = getDefaultGameState();

    describe('getStoryCardSetupSummary', () => {
        it('returns "Setup Changes" if there is a setupDescription', () => {
            const card: StoryCardDef = { title: 'T', intro: 'I', setupDescription: 'Do a thing' };
            expect(getStoryCardSetupSummary(card)).toBe("Setup Changes");
        });

        it('returns specific summaries for jobDrawMode', () => {
            // FIX: Updated mock objects to use the 'rules' array instead of the legacy 'setupConfig' to match the function's logic.
            const noJobsRule: SetJobModeRule = { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: 'T' };
            const caperRule: SetJobModeRule = { type: 'setJobMode', mode: 'caper_start', source: 'story', sourceName: 'T' };
            const noJobs: StoryCardDef = { title: 'T', intro: 'I', rules: [noJobsRule] };
            const caper: StoryCardDef = { title: 'T', intro: 'I', rules: [caperRule] };
            expect(getStoryCardSetupSummary(noJobs)).toBe("No Starting Jobs");
            expect(getStoryCardSetupSummary(caper)).toBe("Starts with Caper");
        });

        it('returns "Starts at Persephone" for shipPlacementMode', () => {
            // FIX: Updated mock object to use the 'rules' array instead of 'setupConfig'.
            const placementRule: SetShipPlacementRule = { type: 'setShipPlacement', location: 'persephone', source: 'story', sourceName: 'T' };
            const card: StoryCardDef = { title: 'T', intro: 'I', rules: [placementRule] };
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
            // FIX: The function now infers the story from the state. The test is updated to set the selectedStoryCard in the state and call the function with only one argument.
            const state: GameState = { ...baseGameState, gameMode: 'solo', selectedStoryCard: STORY_TITLES.RACING_A_PALE_HORSE };
            expect(getTimerSummaryText(state)).toBe("Disabled (Story Override)");
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