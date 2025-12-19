import { describe, it, expect } from 'vitest';
import { determineJobSetupDetails } from '../../utils/jobs';
import { GameState, StoryCardDef, StoryCardConfig, StepOverrides } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { CONTACT_NAMES, CHALLENGE_IDS } from '../../data/ids';

describe('utils/jobs', () => {
  const mockStory = (config: Partial<StoryCardConfig> = {}): StoryCardDef => ({
    title: 'Mock Story',
    intro: 'Intro',
    setupConfig: config,
  });
  
  const baseGameState = getDefaultGameState();

  describe('determineJobSetupDetails', () => {
    it('returns a standard set of contacts', () => {
      const { contacts, showStandardContactList, totalJobCards } = determineJobSetupDetails(baseGameState, mockStory(), {});
      expect(contacts).toEqual(['Harken', 'Badger', 'Amnon Duul', 'Patience', 'Niska']);
      expect(showStandardContactList).toBe(true);
      expect(totalJobCards).toBe(5);
    });

    it('removes a forbidden contact from the list', () => {
      const story = mockStory({ forbiddenStartingContact: CONTACT_NAMES.NISKA });
      const { contacts } = determineJobSetupDetails(baseGameState, story, {});
      expect(contacts).not.toContain(CONTACT_NAMES.NISKA);
    });

    it('filters contacts to only those allowed by the story', () => {
      const story = mockStory({ allowedStartingContacts: ['Badger', 'Patience'] });
      const { contacts } = determineJobSetupDetails(baseGameState, story, {});
      expect(contacts).toEqual(['Badger', 'Patience']);
    });
    
    it('handles the "Single Contact" challenge', () => {
      const state: GameState = {
        ...baseGameState,
        challengeOptions: { [CHALLENGE_IDS.SINGLE_CONTACT]: true }
      };
      const { messages, isSingleContactChoice, cardsToDraw } = determineJobSetupDetails(state, mockStory(), {});
      expect(isSingleContactChoice).toBe(true);
      expect(cardsToDraw).toBe(3);
      expect(messages.some(m => m.source === 'warning')).toBe(true);
    });

    it('handles the "Browncoat Way" no jobs setup', () => {
      // FIX: Changed `browncoatJobMode: true` to `jobMode: 'no_jobs'` to match the StepOverrides type.
      const overrides: StepOverrides = { jobMode: 'no_jobs' };
      const { contacts, showStandardContactList, messages } = determineJobSetupDetails(baseGameState, mockStory(), overrides);
      expect(showStandardContactList).toBe(false);
      expect(contacts).toEqual([]);
      expect(messages.some(m => m.source === 'setupCard')).toBe(true);
    });
    
    it('handles story card "no_jobs" mode with priming', () => {
      const story = mockStory({ jobDrawMode: 'no_jobs', flags: ['primeContactDecks'] });
      const { showStandardContactList, messages } = determineJobSetupDetails(baseGameState, story, {});
      expect(showStandardContactList).toBe(false);
      expect(messages[0].content).toMatchSnapshot(); // snapshot the React element
    });

    it('handles "no_jobs" with "Don\'t Prime Contacts" challenge override', () => {
        const story = mockStory({ jobDrawMode: 'no_jobs', flags: ['primeContactDecks'] });
        const state: GameState = {
            ...baseGameState,
            challengeOptions: { [CHALLENGE_IDS.DONT_PRIME_CONTACTS]: true }
        };
        const { messages } = determineJobSetupDetails(state, story, {});
        expect(messages[0].source).toBe('warning');
        expect(messages[0].title).toBe('Challenge Active');
    });
  });
});