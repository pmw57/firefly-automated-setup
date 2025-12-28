/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { isStoryCompatible } from '../../../utils/filters';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { GameState, StoryCardDef } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { SETUP_CARD_IDS } from '../../../data/ids';

describe('utils/filters', () => {
  describe('isStoryCompatible', () => {
    const baseGameState: GameState = getDefaultGameState();
    const soloStory: StoryCardDef = { title: 'Solo Story', intro: '', isSolo: true };
    const multiStory: StoryCardDef = { title: 'Multi Story', intro: '' };
    const expansionStory: StoryCardDef = { title: 'Blue Sun Story', intro: '', requiredExpansion: 'blue' };
    const multiReqStory: StoryCardDef = { title: 'Multi Req Story', intro: '', requiredExpansion: 'blue', additionalRequirements: ['kalidasa'] };
    const slayStory: StoryCardDef = { title: "Slaying The Dragon", intro: '', playerCount: 2 };

    it.concurrent('returns true for a standard story in a standard multiplayer game', () => {
      expect(isStoryCompatible(multiStory, baseGameState)).toBe(true);
    });

    it.concurrent('returns false for a solo story in multiplayer mode', () => {
      expect(isStoryCompatible(soloStory, { ...baseGameState, gameMode: 'multiplayer' })).toBe(false);
    });

    it.concurrent('returns false for a story with unmet expansion requirements', () => {
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

    it.concurrent('returns true for a story when expansion requirements are met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true } };
      expect(isStoryCompatible(expansionStory, state)).toBe(true);
    });

    it.concurrent('returns false if additional requirements are not met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: false } };
      expect(isStoryCompatible(multiReqStory, state)).toBe(false);
    });

    it.concurrent('returns true if all requirements are met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: true } };
      expect(isStoryCompatible(multiReqStory, state)).toBe(true);
    });
    
    it.concurrent('returns true for "Slaying the Dragon" only with 2 players', () => {
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 2 })).toBe(true);
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 3 })).toBe(false);
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 1 })).toBe(false);
    });
    
    // Solo Modes
    it.concurrent('in Classic Solo mode, only allows stories explicitly marked as `isSolo`', () => {
      // Classic solo state means gameMode is solo and not using Flying Solo setup card.
      const state: GameState = { 
        ...baseGameState, 
        gameMode: 'solo', 
        setupCardId: SETUP_CARD_IDS.STANDARD,
        expansions: { ...baseGameState.expansions, tenth: false, community: true }
      };
      
      const soloStory: StoryCardDef = { title: "Awful Lonely In The Big Black", intro: '', isSolo: true };
      const communitySoloStory: StoryCardDef = { title: "Hunt for the Arc", intro: '', isSolo: true, requiredExpansion: 'community' };
      const tenthSoloStory: StoryCardDef = { title: "A Fistful of Scoundrels", intro: '', isSolo: true, requiredExpansion: 'tenth' };
      const nonSoloStory: StoryCardDef = { title: 'Harkens Folly', intro: '' }; // Not marked as solo

      expect(isStoryCompatible(soloStory, state), 'Solo story should be available').toBe(true);
      expect(isStoryCompatible(communitySoloStory, state), 'Community solo story should be available').toBe(true);
      expect(isStoryCompatible(nonSoloStory, state), 'Non-solo story should NOT be available in Classic Solo').toBe(false);
      expect(isStoryCompatible(tenthSoloStory, state), '10th Anniv. story should be filtered out because expansion is off').toBe(false);
    });

    it.concurrent('in Flying Solo mode, allows compatible non-multiplayer-exclusive stories', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
      expect(isStoryCompatible(soloStory, state)).toBe(true);
      expect(isStoryCompatible(multiStory, state)).toBe(true); // Should also be true if not specifically solo
    });
    
    it.concurrent('in Flying Solo mode, excludes stories on the SOLO_EXCLUDED_STORIES list', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
      const excludedStory: StoryCardDef = { title: "The Great Recession", intro: '' }; // This is on the list
      expect(isStoryCompatible(excludedStory, state)).toBe(false);
    });
  });
});