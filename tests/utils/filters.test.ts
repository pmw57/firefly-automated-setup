
import { describe, it, expect } from 'vitest';
import { isStoryCompatible } from '../../utils/filters';
import { GameState, StoryCardDef } from '../../types';
import { getDefaultGameState } from '../../utils/state';
import { SETUP_CARD_IDS, STORY_TITLES } from '../../data/ids';

describe('utils/filters', () => {
  describe('isStoryCompatible', () => {
    const baseGameState: GameState = getDefaultGameState();
    const soloStory: StoryCardDef = { title: 'Solo Story', intro: '', isSolo: true };
    const multiStory: StoryCardDef = { title: 'Multi Story', intro: '' };
    const expansionStory: StoryCardDef = { title: 'Blue Sun Story', intro: '', requiredExpansion: 'blue' };
    const multiReqStory: StoryCardDef = { title: 'Multi Req Story', intro: '', requiredExpansion: 'blue', additionalRequirements: ['kalidasa'] };
    const slayStory: StoryCardDef = { title: STORY_TITLES.SLAYING_THE_DRAGON, intro: '' };

    it('returns true for a standard story in a standard multiplayer game', () => {
      expect(isStoryCompatible(multiStory, baseGameState)).toBe(true);
    });

    it('returns false for a solo story in multiplayer mode', () => {
      expect(isStoryCompatible(soloStory, { ...baseGameState, gameMode: 'multiplayer' })).toBe(false);
    });

    it('returns false for a story with unmet expansion requirements', () => {
      // The default game state now enables all expansions, so we must explicitly
      // create a state where the required expansion is disabled for this test.
      const stateWithBlueOff = {
        ...baseGameState,
        expansions: {
          ...baseGameState.expansions,
          blue: false
        }
      };
      expect(isStoryCompatible(expansionStory, stateWithBlueOff)).toBe(false);
    });

    it('returns true for a story when expansion requirements are met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true } };
      expect(isStoryCompatible(expansionStory, state)).toBe(true);
    });

    it('returns false if additional requirements are not met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: false } };
      expect(isStoryCompatible(multiReqStory, state)).toBe(false);
    });

    it('returns true if all requirements are met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: true } };
      expect(isStoryCompatible(multiReqStory, state)).toBe(true);
    });
    
    it('returns true for "Slaying the Dragon" only with 2 players', () => {
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 2 })).toBe(true);
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 3 })).toBe(false);
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 1 })).toBe(false);
    });
    
    // Solo Modes
    it('in Classic Solo mode, only allows "Awful Lonely in the Big Black"', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: 'AwfulLonely' };
      const awfulLonelyStory: StoryCardDef = { title: STORY_TITLES.AWFUL_LONELY, intro: '' };
      
      expect(isStoryCompatible(awfulLonelyStory, state)).toBe(true);
      expect(isStoryCompatible(multiStory, state)).toBe(false);
      expect(isStoryCompatible(soloStory, state)).toBe(false); // Other solo stories are excluded
    });

    it('in Flying Solo mode, allows compatible non-multiplayer-exclusive stories', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
      expect(isStoryCompatible(soloStory, state)).toBe(true);
      expect(isStoryCompatible(multiStory, state)).toBe(true); // Should also be true if not specifically solo
    });
    
    it('in Flying Solo mode, excludes stories on the SOLO_EXCLUDED_STORIES list', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
      const excludedStory: StoryCardDef = { title: "The Great Recession", intro: '' }; // This is on the list
      expect(isStoryCompatible(excludedStory, state)).toBe(false);
    });
  });
});
