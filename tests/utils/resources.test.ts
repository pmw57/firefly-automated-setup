import { describe, it, expect } from 'vitest';
import { calculateStartingResources, getCreditsLabel } from '../../utils/resources';
import { StoryCardDef, StoryCardConfig } from '../../types';

describe('utils/resources', () => {
  const mockStory = (config: Partial<StoryCardConfig> = {}): StoryCardDef => ({
    title: 'Mock Story',
    intro: 'Intro',
    setupConfig: config,
  });

  describe('calculateStartingResources', () => {
    it('returns default 3000 credits and empty flags', () => {
      const { totalCredits, bonusCredits, noFuelParts, customFuel } = calculateStartingResources(mockStory(), {});
      expect(totalCredits).toBe(3000);
      expect(bonusCredits).toBe(0);
      expect(noFuelParts).toBe(false); // Updated from toBeUndefined() to toBe(false)
      expect(customFuel).toBeUndefined();
    });

    it('applies bonus credits', () => {
      const story = mockStory({ startingCreditsBonus: 1000 });
      const { totalCredits, bonusCredits } = calculateStartingResources(story, {});
      expect(totalCredits).toBe(4000);
      expect(bonusCredits).toBe(1000);
    });

    it('respects startingCreditsOverride from story card', () => {
      const story = mockStory({ startingCreditsOverride: 500 });
      const { totalCredits } = calculateStartingResources(story, {});
      expect(totalCredits).toBe(500);
    });

    it('respects overrides from setup card', () => {
      const { totalCredits } = calculateStartingResources(mockStory(), { startingCredits: 5000 });
      expect(totalCredits).toBe(5000);
    });

    it('passes through custom fuel and noFuelParts flags', () => {
      const story = mockStory({ 
        flags: ['noStartingFuelParts'],
        customStartingFuel: 4
      });
      const { noFuelParts, customFuel } = calculateStartingResources(story, {});
      expect(noFuelParts).toBe(true);
      expect(customFuel).toBe(4);
    });
  });

  describe('getCreditsLabel', () => {
    it('returns "Standard Allocation" by default', () => {
      const details = { totalCredits: 3000, bonusCredits: 0, noFuelParts: false };
      const label = getCreditsLabel(details, {}, mockStory());
      expect(label).toBe("Standard Allocation");
    });
    
    it('shows bonus credit calculation', () => {
      const details = { totalCredits: 4000, bonusCredits: 1000, noFuelParts: false };
      const overrides = { startingCredits: 3000 };
      const label = getCreditsLabel(details, overrides, mockStory());
      expect(label).toBe("Base $3000 + Bonus $1000");
    });

    it('shows story override text when applicable', () => {
      const story = mockStory({ startingCreditsOverride: 500 });
      const details = { totalCredits: 500, bonusCredits: 0, noFuelParts: false };
      const label = getCreditsLabel(details, {}, story);
      expect(label).toBe("Story Override (Mock Story)");
    });
  });
});