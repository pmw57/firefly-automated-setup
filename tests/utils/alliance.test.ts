import { describe, it, expect } from 'vitest';
import { calculateAllianceReaverDetails } from '../../utils/alliance';
import { StoryCardDef } from '../../types';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/alliance', () => {
  describe('calculateAllianceReaverDetails', () => {
    const baseGameState = getDefaultGameState();
    const mockStory: StoryCardDef = { title: 'Mock Story', intro: '' };

    it('returns default values for a standard game', () => {
      const details = calculateAllianceReaverDetails(baseGameState, undefined);
      expect(details.useSmugglersRimRule).toBe(false);
      expect(details.alertStackCount).toBe(0);
    });

    it('calculates alertStackCount based on player count and multiplier', () => {
      const storyWithMultiplier: StoryCardDef = {
        ...mockStory,
        setupConfig: { createAlertTokenStackMultiplier: 3 },
      };
      const state = { ...baseGameState, playerCount: 4, selectedStoryCard: storyWithMultiplier.title };
      
      const details = calculateAllianceReaverDetails(state, storyWithMultiplier);
      expect(details.alertStackCount).toBe(12);
    });

    it('does not enable smugglersRimRule if only one required expansion is active', () => {
      const storyWithSmugglers: StoryCardDef = {
        ...mockStory,
        setupConfig: { flags: ['smugglersBluesSetup'] },
      };
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: false }, selectedStoryCard: storyWithSmugglers.title };
      
      const details = calculateAllianceReaverDetails(state, storyWithSmugglers);
      expect(details.useSmugglersRimRule).toBe(false);
    });

    it('enables smugglersRimRule if story flag and both required expansions are active', () => {
      const storyWithSmugglers: StoryCardDef = {
        ...mockStory,
        setupConfig: { flags: ['smugglersBluesSetup'] },
      };
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: true }, selectedStoryCard: storyWithSmugglers.title };
      
      const details = calculateAllianceReaverDetails(state, storyWithSmugglers);
      expect(details.useSmugglersRimRule).toBe(true);
    });
  });
});