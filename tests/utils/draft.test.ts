/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../../utils/draft';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { DiceResult } from '../../types/index';

describe('utils/draft', () => {
  describe('calculateDraftOutcome', () => {
    it.concurrent('correctly identifies the winner and sets draft order', () => {
      const rolls: DiceResult[] = [
        { player: 'P1', roll: 5 },
        { player: 'P2', roll: 6 },
        { player: 'P3', roll: 3 },
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

    it.concurrent('handles ties by picking the first player with the max roll', () => {
      const rolls: DiceResult[] = [
        { player: 'P1', roll: 6 },
        { player: 'P2', roll: 2 },
        { player: 'P3', roll: 6 },
      ];
      const result = calculateDraftOutcome(rolls, 3);
      expect(result.rolls[0].isWinner).toBe(true); // P1 wins as first in array
      expect(result.rolls[2].isWinner).toBe(false);
      expect(result.draftOrder).toEqual(['P1', 'P2', 'P3']);
    });

    it.concurrent('respects overrideWinnerIndex for forced tie breaking', () => {
      const rolls: DiceResult[] = [
        { player: 'P1', roll: 6 }, 
        { player: 'P2', roll: 2 }, 
        { player: 'P3', roll: 6 }
      ];

      // Force P3 (Index 2) to be winner despite P1 also having 6
      const result = calculateDraftOutcome(rolls, 3, 2);

      expect(result.rolls[2].isWinner).toBe(true);
      expect(result.rolls[0].isWinner).toBe(false);
      expect(result.draftOrder).toEqual(['P3', 'P1', 'P2']);
    });
  });

  describe('runAutomatedDraft', () => {
    it.concurrent('produces a valid draft state for multiple players', () => {
      const playerNames = ['Captain A', 'Captain B', 'Captain C'];
      const result = runAutomatedDraft(playerNames);
      
      expect(result.rolls.length).toBe(3);
      expect(result.rolls.filter(r => r.isWinner).length).toBe(1);
      expect(result.draftOrder.length).toBe(3);
      expect(result.placementOrder.length).toBe(3);
      expect(new Set(result.draftOrder).size).toBe(3); // All players are in the order
    });
  });
  
  describe('getInitialSoloDraftState', () => {
    it.concurrent('produces a valid draft state for a solo player', () => {
      const result = getInitialSoloDraftState('Solo Captain');
      expect(result.rolls).toEqual([{ player: 'Solo Captain', roll: 6, isWinner: true }]);
      expect(result.draftOrder).toEqual(['Solo Captain']);
      expect(result.placementOrder).toEqual(['Solo Captain']);
    });
  });
});