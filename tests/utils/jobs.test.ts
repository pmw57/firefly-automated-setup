/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getJobSetupDetails } from '../../utils/jobs';
import { GameState, StepOverrides, StructuredContent, StructuredContentPart } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { CONTACT_NAMES, CHALLENGE_IDS, STORY_TITLES, SETUP_CARD_IDS } from '../../data/ids';

// Helper to recursively flatten structured content to a searchable string
const getTextContent = (content: StructuredContent | StructuredContentPart): string => {
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
            return getTextContent(content.content);
        case 'list':
        case 'numbered-list':
            return content.items.map(item => getTextContent(item)).join(' ');
        case 'sub-list':
             // Not used in jobs, but good for completeness
            return '';
        case 'br':
            return ' ';
        default:
            return '';
    }
};

describe('utils/jobs', () => {
  const baseGameState = getDefaultGameState();

  describe('getJobSetupDetails', () => {
    it.concurrent('returns a standard set of contacts', () => {
      const { contacts, showStandardContactList, totalJobCards } = getJobSetupDetails(baseGameState, {});
      expect(contacts).toEqual(['Harken', 'Badger', 'Amnon Duul', 'Patience', 'Niska']);
      expect(showStandardContactList).toBe(true);
      expect(totalJobCards).toBe(5);
    });

    it.concurrent('removes a forbidden contact from the list', () => {
      const state: GameState = {
        ...baseGameState,
        selectedStoryCard: STORY_TITLES.LETS_BE_BAD_GUYS // This story forbids Niska
      };
      const { contacts } = getJobSetupDetails(state, {});
      expect(contacts).not.toContain(CONTACT_NAMES.NISKA);
    });

    it.concurrent('filters contacts to only those allowed by the story', () => {
      const state: GameState = {
        ...baseGameState,
        selectedStoryCard: STORY_TITLES.FIRST_TIME_IN_CAPTAINS_CHAIR // Allows Harken & Amnon Duul
      };
      const { contacts } = getJobSetupDetails(state, {});
      expect(contacts).toEqual(['Harken', 'Amnon Duul']);
    });
    
    it.concurrent('handles the "Single Contact" challenge', () => {
      const state: GameState = {
        ...baseGameState,
        challengeOptions: { [CHALLENGE_IDS.SINGLE_CONTACT]: true }
      };
      const { messages, isSingleContactChoice, cardsToDraw } = getJobSetupDetails(state, {});
      expect(isSingleContactChoice).toBe(true);
      expect(cardsToDraw).toBe(3);
      expect(messages.some(m => m.source === 'warning')).toBe(true);
    });

    it.concurrent('handles the "Browncoat Way" no jobs setup', () => {
      const overrides: StepOverrides = { jobMode: 'no_jobs' };
      const { contacts, showStandardContactList, messages } = getJobSetupDetails(baseGameState, overrides);
      expect(showStandardContactList).toBe(false);
      expect(contacts).toEqual([]);
      expect(messages.some(m => m.source === 'setupCard')).toBe(true);
    });
    
    it.concurrent('handles story card "no_jobs" mode with priming', () => {
      const state: GameState = {
        ...baseGameState,
        selectedStoryCard: STORY_TITLES.A_FISTFUL_OF_SCOUNDRELS // Has primeContactDecks flag
      };
      const { showStandardContactList, messages } = getJobSetupDetails(state, {});
      expect(showStandardContactList).toBe(false);
      expect(messages[0].content).toMatchInlineSnapshot(`
        [
          {
            "content": [
              {
                "content": "No Starting Jobs.",
                "type": "strong",
              },
            ],
            "type": "paragraph",
          },
          {
            "content": [
              "Instead, ",
              {
                "content": "prime the Contact Decks",
                "type": "strong",
              },
              ":",
            ],
            "type": "paragraph",
          },
          {
            "items": [
              [
                "Reveal the top ",
                {
                  "content": "3 cards",
                  "type": "strong",
                },
                " of each Contact Deck.",
              ],
              [
                "Place the revealed Job Cards in their discard piles.",
              ],
            ],
            "type": "list",
          },
        ]
      `);
    });

    it.concurrent('handles "no_jobs" with "Don\'t Prime Contacts" challenge override', () => {
        const state: GameState = {
            ...baseGameState,
            selectedStoryCard: STORY_TITLES.A_FISTFUL_OF_SCOUNDRELS, // Has primeContactDecks flag
            challengeOptions: { [CHALLENGE_IDS.DONT_PRIME_CONTACTS]: true }
        };
        const { messages } = getJobSetupDetails(state, {});
        expect(messages[0].source).toBe('warning');
        expect(messages[0].title).toBe('Challenge Active');
    });

    it.concurrent('should correctly filter contacts and generate a warning for a jobMode/forbidContact conflict', () => {
      const state: GameState = {
        ...baseGameState,
        setupCardId: SETUP_CARD_IDS.AWFUL_CROWDED, // Sets jobMode: 'awful_jobs'
        selectedStoryCard: STORY_TITLES.DESPERADOES, // Forbids 'Harken'
      };
      const overrides: StepOverrides = { jobMode: 'awful_jobs' }; // From the setup card
      const { contacts, messages } = getJobSetupDetails(state, overrides);

      // 1. Verify Harken is removed from the contact list
      expect(contacts).not.toContain('Harken');
      expect(contacts).toEqual(['Amnon Duul', 'Patience']);

      // 2. Verify the specific conflict warning message is generated
      const hasConflictWarning = messages.some(m => 
        m.source === 'setupCard' && 
        getTextContent(m.content).includes('Story Card Conflict: Harken is unavailable')
      );
      expect(hasConflictWarning).toBe(true);
    });
  });
});