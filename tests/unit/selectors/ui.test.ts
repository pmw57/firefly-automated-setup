/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getStoryCardSetupSummary, getDisplaySetupName, getTimerSummaryText, getActiveOptionalRulesText } from '../../../utils/ui';
import { GameState, StoryCardDef, SetupCardDef, SetJobModeRule, SetShipPlacementRule } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { SETUP_CARD_IDS } from '../../../data/ids';
import { SETUP_CARDS } from '../../../data/setupCards';
import { STORY_CARDS } from '../../../data/storyCards';

const getStory = (title: string): StoryCardDef => {
    const card = STORY_CARDS.find(c => c.title === title);
    if (!card) throw new Error(`Test setup failed: Story card "${title}" not found.`);
    return card;
};

const getSetupCard = (id: string): SetupCardDef => {
    const card = SETUP_CARDS.find(c => c.id === id);
    if (!card) throw new Error(`Test setup failed: Setup card with id "${id}" not found.`);
    return card;
}

describe('selectors/ui', () => {
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
            const browncoatCard = getSetupCard(SETUP_CARD_IDS.THE_BROWNCOAT_WAY);
            const state: GameState = { ...baseGameState, setupCardName: browncoatCard.label };
            expect(getDisplaySetupName(state)).toBe(browncoatCard.label);
        });

        it.concurrent('combines Flying Solo with its secondary setup card name', () => {
            const browncoatCard = getSetupCard(SETUP_CARD_IDS.THE_BROWNCOAT_WAY);
            const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.FLYING_SOLO, secondarySetupId: browncoatCard.id, setupCardName: 'Flying Solo' };
            expect(getDisplaySetupName(state, browncoatCard)).toBe(`Flying Solo + ${browncoatCard.label}`);
        });
    });

    describe('getTimerSummaryText', () => {
        it.concurrent('returns null for multiplayer games', () => {
            expect(getTimerSummaryText(baseGameState)).toBeNull();
        });

        it.concurrent('returns "Disabled" if story card disables solo timer', () => {
            const state: GameState = { ...baseGameState, gameMode: 'solo', selectedStoryCard: getStory("Racing A Pale Horse").title };
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
              selectedStoryCard: getStory("Racing A Pale Horse").title,
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
