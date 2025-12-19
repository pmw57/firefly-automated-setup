import { describe, it, expect } from 'vitest';
// FIX: Update import to point to the refactored selector function.
import { getNavDeckDetails } from '../../utils/selectors';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/nav', () => {
  // FIX: Update function name to match new selector.
  describe('getNavDeckDetails', () => {
    const baseGameState = getDefaultGameState();

    it('returns standard rules for default state', () => {
      // FIX: Update function name to match new selector.
      const details = getNavDeckDetails(baseGameState, {});
      expect(details.forceReshuffle).toBe(false);
      expect(details.showStandardRules).toBe(true);
      expect(details.clearerSkies).toBe(false);
    });

    it('identifies browncoatNavMode as a forced reshuffle mode', () => {
      // FIX: Replaced non-existent `browncoatNavMode` with `navMode: 'browncoat'`.
      // FIX: Update function name to match new selector.
      const details = getNavDeckDetails(baseGameState, { navMode: 'browncoat' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies rimNavMode as a forced reshuffle mode', () => {
      // FIX: Replaced non-existent `rimNavMode` with `navMode: 'rim'`.
      // FIX: Update function name to match new selector.
      const details = getNavDeckDetails(baseGameState, { navMode: 'rim' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });
    
    it('identifies standard_reshuffle navMode', () => {
      // FIX: Update function name to match new selector.
      const details = getNavDeckDetails(baseGameState, { navMode: 'standard_reshuffle' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies flyingSoloNavMode as a forced reshuffle mode', () => {
      // FIX: Replaced non-existent `flyingSoloNavMode` with `navMode: 'flying_solo'`.
      // FIX: Update function name to match new selector.
      const details = getNavDeckDetails(baseGameState, { navMode: 'flying_solo' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies clearerSkies mode', () => {
      // FIX: Replaced non-existent `clearerSkiesNavMode` with `navMode: 'clearer_skies'`.
      // FIX: Update function name to match new selector.
      const details = getNavDeckDetails(baseGameState, { navMode: 'clearer_skies' });
      expect(details.clearerSkies).toBe(true);
      expect(details.forceReshuffle).toBe(true);
    });

    it('correctly identifies solo vs multiplayer', () => {
      const soloState = { ...baseGameState, playerCount: 1 };
      const multiState = { ...baseGameState, playerCount: 4 };
      // FIX: Update function name to match new selector.
      expect(getNavDeckDetails(soloState, {}).isSolo).toBe(true);
      // FIX: Update function name to match new selector.
      expect(getNavDeckDetails(multiState, {}).isSolo).toBe(false);
    });
    
    it('correctly identifies high player count', () => {
      const lowState = { ...baseGameState, playerCount: 2 };
      const highState = { ...baseGameState, playerCount: 3 };
      // FIX: Update function name to match new selector.
      expect(getNavDeckDetails(lowState, {}).isHighPlayerCount).toBe(false);
      // FIX: Update function name to match new selector.
      expect(getNavDeckDetails(highState, {}).isHighPlayerCount).toBe(true);
    });
  });
});
