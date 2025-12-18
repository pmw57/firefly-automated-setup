import { describe, it, expect } from 'vitest';
// Fix: Correct import path.
import { calculateStartingResources, getCreditsLabel } from '../../utils/resources';
import { StoryCardDef, StoryCardConfig, GameState } from '../../types';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/resources', () => {
  const baseGameState: GameState = getDefaultGameState();
  const mockStory = (config: Partial<StoryCardConfig> = {}): StoryCardDef => ({
    title: 'Mock Story',
    intro: 'Intro',
    setupConfig: config,
  });

  describe('calculateStartingResources', () => {
    it('returns default 3000 credits and empty flags', () => {
      const { totalCredits, bonusCredits, noFuelParts, customFuel, conflict } = calculateStartingResources(baseGameState, mockStory(), {});
      expect(totalCredits).toBe(3000);
      expect(bonusCredits).toBe(0);
      expect(noFuelParts).toBe(false);
      expect(customFuel).toBeUndefined();
      expect(conflict).toBeUndefined();
    });

    it('applies bonus credits', () => {
      const story = mockStory({ startingCreditsBonus: 1000 });
      const { totalCredits, bonusCredits } = calculateStartingResources(baseGameState, story, {});
      expect(totalCredits).toBe(4000);
      expect(bonusCredits).toBe(1000);
    });

    it('respects startingCreditsOverride from story card', () => {
      const story = mockStory({ startingCreditsOverride: 500 });
      const { totalCredits } = calculateStartingResources(baseGameState, story, {});
      expect(totalCredits).toBe(500);
    });

    it('respects overrides from setup card', () => {
      const { totalCredits } = calculateStartingResources(baseGameState, mockStory(), { startingCredits: 5000 });
      expect(totalCredits).toBe(5000);
    });

    it('identifies and returns conflict data, defaulting to story priority', () => {
      const story = mockStory({ startingCreditsOverride: 500, startingCreditsBonus: 100 }); // Bonus is ignored on story override
      const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, resolveConflictsManually: false }};
      const { totalCredits, conflict } = calculateStartingResources(state, story, { startingCredits: 12000 });
      
      expect(totalCredits).toBe(500); // Default resolution is story priority
      
      expect(conflict).toBeDefined();
      expect(conflict?.story.value).toBe(500);
      expect(conflict?.setupCard.value).toBe(12100); // 12000 + 100 bonus
    });
    
    it('handles manual selection for story priority', () => {
        const story = mockStory({ startingCreditsOverride: 500 });
        const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, resolveConflictsManually: true }};
        const { totalCredits } = calculateStartingResources(state, story, { startingCredits: 12000 }, 'story');
        expect(totalCredits).toBe(500);
    });

    it('handles manual selection for setup card priority', () => {
        const story = mockStory({ startingCreditsOverride: 500, startingCreditsBonus: 100 });
        const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, resolveConflictsManually: true }};
        const { totalCredits } = calculateStartingResources(state, story, { startingCredits: 12000 }, 'setupCard');
        expect(totalCredits).toBe(12100);
    });

    it('passes through custom fuel and noFuelParts flags', () => {
      const story = mockStory({ 
        flags: ['noStartingFuelParts'],
        customStartingFuel: 4
      });
      const { noFuelParts, customFuel } = calculateStartingResources(baseGameState, story, {});
      expect(noFuelParts).toBe(true);
      expect(customFuel).toBe(4);
    });
  });

  describe('getCreditsLabel', () => {
    it('returns "Standard Allocation" by default', () => {
      const details = { totalCredits: 3000, bonusCredits: 0 };
      const label = getCreditsLabel(details, {}, mockStory());
      expect(label).toBe("Standard Allocation");
    });
    
    it('shows bonus credit calculation', () => {
      const details = { totalCredits: 4000, bonusCredits: 1000 };
      const overrides = { startingCredits: 3000 };
      const label = getCreditsLabel(details, overrides, mockStory());
      expect(label).toBe("Base $3,000 + Bonus $1,000");
    });

    it('shows story override text when applicable', () => {
      const story = mockStory({ startingCreditsOverride: 500 });
      const details = { totalCredits: 500, bonusCredits: 0 };
      const label = getCreditsLabel(details, {}, story);
      expect(label).toBe("Story Override (Mock Story)");
    });
  });
});
