
import { describe, it, expect } from 'vitest';
import { determineNavDeckDetails } from '../../utils/nav';
import { getDefaultGameState } from '../../utils/state';

describe('utils/nav', () => {
  describe('determineNavDeckDetails', () => {
    const baseGameState = getDefaultGameState();

    it('returns standard rules for default state', () => {
      const details = determineNavDeckDetails(baseGameState, {});
      expect(details.specialRule).toBeNull();
      expect(details.showStandardRules).toBe(true);
      expect(details.clearerSkies).toBe(false);
    });

    it('identifies browncoat "hardcore" mode', () => {
      const details = determineNavDeckDetails(baseGameState, { browncoatNavMode: true });
      expect(details.specialRule).toBe('hardcore');
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies "reshuffle" mode for rimNavMode', () => {
      const details = determineNavDeckDetails(baseGameState, { rimNavMode: true });
      expect(details.specialRule).toBe('reshuffle');
      expect(details.showStandardRules).toBe(false);
    });
    
    it('identifies "reshuffle" mode for forceReshuffle', () => {
      const details = determineNavDeckDetails(baseGameState, { forceReshuffle: true });
      expect(details.specialRule).toBe('reshuffle');
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies flyingSolo mode', () => {
      const details = determineNavDeckDetails(baseGameState, { flyingSoloNavMode: true });
      expect(details.specialRule).toBe('flyingSolo');
      expect(details.showStandardRules).toBe(false);
    });

    it('identifies clearerSkies mode', () => {
      const details = determineNavDeckDetails(baseGameState, { clearerSkiesNavMode: true });
      expect(details.clearerSkies).toBe(true);
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
