import { describe, it, expect } from 'vitest';
import { determineNavDeckDetails } from '../../utils/nav';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/nav', () => {
  describe('determineNavDeckDetails', () => {
    const baseGameState = getDefaultGameState();

    it('returns standard rules for default state', () => {
      const details = determineNavDeckDetails(baseGameState, {});
      expect(details.forceReshuffle).toBe(false);
      expect(details.showStandardRules).toBe(true);
      expect(details.clearerSkies).toBe(false);
    });

    it('identifies browncoatNavMode as a forced reshuffle mode', () => {
      // FIX: Replaced non-existent `browncoatNavMode` with `navMode: 'browncoat'`.
      const details = determineNavDeckDetails(baseGameState, { navMode: 'browncoat' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies rimNavMode as a forced reshuffle mode', () => {
      // FIX: Replaced non-existent `rimNavMode` with `navMode: 'rim'`.
      const details = determineNavDeckDetails(baseGameState, { navMode: 'rim' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });
    
    it('identifies standard_reshuffle navMode', () => {
      const details = determineNavDeckDetails(baseGameState, { navMode: 'standard_reshuffle' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies flyingSoloNavMode as a forced reshuffle mode', () => {
      // FIX: Replaced non-existent `flyingSoloNavMode` with `navMode: 'flying_solo'`.
      const details = determineNavDeckDetails(baseGameState, { navMode: 'flying_solo' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies clearerSkies mode', () => {
      // FIX: Replaced non-existent `clearerSkiesNavMode` with `navMode: 'clearer_skies'`.
      const details = determineNavDeckDetails(baseGameState, { navMode: 'clearer_skies' });
      expect(details.clearerSkies).toBe(true);
      expect(details.forceReshuffle).toBe(true);
    });

    it('correctly identifies solo vs multiplayer', () => {
      const soloState = { ...baseGameState, playerCount: 1 };
      const multiState = { ...baseGameState, playerCount: 4 };
      expect(determineNavDeckDetails(soloState, {}).isSolo).toBe(true);
      expect(determineNavDeckDetails(multiState, {}).isSolo).toBe(false);
    });
    
    it('correctly identifies high player count', () => {
      const lowState = { ...baseGameState, playerCount: 2 };
      const highState = { ...baseGameState, playerCount: 3 };
      expect(determineNavDeckDetails(lowState, {}).isHighPlayerCount).toBe(false);
      expect(determineNavDeckDetails(highState, {}).isHighPlayerCount).toBe(true);
    });
  });
});
