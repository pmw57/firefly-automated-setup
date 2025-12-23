import { describe, it, expect } from 'vitest';
import { getNavDeckDetails } from '../../utils/nav';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/nav', () => {
  describe('getNavDeckDetails', () => {
    const baseGameState = getDefaultGameState();

    it('returns standard rules for default state', () => {
      const details = getNavDeckDetails(baseGameState, {});
      expect(details.forceReshuffle).toBe(false);
      expect(details.showStandardRules).toBe(true);
      expect(details.clearerSkies).toBe(false);
    });

    it('identifies browncoatNavMode as a forced reshuffle mode', () => {
      const details = getNavDeckDetails(baseGameState, { navMode: 'browncoat' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies rimNavMode as a forced reshuffle mode', () => {
      const details = getNavDeckDetails(baseGameState, { navMode: 'rim' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });
    
    it('identifies standard_reshuffle navMode', () => {
      const details = getNavDeckDetails(baseGameState, { navMode: 'standard_reshuffle' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies flyingSoloNavMode as a forced reshuffle mode', () => {
      const details = getNavDeckDetails(baseGameState, { navMode: 'flying_solo' });
      expect(details.forceReshuffle).toBe(true);
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies clearerSkies mode', () => {
      const details = getNavDeckDetails(baseGameState, { navMode: 'clearer_skies' });
      expect(details.clearerSkies).toBe(true);
      expect(details.forceReshuffle).toBe(true);
    });

    it('correctly identifies solo vs multiplayer', () => {
      const soloState = { ...baseGameState, playerCount: 1 };
      const multiState = { ...baseGameState, playerCount: 4 };
      expect(getNavDeckDetails(soloState, {}).isSolo).toBe(true);
      expect(getNavDeckDetails(multiState, {}).isSolo).toBe(false);
    });
    
    it('correctly identifies high player count', () => {
      const lowState = { ...baseGameState, playerCount: 2 };
      const highState = { ...baseGameState, playerCount: 3 };
      expect(getNavDeckDetails(lowState, {}).isHighPlayerCount).toBe(false);
      expect(getNavDeckDetails(highState, {}).isHighPlayerCount).toBe(true);
    });
  });
});