/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getAllianceReaverDetails } from '../../../utils/alliance';
import { getDefaultGameState } from '../../../state/reducer';

describe('rules/alliance', () => {
  describe('getAllianceReaverDetails', () => {
    const baseGameState = getDefaultGameState();

    it.concurrent('returns default values for a standard game', () => {
      const details = getAllianceReaverDetails(baseGameState, {});
      expect(details.specialRules).toEqual([]);
      expect(details.alliancePlacement).toContain('Londinium');
      expect(details.reaverPlacement).toContain('3 Cutters'); // Default state has Blue Sun
    });

    it.concurrent('correctly sets reaver placement based on blue sun expansion', () => {
        // With Blue Sun
        const detailsWith = getAllianceReaverDetails(baseGameState, {});
        expect(detailsWith.reaverPlacement).toContain('3 Cutters');
        
        // Without Blue Sun
        const stateWithoutBlue = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false } };
        const detailsWithout = getAllianceReaverDetails(stateWithoutBlue, {});
        expect(detailsWithout.reaverPlacement).toContain('1 Cutter');
    });
  });
});