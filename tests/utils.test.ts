
import { describe, it, expect } from 'vitest';
import { calculateAllianceReaverDetails } from '../utils/alliance';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils/draft';
import { isStoryCompatible } from '../utils/filters';
import { calculateSetupFlow } from '../utils/flow';
import { getDefaultGameState } from '../utils/state';
import { GameState, StoryCardDef, DiceResult } from '../types';
import { STORY_TITLES, STEP_IDS } from '../data/ids';

describe('utils', () => {
  const baseGameState: GameState = getDefaultGameState();

  describe('alliance', () => {
    it('calculates alertStackCount based on player count', () => {
      const story: StoryCardDef = { title: 'T', intro: '', setupConfig: { createAlertTokenStackMultiplier: 2 } };
      const state = { ...baseGameState, playerCount: 3 };
      const details = calculateAllianceReaverDetails(state, story);
      expect(details.alertStackCount).toBe(6);
    });
  });

  describe('draft', () => {
    it('correctly identifies a single winner and sets draft/placement order', () => {
      const rolls: DiceResult[] = [{ player: 'P1', roll: 5 }, { player: 'P2', roll: 6 }, { player: 'P3', roll: 3 }];
      const result = calculateDraftOutcome(rolls, 3);
      expect(result.rolls[1].isWinner).toBe(true);
      expect(result.draftOrder).toEqual(['P2', 'P3', 'P1']);
      expect(result.placementOrder).toEqual(['P1', 'P3', 'P2']);
    });
    
    it('produces a valid draft state for an automated draft', () => {
      const playerNames = ['A', 'B', 'C', 'D'];
      const result = runAutomatedDraft(playerNames);
      expect(result.rolls.length).toBe(4);
      expect(result.rolls.filter(r => r.isWinner).length).toBe(1);
      expect(new Set(result.draftOrder).size).toBe(4);
    });

    it('creates a correct initial state for a solo player', () => {
        const result = getInitialSoloDraftState('Mal');
        expect(result.rolls).toEqual([{player: 'Mal', roll: 6, isWinner: true}]);
        expect(result.draftOrder).toEqual(['Mal']);
    });
  });

  describe('filters', () => {
    it('returns false for a story if required expansion is missing', () => {
      const story: StoryCardDef = { title: 'T', intro: '', requiredExpansion: 'blue' };
      expect(isStoryCompatible(story, baseGameState)).toBe(false);
    });
    
    it('returns true for a story if required expansion is present', () => {
      const story: StoryCardDef = { title: 'T', intro: '', requiredExpansion: 'blue' };
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true } };
      expect(isStoryCompatible(story, state)).toBe(true);
    });

    it('returns true for "Slaying The Dragon" only with 2 players', () => {
        const story: StoryCardDef = { title: STORY_TITLES.SLAYING_THE_DRAGON, intro: '' };
        expect(isStoryCompatible(story, { ...baseGameState, playerCount: 2 })).toBe(true);
        expect(isStoryCompatible(story, { ...baseGameState, playerCount: 3 })).toBe(false);
    });
  });

  describe('flow', () => {
    it('generates the standard flow by default', () => {
      const flow = calculateSetupFlow(baseGameState);
      const ids = flow.map(f => f.id);
      expect(ids).toContain(STEP_IDS.CORE_NAV_DECKS);
      expect(ids).not.toContain(STEP_IDS.D_HAVEN_DRAFT);
    });

    it('includes optional rules step if 10th anniversary is active', () => {
        const state: GameState = { ...baseGameState, expansions: { ...baseGameState.expansions, tenth: true }};
        const flow = calculateSetupFlow(state);
        expect(flow.some(f => f.id === STEP_IDS.SETUP_OPTIONAL_RULES)).toBe(true);
    });
  });
});
