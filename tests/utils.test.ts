
import { describe, it, expect } from 'vitest';
// FIX: Changed import path to point to the utils directory index.
import { calculateDraftOutcome, determineJobMode, calculateStartingResources } from '../utils/index';
import { DiceResult, StoryCardDef, StoryCardConfig, StepOverrides } from '../types';

describe('utils', () => {
  describe('calculateDraftOutcome', () => {
    it('correctly identifies the winner and sets draft order', () => {
      const rolls: DiceResult[] = [
        { player: 'P1', roll: 5 },
        { player: 'P2', roll: 20 },
        { player: 'P3', roll: 10 },
        { player: 'P4', roll: 1 }
      ];

      const result = calculateDraftOutcome(rolls, 4);

      expect(result.rolls[1].isWinner).toBe(true);
      expect(result.rolls[0].isWinner).toBe(false);

      // Draft Order: Winner (P2), then clockwise (P3, P4, P1)
      expect(result.draftOrder).toEqual(['P2', 'P3', 'P4', 'P1']);
      
      // Placement Order: Reverse of draft (P1, P4, P3, P2)
      expect(result.placementOrder).toEqual(['P1', 'P4', 'P3', 'P2']);
    });

    it('respects overrideWinnerIndex for forced tie breaking', () => {
      // P2 has highest visible roll, but override says P1 won (e.g. tie-breaker result)
      const rolls: DiceResult[] = [
        { player: 'P1', roll: 2 }, 
        { player: 'P2', roll: 5 }, 
        { player: 'P3', roll: 4 }
      ];

      // Force P1 (Index 0) to be winner despite lower roll
      const result = calculateDraftOutcome(rolls, 3, 0);

      expect(result.rolls[0].isWinner).toBe(true);
      expect(result.rolls[1].isWinner).toBe(false);
      expect(result.draftOrder[0]).toBe('P1');
    });
  });

  // Shared Helper
  const mockStory = (config: Partial<StoryCardConfig> = {}): StoryCardDef => ({
    title: 'Mock Story',
    intro: 'Intro',
    setupConfig: config
  });

  describe('determineJobMode', () => {
    it('returns story mode if defined (Highest Priority)', () => {
      const story = mockStory({ jobDrawMode: 'no_jobs' });
      // Even if overrides are present, story config takes precedence in current logic
      expect(determineJobMode(story, {})).toBe('no_jobs');
    });

    it('returns standard if no overrides and no story config', () => {
      expect(determineJobMode(mockStory(), {})).toBe('standard');
    });

    // Test all Override Flags
    it.each([
      ['browncoatJobMode', 'no_jobs'],
      ['timesJobMode', 'times_jobs'],
      ['allianceHighAlertJobMode', 'high_alert_jobs'],
      ['buttonsJobMode', 'buttons_jobs'],
      ['awfulJobMode', 'awful_jobs']
    ])('returns %s when %s override is true', (key: string, expectedMode: string) => {
      const overrideKey = key as keyof StepOverrides;
      const overrides: StepOverrides = { [overrideKey]: true };
      
      expect(determineJobMode(mockStory(), overrides)).toBe(expectedMode);
    });
  });

  describe('calculateStartingResources', () => {
    it('returns default 3000 credits and empty flags', () => {
      const { totalCredits, bonusCredits, noFuelParts, customFuel } = calculateStartingResources(mockStory(), {});
      expect(totalCredits).toBe(3000);
      expect(bonusCredits).toBe(0);
      expect(noFuelParts).toBeUndefined();
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
        noStartingFuelParts: true,
        customStartingFuel: 4
      });
      const { noFuelParts, customFuel } = calculateStartingResources(story, {});
      expect(noFuelParts).toBe(true);
      expect(customFuel).toBe(4);
    });
  });
});