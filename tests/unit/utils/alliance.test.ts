/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getAllianceReaverDetails } from '../../../utils/alliance';
import { getDefaultGameState } from '../../../state/reducer';
import { SETUP_CARD_IDS } from '../../../data/ids';

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

    it.concurrent('correctly sets alliance placement based on setup card rules', () => {
        // Standard
        const detailsStandard = getAllianceReaverDetails(baseGameState, {});
        expect(detailsStandard.alliancePlacement).toContain('Londinium');
        
        // "The Heat Is On" setup card sets placement to Regulus AND Persephone
        const stateWithHeat = { ...baseGameState, setupCardId: SETUP_CARD_IDS.THE_HEAT_IS_ON };
        const detailsHeat = getAllianceReaverDetails(stateWithHeat, {});
        expect(detailsHeat.alliancePlacement).toContain('Regulus AND Persephone');
    });
  });
});