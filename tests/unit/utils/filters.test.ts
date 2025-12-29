
/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { isStoryCompatible } from '../../../utils/filters';
import { GameState, StoryCardDef } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { SETUP_CARD_IDS } from '../../../data/ids';
import { STORY_CARDS } from '../../../data/storyCards';

const getStory = (title: string): StoryCardDef => {
  const card = STORY_CARDS.find(c => c.title === title);
  if (!card) throw new Error(`Test data missing: Could not find story card "${title}"`);
  return card;
};

describe('utils/filters', () => {
  describe('isStoryCompatible', () => {
    const baseGameState: GameState = getDefaultGameState();
    // Mocks for generic tests
    const mockSoloStory: StoryCardDef = { title: 'Mock Solo Story', intro: '', isSolo: true };
    const mockMultiStory: StoryCardDef = { title: 'Mock Multi Story', intro: '' };
    const mockExpansionStory: StoryCardDef = { title: 'Mock Blue Sun Story', intro: '', requiredExpansion: 'blue' };
    const mockMultiReqStory: StoryCardDef = { title: 'Mock Multi Req Story', intro: '', requiredExpansion: 'blue', additionalRequirements: ['kalidasa'] };
    
    // Real cards for specific logic tests
    const slayStory = getStory("Slaying The Dragon");
    const greatRecessionStory = getStory("The Great Recession");
    const awfulLonelyStory = getStory("Awful Lonely In The Big Black");
    const huntForArcStory = getStory("Hunt For The Arc");
    const fistfulStory = getStory("A Fistful Of Scoundrels");
    const harkensFollyStory = getStory("Harken's Folly");

    it.concurrent('returns true for a standard story in a standard multiplayer game', () => {
      expect(isStoryCompatible(mockMultiStory, baseGameState)).toBe(true);
    });

    it.concurrent('returns false for a solo story in multiplayer mode', () => {
      expect(isStoryCompatible(mockSoloStory, { ...baseGameState, gameMode: 'multiplayer' })).toBe(false);
    });

    it.concurrent('returns false for a story with unmet expansion requirements', () => {
      const stateWithBlueOff = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false }};
      expect(isStoryCompatible(mockExpansionStory, stateWithBlueOff)).toBe(false);
    });

    it.concurrent('returns true for a story when expansion requirements are met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true } };
      expect(isStoryCompatible(mockExpansionStory, state)).toBe(true);
    });

    it.concurrent('returns false if additional requirements are not met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: false } };
      expect(isStoryCompatible(mockMultiReqStory, state)).toBe(false);
    });

    it.concurrent('returns true if all requirements are met', () => {
      const state = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: true } };
      expect(isStoryCompatible(mockMultiReqStory, state)).toBe(true);
    });
    
    it.concurrent('returns true for "Slaying the Dragon" only with 2 players', () => {
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 2 })).toBe(true);
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 3 })).toBe(false);
      expect(isStoryCompatible(slayStory, { ...baseGameState, playerCount: 1 })).toBe(false);
    });
    
    // Solo Modes
    it.concurrent('in Classic Solo mode, only allows stories explicitly marked as `isSolo`', () => {
      const state: GameState = { 
        ...baseGameState, 
        gameMode: 'solo', 
        setupCardId: SETUP_CARD_IDS.STANDARD,
        expansions: { ...baseGameState.expansions, tenth: false, community: true }
      };
      
      expect(isStoryCompatible(awfulLonelyStory, state), 'Solo story should be available').toBe(true);
      expect(isStoryCompatible(huntForArcStory, state), 'Community solo story should be available').toBe(true);
      expect(isStoryCompatible(harkensFollyStory, state), 'Non-solo story should NOT be available in Classic Solo').toBe(false);
      expect(isStoryCompatible(fistfulStory, state), '10th Anniv. story should be filtered out because expansion is off').toBe(false);
    });

    it.concurrent('in Flying Solo mode, allows compatible non-multiplayer-exclusive stories', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
      expect(isStoryCompatible(mockSoloStory, state)).toBe(true);
      expect(isStoryCompatible(mockMultiStory, state)).toBe(true);
    });
    
    it.concurrent('in Flying Solo mode, excludes stories on the SOLO_EXCLUDED_STORIES list', () => {
      const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
      expect(isStoryCompatible(greatRecessionStory, state)).toBe(false);
    });
  });
});