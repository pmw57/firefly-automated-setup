/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getStoryCardSetupSummary, getDisplaySetupName, getTimerSummaryText, getActiveOptionalRulesText } from '../../utils/ui';
import { GameState, StoryCardDef, SetupCardDef, SetJobModeRule, SetShipPlacementRule } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { SETUP_CARD_IDS, STORY_TITLES } from '../../data/ids';
import { SETUP_CARDS } from '../../data/setupCards';

describe('utils/ui', () => {
    const baseGameState = getDefaultGameState();

    describe('getStoryCardSetupSummary', () => {
        it.concurrent('returns "Setup Changes" if there is a setupDescription', () => {
            const card: StoryCardDef = { title: 'T', intro: 'I', setupDescription: 'Do a thing' };
            expect(getStoryCardSetupSummary(card)).toBe("Setup Changes");
        });

        it.concurrent('returns specific summaries for jobDrawMode', () => {
            const noJobsRule: SetJobModeRule = { type: 'setJobMode', mode: 'no_jobs', source: 'story', sourceName: 'T' };
            const caperRule: SetJobModeRule = { type: 'setJobMode', mode: 'caper_start', source: 'story', sourceName: 'T' };
            const noJobs: StoryCardDef = { title: 'T', intro: 'I', rules: [noJobsRule] };
            const caper: StoryCardDef = { title: 'T', intro: 'I', rules: [caperRule] };
            expect(getStoryCardSetupSummary(noJobs)).toBe("No Starting Jobs");
            expect(getStoryCardSetupSummary(caper)).toBe("Starts with Caper");
        });

        it.concurrent('returns "Starts at Persephone" for shipPlacementMode', () => {
            const placementRule: SetShipPlacementRule = { type: 'setShipPlacement', location: 'persephone', source: 'story', sourceName: 'T' };
            const card: StoryCardDef = { title: 'T', intro: 'I', rules: [placementRule] };
            expect(getStoryCardSetupSummary(card)).toBe("Starts at Persephone");
        });
        
        it.concurrent('returns null if no special setup rules apply', () => {
            const card: StoryCardDef = { title: 'T', intro: 'I' };
            expect(getStoryCardSetupSummary(card)).toBeNull();
        });
    });

    describe('getDisplaySetupName', () => {
        it.concurrent('returns the setup name from the state', () => {
            const state: GameState = { ...baseGameState, setupCardName: 'The Browncoat Way' };
            expect(getDisplaySetupName(state)).toBe('The Browncoat Way');
        });

        it.concurrent('combines Flying Solo with its secondary setup card name', () => {
            const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.FLYING_SOLO, secondarySetupId: 'TheBrowncoatWay', setupCardName: 'Flying Solo' };
            const browncoatCard = SETUP_CARDS.find(c => c.id === 'TheBrowncoatWay') as SetupCardDef;
            expect(getDisplaySetupName(state, browncoatCard)).toBe('Flying Solo + The Browncoat Way');
        });
    });

    describe('getTimerSummaryText', () => {
        it.concurrent('returns null for multiplayer games', () => {
            expect(getTimerSummaryText(baseGameState)).toBeNull();
        });

        it.concurrent('returns "Disabled" if story card disables solo timer', () => {
            const state: GameState = { ...baseGameState, gameMode: 'solo', selectedStoryCard: STORY_TITLES.RACING_A_PALE_HORSE };
            expect(getTimerSummaryText(state)).toBe("Disabled (Story Override)");
        });

        it.concurrent('returns "Standard (20 Turns)" for Flying Solo with standard timer', () => {
            const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
            expect(getTimerSummaryText(state)).toBe("Standard (20 Turns)");
        });
        
        it.concurrent('correctly describes an unpredictable timer', () => {
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

        it.concurrent('should correctly show the timer as disabled when "Racing a Pale Horse" overrides "Flying Solo"', () => {
            const state: GameState = {
              ...baseGameState,
              gameMode: 'solo',
              setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
              secondarySetupId: SETUP_CARD_IDS.STANDARD,
              selectedStoryCard: STORY_TITLES.RACING_A_PALE_HORSE, // This story disables the timer
            };
            
            const timerSummary = getTimerSummaryText(state);
            expect(timerSummary).toBe("Disabled (Story Override)");
        });
    });

    describe('getActiveOptionalRulesText', () => {
        it.concurrent('returns an empty array if no optional rules are active', () => {
            expect(getActiveOptionalRulesText(baseGameState)).toEqual([]);
        });

        it.concurrent('returns a list of active solo options', () => {
            const state: GameState = { ...baseGameState, soloOptions: { noSureThings: true, shesTrouble: false, recipeForUnpleasantness: true } };
            expect(getActiveOptionalRulesText(state)).toEqual(["No Sure Things", "Recipe For Unpleasantness"]);
        });
        
        it.concurrent('returns ship upgrades when active', () => {
            const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, optionalShipUpgrades: true } };
            expect(getActiveOptionalRulesText(state)).toEqual(["Ship Upgrades"]);
        });
    });
});