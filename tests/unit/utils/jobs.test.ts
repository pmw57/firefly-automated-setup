
/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getJobSetupDetails } from '../../../utils/jobs';
import { GameState, StepOverrides } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { CONTACT_NAMES, CHALLENGE_IDS, SETUP_CARD_IDS } from '../../../data/ids';
import { STORY_CARDS } from '../../../data/storyCards';

describe('rules/jobs', () => {
  const baseGameState = getDefaultGameState();

  describe('getJobSetupDetails', () => {
    it.concurrent('returns a standard set of contacts', () => {
      const stateWithoutKalidasa: GameState = {
        ...baseGameState,
        expansions: { ...baseGameState.expansions, kalidasa: false },
      };
      const { contacts, showStandardContactList, totalJobCards } = getJobSetupDetails(stateWithoutKalidasa, {});
      expect(contacts).toEqual(['Harken', 'Badger', 'Amnon Duul', 'Patience', 'Niska']);
      expect(showStandardContactList).toBe(true);
      expect(totalJobCards).toBe(5);
    });

    it.concurrent('removes a forbidden contact from the list', () => {
      const storyTitle = "Let's Be Bad Guys";
      const state: GameState = {
        ...baseGameState,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
      };
      const { contacts } = getJobSetupDetails(state, {});
      expect(contacts).not.toContain(CONTACT_NAMES.NISKA);
    });

    it.concurrent('filters contacts to only those allowed by the story', () => {
      const storyTitle = "First Time in the Captain's Chair";
      const state: GameState = {
        ...baseGameState,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
      };
      const { contacts } = getJobSetupDetails(state, {});
      expect(contacts).toEqual(['Harken', 'Amnon Duul']);
    });
    
    it.concurrent('handles the "Single Contact" challenge', () => {
      const state: GameState = {
        ...baseGameState,
        challengeOptions: { [CHALLENGE_IDS.SINGLE_CONTACT]: true }
      };
      const { infoMessages, overrideMessages, isSingleContactChoice, cardsToDraw } = getJobSetupDetails(state, {});
      expect(isSingleContactChoice).toBe(true);
      
      // With the "Single Contact" challenge, the player only draws 1 card,
      // so they can only keep a maximum of 1 card. The data should reflect this.
      expect(cardsToDraw).toBe(1);

      const messages = [...infoMessages, ...overrideMessages];
      expect(messages.some(m => m.source === 'warning')).toBe(true);
    });

    it.concurrent('handles the "Browncoat Way" no jobs setup', () => {
      const overrides: StepOverrides = { jobMode: 'no_jobs' };
      const { contacts, showStandardContactList, infoMessages, overrideMessages } = getJobSetupDetails(baseGameState, overrides);
      expect(showStandardContactList).toBe(false);
      expect(contacts).toEqual([]);
      const messages = [...infoMessages, ...overrideMessages];
      expect(messages.some(m => m.source === 'setupCard')).toBe(true);
    });
    
    it('handles story card "no_jobs" mode with explicit main content', () => {
      const storyTitle = "A Fistful Of Scoundrels";
      const state: GameState = {
        ...baseGameState,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
        gameMode: 'solo',
      };
      const { showStandardContactList, infoMessages, overrideMessages, mainContent } = getJobSetupDetails(state, {});
      expect(showStandardContactList).toBe(false);
      
      const messages = [...infoMessages, ...overrideMessages];
      // A Fistful Of Scoundrels now includes an explicit special rule for context
      expect(messages).toHaveLength(1);
      expect(messages[0].title).toBe("Prime Contact Decks");

      // And it uses mainContent to render the step instructions
      expect(mainContent).toMatchInlineSnapshot(`
        [
          {
            "content": "Prime Contacts Decks",
            "type": "strong",
          },
          {
            "items": [
              [
                "Prime the ",
                {
                  "content": "Contacts",
                  "type": "strong",
                },
                ", revealing the top 3 cards of each.",
              ],
              [
                "Place the revealed ",
                {
                  "content": "Job Cards",
                  "type": "strong",
                },
                " in their discard piles.",
              ],
            ],
            "type": "numbered-list",
          },
        ]
      `);
    });

    it.concurrent('handles "no_jobs" with "Don\'t Prime Contacts" challenge override', () => {
        const storyTitle = "A Fistful Of Scoundrels";
        const state: GameState = {
            ...baseGameState,
            selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
            challengeOptions: { [CHALLENGE_IDS.DONT_PRIME_CONTACTS]: true }
        };
        const { infoMessages, overrideMessages } = getJobSetupDetails(state, {});
        const messages = [...infoMessages, ...overrideMessages];
        // The first message should be the challenge warning. The explicit story rule might still be present as second message unless filtered out,
        // but checking [0] verifies the warning takes precedence or is present.
        // Actually, the utility might push warning first.
        // Let's find the warning.
        const warning = messages.find(m => m.title === 'Challenge Active');
        expect(warning).toBeDefined();
        expect(warning?.source).toBe('warning');
    });

    it('should correctly filter contacts and generate a warning for a jobMode/forbidContact conflict', () => {
      const storyTitle = "Desperadoes";
      const state: GameState = {
        ...baseGameState,
        setupCardId: SETUP_CARD_IDS.AWFUL_CROWDED,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
      };
      const overrides: StepOverrides = { jobMode: 'awful_jobs' };
      const { contacts, infoMessages, overrideMessages } = getJobSetupDetails(state, overrides);

      // 1. Verify Harken is removed from the contact list
      expect(contacts).not.toContain('Harken');
      expect(contacts).toEqual(['Amnon Duul', 'Patience']);

      // 2. Verify the messages, now with a snapshot to prevent regression.
      const messages = [...infoMessages, ...overrideMessages];
      expect(messages).toMatchInlineSnapshot(`
        [
          {
            "content": [
              {
                "content": "Limited Contacts.",
                "type": "strong",
              },
              " This setup card normally draws from Harken, Amnon Duul, Patience.",
              {
                "content": [
                  "Story Card Conflict: ",
                  {
                    "content": "Harken",
                    "type": "strong",
                  },
                  " is unavailable. Draw from ",
                  {
                    "content": "Amnon Duul and Patience",
                    "type": "strong",
                  },
                  " only.",
                ],
                "type": "warning-box",
              },
            ],
            "source": "setupCard",
            "title": "Setup Card Override",
          },
          {
            "content": [
              "Harken jobs are unavailable.",
            ],
            "source": "story",
            "title": "Contact Restriction",
          },
        ]
      `);
    });
  });
});
