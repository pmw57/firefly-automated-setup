import { describe, it, expect } from 'vitest';
import { getPrimeDetails } from '../../utils/selectors/setup';
import { GameState } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { STORY_TITLES } from '../../data/ids';

describe('utils/prime', () => {
  describe('getPrimeDetails', () => {
    const baseGameState = getDefaultGameState();

    // This state is for testing standard priming (base discard of 3)
    // The default game state enables all expansions. To test the "standard" priming
    // without high supply volume, we must explicitly disable supply-heavy expansions.
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

    it('calculates standard priming (3 cards)', () => {
      const details = getPrimeDetails(stateForStandardPriming, {});
      
      expect(details.finalCount).toBe(3);
      expect(details.baseDiscard).toBe(3);
      expect(details.effectiveMultiplier).toBe(1);
      expect(details.isHighSupplyVolume).toBe(false);
    });

    it('identifies high supply volume with 3+ relevant expansions', () => {
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
    
    it('applies house rule for high supply volume, increasing base discard to 4', () => {
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

    it('applies blitz mode multiplier (2x)', () => {
      const details = getPrimeDetails(stateForStandardPriming, { primeMode: 'blitz' });
      expect(details.isBlitz).toBe(true);
      expect(details.effectiveMultiplier).toBe(2);
      expect(details.finalCount).toBe(6); // 3 * 2
    });

    it('applies story multiplier', () => {
      const state: GameState = {
        ...stateForStandardPriming,
        selectedStoryCard: "A Friend In Every Port" // This has primingMultiplier: 2
      };
      const details = getPrimeDetails(state, {});
      expect(details.effectiveMultiplier).toBe(2);
      expect(details.finalCount).toBe(6); // 3 * 2
    });
    
    it('prioritizes blitz multiplier over story multiplier', () => {
      const state: GameState = {
        ...stateForStandardPriming,
        selectedStoryCard: "A Friend In Every Port" // This has primingMultiplier: 2
      };
      const details = getPrimeDetails(state, { primeMode: 'blitz' });
      expect(details.effectiveMultiplier).toBe(2); // Blitz is 2x
      expect(details.finalCount).toBe(6); // 3 * 2
    });

    it('applies Slaying the Dragon modifier (+2 cards)', () => {
        const state: GameState = {
            ...stateForStandardPriming,
            selectedStoryCard: STORY_TITLES.SLAYING_THE_DRAGON,
        };
        const details = getPrimeDetails(state, {});
        expect(details.finalCount).toBe(5); // 3 + 2
    });

    it('combines blitz and Slaying the Dragon', () => {
        const state: GameState = {
            ...stateForStandardPriming,
            selectedStoryCard: STORY_TITLES.SLAYING_THE_DRAGON,
        };
        const details = getPrimeDetails(state, { primeMode: 'blitz' });
        expect(details.finalCount).toBe(8); // (3 * 2) + 2
    });
  });
});