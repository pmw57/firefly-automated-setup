
/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getDraftDetails } from '../../../utils/draftRules';
import { GameState, Step, StructuredContent, StructuredContentPart } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { STEP_IDS, CHALLENGE_IDS, SETUP_CARD_IDS } from '../../../data/ids';
import { STORY_CARDS } from '../../../data/storyCards';

// Helper to recursively flatten structured content to a searchable string
const getTextContent = (content: StructuredContent | StructuredContentPart | undefined): string => {
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content.map(part => getTextContent(part)).join('');
    }
    if (!content) return '';

    switch(content.type) {
        case 'strong':
        case 'action':
        case 'paragraph':
        case 'warning-box':
            return getTextContent(content.content as StructuredContent);
        case 'list':
        case 'numbered-list':
            return content.items.map(item => getTextContent(item)).join(' ');
        case 'sub-list':
            return content.items.map(item => item.ship).join(' ');
        case 'br':
            return ' ';
        default:
            return '';
    }
};

describe('rules/draftRules', () => {
    const baseStep: Step = { type: 'core', id: STEP_IDS.C3 };
    const baseGameState = getDefaultGameState();

    it.concurrent('returns empty special rules for a standard game', () => {
        const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, optionalShipUpgrades: false } };
        const details = getDraftDetails(state, baseStep);
        const specialRules = [...details.infoRules, ...details.overrideRules];
        expect(specialRules).toEqual([]);
        expect(details.isHavenDraft).toBe(false);
        expect(details.specialStartSector).toBeNull();
    });

    it.concurrent('identifies Haven Draft mode', () => {
        const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.HOME_SWEET_HAVEN };
        const step: Step = { ...baseStep, id: STEP_IDS.D_HAVEN_DRAFT };
        const details = getDraftDetails(state, step);
        const specialRules = [...details.infoRules, ...details.overrideRules];
        expect(details.isHavenDraft).toBe(true);
        expect(specialRules.some(r => getTextContent(r.title).includes('Placement Rules'))).toBe(true);
    });
    
    it.concurrent('generates a rule for Wanted Leader mode via Setup Card', () => {
        // The rule is now driven by the Setup Card configuration in data/setupCards.ts
        // rather than a hardcoded override mapping in utils/draftRules.ts
        const state: GameState = { ...baseGameState, setupCardId: SETUP_CARD_IDS.THE_HEAT_IS_ON };
        const details = getDraftDetails(state, baseStep);
        const specialRules = [...details.infoRules, ...details.overrideRules];
        const rule = specialRules.find(r => r.title === 'The Heat Is On');
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('each Leader begins play with a Warrant token');
    });

    it.concurrent('generates a rule for Optional Ship Upgrades', () => {
        const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, optionalShipUpgrades: true } };
        const details = getDraftDetails(state, baseStep);
        const specialRules = [...details.infoRules, ...details.overrideRules];
        const rule = specialRules.find(r => r.title === 'Optional Ship Upgrades');
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('Bonanza');
    });
    
    it.concurrent('generates a rule for Racing a Pale Horse', () => {
        // The game state stores the index of the selected story card, not the card object itself.
        // We find the index by title to set up the test state correctly.
        const state: GameState = { ...baseGameState, selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === "Racing A Pale Horse") };
        const details = getDraftDetails(state, baseStep);
        const specialRules = [...details.infoRules, ...details.overrideRules];
        const rule = specialRules.find(r => r.title === 'Story Setup: Haven');
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('Place your Haven at Deadwood');
    });

    it.concurrent('generates a rule for Heroes & Misfits custom setup', () => {
        const state: GameState = { 
            ...baseGameState, 
            // The game state stores the index of the selected story card, not the card object itself.
            // We find the index by title to set up the test state correctly.
            selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === "Heroes & Misfits"),
            challengeOptions: { [CHALLENGE_IDS.HEROES_CUSTOM_SETUP]: true }
        };
        const details = getDraftDetails(state, baseStep);
        const specialRules = [...details.infoRules, ...details.overrideRules];
        const rule = specialRules.find(r => r.title === "Serenity's Legacy");
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('Begin play at Persephone with Malcolm and Serenity');
    });

    it.concurrent('resolves conflict between Haven Draft and special start sector (Story Priority)', () => {
        const state: GameState = { 
            ...baseGameState, 
            setupCardId: SETUP_CARD_IDS.HOME_SWEET_HAVEN,
            selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === "It's a Mad, Mad, Mad, Mad 'Verse!") 
        }; // This story forces Persephone start
        const step: Step = { ...baseStep, id: STEP_IDS.D_HAVEN_DRAFT }; // This is Haven Draft
        const details = getDraftDetails(state, step);
        const specialRules = [...details.infoRules, ...details.overrideRules];
        
        expect(details.isHavenDraft).toBe(false); // Overridden
        expect(details.specialStartSector).toBe('Persephone');
        expect(specialRules.some(r => r.title === 'Conflict Resolved')).toBe(true);
    });

    it.concurrent('should generate a warning when "The Browncoat Way" is combined with the "Heroes & Misfits" custom setup challenge', () => {
      const state: GameState = {
        ...baseGameState,
        setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY,
        // The game state stores the index of the selected story card, not the card object itself.
        // We find the index by title to set up the test state correctly.
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === "Heroes & Misfits"),
        challengeOptions: { [CHALLENGE_IDS.HEROES_CUSTOM_SETUP]: true },
        finalStartingCredits: 12000, // From Browncoat Way
      };
      const step: Step = { type: 'core', id: STEP_IDS.C3, overrides: { draftMode: 'browncoat' } };
      
      const details = getDraftDetails(state, step);
      const specialRules = [...details.infoRules, ...details.overrideRules];
      
      const warningRule = specialRules.find(r => r.title === 'Story & Setup Card Interaction');
      expect(warningRule).toBeDefined();
      expect(getTextContent(warningRule?.content)).toContain('Your starting Capitol is reduced by the cost of your assigned ship');
    });
});
