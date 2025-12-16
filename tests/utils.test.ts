
import { describe, it, expect } from 'vitest';
import { calculateAllianceReaverDetails } from '../utils/alliance';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils/draft';
import { isStoryCompatible } from '../utils/filters';
import { calculateSetupFlow } from '../utils/flow';
import { calculatePrimeDetails } from '../utils/prime';
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
      // Create an isolated state for this test to ensure 'blue' is false.
      const stateWithBlueOff = getDefaultGameState();
      stateWithBlueOff.expansions.blue = false;
      expect(isStoryCompatible(story, stateWithBlueOff)).toBe(false);
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
    it('generates the standard flow with optional rules by default', () => {
      const flow = calculateSetupFlow(baseGameState);
      const ids = flow.map(f => f.id);
      expect(ids).toContain(STEP_IDS.CORE_NAV_DECKS);
      expect(ids).toContain(STEP_IDS.SETUP_OPTIONAL_RULES);
      expect(ids).not.toContain(STEP_IDS.D_HAVEN_DRAFT);
    });
    
    it('generates a different flow for "The Browncoat Way"', () => {
      const state: GameState = { ...baseGameState, setupCardId: 'TheBrowncoatWay' };
      const flow = calculateSetupFlow(state);
      const flowIds = flow.map(f => f.id);
      
      expect(flowIds).toEqual([
        STEP_IDS.SETUP_CAPTAIN_EXPANSIONS,
        STEP_IDS.SETUP_CARD_SELECTION,
        STEP_IDS.CORE_MISSION,
        STEP_IDS.CORE_NAV_DECKS,
        STEP_IDS.CORE_ALLIANCE_REAVER,
        STEP_IDS.D_BC_CAPITOL,
        STEP_IDS.CORE_DRAFT,
        STEP_IDS.CORE_JOBS,
        STEP_IDS.CORE_PRIME_PUMP,
        STEP_IDS.FINAL,
      ]);
    });
  });

  describe('prime', () => {
    // Create a version of the default state with supply-heavy expansions turned OFF
    // to test baseline behavior.
    const baseStateForPrimingTests: GameState = {
        ...baseGameState,
        expansions: {
            ...baseGameState.expansions,
            kalidasa: false,
            pirates: false,
            breakin_atmo: false,
            still_flying: false,
        }
    };
    
    const mockStory: StoryCardDef = { title: 'Mock Story', intro: '' };

    it('calculates standard priming (3 cards)', () => {
      const details = calculatePrimeDetails(baseStateForPrimingTests, {}, mockStory, false);
      expect(details.finalCount).toBe(3);
      expect(details.baseDiscard).toBe(3);
      expect(details.effectiveMultiplier).toBe(1);
      expect(details.isHighSupplyVolume).toBe(false);
    });
  });
});
