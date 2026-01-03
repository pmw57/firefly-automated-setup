/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getPrimeDetails } from '../../../utils/prime';
import { GameState } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { STORY_CARDS } from '../../../data/storyCards';

describe('rules/prime', () => {
  describe('getPrimeDetails', () => {
    const baseGameState = getDefaultGameState();

    const stateForStandardPriming: GameState = {
        ...baseGameState,
        expansions: {
            ...baseGameState.expansions,
            kalidasa: false,
            pirates: false,
            breakin_atmo: false,
            still_flying: false,
        }
    };

    it.concurrent('calculates standard priming (3 cards)', () => {
      const details = getPrimeDetails(stateForStandardPriming, {});
      
      expect(details.finalCount).toBe(3);
      expect(details.baseDiscard).toBe(3);
      expect(details.effectiveMultiplier).toBe(1);
      expect(details.isHighSupplyVolume).toBe(false);
    });

    it.concurrent('identifies high supply volume with 3+ relevant expansions', () => {
      const state: GameState = {
        ...baseGameState,
        expansions: { ...baseGameState.expansions, kalidasa: true, pirates: true, breakin_atmo: true, still_flying: false },
        optionalRules: { ...baseGameState.optionalRules, highVolumeSupply: false },
      };
      const details = getPrimeDetails(state, {});
      expect(details.isHighSupplyVolume).toBe(true);
      expect(details.baseDiscard).toBe(3); // House rule disabled
      expect(details.finalCount).toBe(3);
    });
    
    it.concurrent('applies house rule for high supply volume, increasing base discard to 4', () => {
      const state: GameState = {
        ...baseGameState,
        expansions: { ...baseGameState.expansions, kalidasa: true, pirates: true, breakin_atmo: true },
        optionalRules: { ...baseGameState.optionalRules, highVolumeSupply: true },
      };
      const details = getPrimeDetails(state, {});
      expect(details.isHighSupplyVolume).toBe(true);
      expect(details.baseDiscard).toBe(4); // House rule enabled
      expect(details.finalCount).toBe(4);
    });

    it.concurrent('applies blitz mode multiplier (2x)', () => {
      const details = getPrimeDetails(stateForStandardPriming, { primeMode: 'blitz' });
      expect(details.isBlitz).toBe(true);
      expect(details.effectiveMultiplier).toBe(2);
      expect(details.finalCount).toBe(6); // 3 * 2
    });

    it.concurrent('applies story multiplier', () => {
      const storyTitle = "A Friend In Every Port";
      const state: GameState = {
        ...stateForStandardPriming,
        // FIX: Updated test state setup to use `selectedStoryCardIndex` with the story card's index instead of `selectedStoryCard` with its title, correcting the property access to match the `GameState` type.
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle)
      };
      const details = getPrimeDetails(state, {});
      expect(details.effectiveMultiplier).toBe(2);
      expect(details.finalCount).toBe(6); // 3 * 2
    });
    
    it.concurrent('prioritizes blitz multiplier over story multiplier', () => {
      const storyTitle = "A Friend In Every Port";
      const state: GameState = {
        ...stateForStandardPriming,
        // FIX: Updated test state setup to use `selectedStoryCardIndex` with the story card's index instead of `selectedStoryCard` with its title, correcting the property access to match the `GameState` type.
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle)
      };
      const details = getPrimeDetails(state, { primeMode: 'blitz' });
      expect(details.effectiveMultiplier).toBe(2); // Blitz is 2x
      expect(details.finalCount).toBe(6); // 3 * 2
    });

    it.concurrent('applies Slaying the Dragon modifier (+2 cards)', () => {
        const storyTitle = "Slaying The Dragon";
        const state: GameState = {
            ...stateForStandardPriming,
            // FIX: Updated test state setup to use `selectedStoryCardIndex` with the story card's index instead of `selectedStoryCard` with its title, correcting the property access to match the `GameState` type.
            selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
        };
        const details = getPrimeDetails(state, {});
        expect(details.finalCount).toBe(5); // 3 + 2
    });

    it.concurrent('combines blitz and Slaying the Dragon', () => {
        const storyTitle = "Slaying The Dragon";
        const state: GameState = {
            ...stateForStandardPriming,
            // FIX: Updated test state setup to use `selectedStoryCardIndex` with the story card's index instead of `selectedStoryCard` with its title, correcting the property access to match the `GameState` type.
            selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
        };
        const details = getPrimeDetails(state, { primeMode: 'blitz' });
        expect(details.finalCount).toBe(8); // (3 * 2) + 2
    });

    it.concurrent('generates a rule for alertStackCount from "It\'s All In Who You Know"', () => {
      const storyTitle = "It's All In Who You Know";
      const state: GameState = { 
        ...baseGameState, 
        playerCount: 4, 
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle)
      };
      
      const details = getPrimeDetails(state, {});
      const rule = details.specialRules.find(r => r.title === 'Increased Alliance Presence');
      expect(rule).toBeDefined();
      expect(rule?.source).toBe('story');
      
      const contentString = JSON.stringify(rule?.content);
      expect(contentString).toContain('12 Alliance Alert Tokens');
      expect(contentString).toContain('(3 per player)');
    });
  });
});