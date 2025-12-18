import { describe, it, expect, vi } from 'vitest';
// Fix: Correct import path.
import { calculateAllianceReaverDetails } from '../../utils/alliance';
import { StoryCardDef } from '../../types';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/alliance', () => {
  describe('calculateAllianceReaverDetails', () => {
    const baseGameState = getDefaultGameState();
    const mockStory: StoryCardDef = { title: 'Mock Story', intro: '' };

    it('returns default values for a standard game', () => {
      // Fix: `calculateAllianceReaverDetails` now only takes the gameState object as an argument.
      const details = calculateAllianceReaverDetails(baseGameState);
      expect(details.useSmugglersRimRule).toBe(false);
      expect(details.alertStackCount).toBe(0);
    });

    it('calculates alertStackCount based on player count and multiplier', () => {
      const storyWithMultiplier: StoryCardDef = {
        ...mockStory,
        setupConfig: { createAlertTokenStackMultiplier: 3 },
      };
      const state = { ...baseGameState, playerCount: 4, selectedStoryCard: storyWithMultiplier.title };
      // Mock finding the story card
      const originalFind = Array.prototype.find;
      Array.prototype.find = vi.fn().mockImplementation(function(
        this: unknown[],
        ...args: [(card: { title: string }) => boolean, unknown?]
      ) {
        if (args[0]({ title: storyWithMultiplier.title })) {
          return storyWithMultiplier;
        }
        return originalFind.apply(this, args);
      });

      const details = calculateAllianceReaverDetails(state);
      expect(details.alertStackCount).toBe(12);

      Array.prototype.find = originalFind; // Restore
    });

    it('does not enable smugglersRimRule if only one required expansion is active', () => {
      const storyWithSmugglers: StoryCardDef = {
        ...mockStory,
        setupConfig: { flags: ['smugglersBluesSetup'] },
      };
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: false }, selectedStoryCard: storyWithSmugglers.title };
      
       const originalFind = Array.prototype.find;
       Array.prototype.find = vi.fn().mockImplementation(function(
         this: unknown[],
         ...args: [(card: { title: string }) => boolean, unknown?]
       ) {
         if (args[0]({ title: storyWithSmugglers.title })) {
           return storyWithSmugglers;
         }
         return originalFind.apply(this, args);
       });

      const details = calculateAllianceReaverDetails(state);
      expect(details.useSmugglersRimRule).toBe(false);

      Array.prototype.find = originalFind; // Restore
    });

    it('enables smugglersRimRule if story flag and both required expansions are active', () => {
      const storyWithSmugglers: StoryCardDef = {
        ...mockStory,
        setupConfig: { flags: ['smugglersBluesSetup'] },
      };
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: true }, selectedStoryCard: storyWithSmugglers.title };
      
      const originalFind = Array.prototype.find;
       Array.prototype.find = vi.fn().mockImplementation(function(
         this: unknown[],
         ...args: [(card: { title: string }) => boolean, unknown?]
       ) {
         if (args[0]({ title: storyWithSmugglers.title })) {
           return storyWithSmugglers;
         }
         return originalFind.apply(this, args);
       });

      const details = calculateAllianceReaverDetails(state);
      expect(details.useSmugglersRimRule).toBe(true);

      Array.prototype.find = originalFind; // Restore
    });
  });
});