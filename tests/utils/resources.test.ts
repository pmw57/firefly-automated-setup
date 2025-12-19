import { describe, it, expect } from 'vitest';
import { calculateStartingResources } from '../../utils/resources';
// FIX: Changed Effect to ModifyResourceEffect as the test cases use the extended type with 'resource' and 'method' properties.
import { StoryCardDef, GameState, ModifyResourceEffect } from '../../types';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/resources', () => {
  const baseGameState = getDefaultGameState();

  // FIX: The effects array should be of type ModifyResourceEffect[] to match the StoryCardDef interface and the test data.
  const mockStory = (effects: ModifyResourceEffect[] = []): StoryCardDef => ({
    title: 'Mock Story',
    intro: 'Intro',
    effects,
  });

  const getGameStateWithCards = (
    setupCardId: string,
    storyCard?: StoryCardDef,
    optionalRules: Partial<GameState['optionalRules']> = {}
  ): GameState => ({
    ...baseGameState,
    setupCardId,
    selectedStoryCard: storyCard?.title || '',
    optionalRules: { ...baseGameState.optionalRules, ...optionalRules },
  });

  describe('calculateStartingResources with Effect System', () => {
    it('returns default resources for a standard game', () => {
      const state = getGameStateWithCards('Standard');
      const details = calculateStartingResources(state);
      expect(details.credits).toBe(3000);
      expect(details.fuel).toBe(6);
      expect(details.parts).toBe(2);
      expect(details.warrants).toBe(0);
      expect(details.isFuelDisabled).toBe(false);
      expect(details.creditModifications[0].description).toBe('Standard Allocation');
    });

    it('applies a "set" credits effect from a setup card', () => {
      const state = getGameStateWithCards('TheBrowncoatWay'); // Has a set $12000 effect
      const details = calculateStartingResources(state);
      expect(details.credits).toBe(12000);
      expect(details.creditModifications[0].description).toBe('Setup Card Allocation');
    });

    it('applies an "add" credits effect from a story card', () => {
      const story = mockStory([
        { type: 'modifyResource', resource: 'credits', method: 'add', value: 1200, source: { source: 'story', name: 'Bonus' }, description: 'Story Bonus' }
      ]);
      const state = getGameStateWithCards('Standard', story);
      const details = calculateStartingResources(state, undefined, story);
      expect(details.credits).toBe(4200); // 3000 + 1200
      expect(details.creditModifications.length).toBe(2);
      expect(details.creditModifications[1].description).toBe('Story Bonus');
    });
    
    it('applies a "set" credits effect from a story card, overriding the base', () => {
      const story = mockStory([
        { type: 'modifyResource', resource: 'credits', method: 'set', value: 500, source: { source: 'story', name: 'Override' }, description: 'Story Override' }
      ]);
      const state = getGameStateWithCards('Standard', story);
      const details = calculateStartingResources(state, undefined, story);
      expect(details.credits).toBe(500);
      expect(details.creditModifications[0].description).toBe('Story Override');
    });

    it('identifies a conflict between "set" credit effects and defaults to story priority', () => {
      const story = mockStory([
        { type: 'modifyResource', resource: 'credits', method: 'set', value: 500, source: { source: 'story', name: 'Story Override' }, description: 'Story Override' }
      ]);
      const state = getGameStateWithCards('TheBrowncoatWay', story); // Browncoat sets to 12000
      const details = calculateStartingResources(state, undefined, story);
      
      expect(details.conflict).toBeDefined();
      expect(details.conflict?.story.value).toBe(500);
      expect(details.conflict?.setupCard.value).toBe(12000);
      expect(details.credits).toBe(500); // Story wins
    });
    
    it('respects manual selection for setup card priority in a conflict', () => {
      const story = mockStory([
        { type: 'modifyResource', resource: 'credits', method: 'set', value: 500, source: { source: 'story', name: 'Story Override' }, description: 'Story Override' }
      ]);
      const state = getGameStateWithCards('TheBrowncoatWay', story, { resolveConflictsManually: true });
      const details = calculateStartingResources(state, 'setupCard', story); // User selects setup card
      
      expect(details.conflict).toBeDefined();
      expect(details.credits).toBe(12000); // Setup card wins
    });

    it('applies "disable" effects for fuel and parts', () => {
      const story = mockStory([
        { type: 'modifyResource', resource: 'fuel', method: 'disable', source: { source: 'story', name: 'No Fuel' }, description: 'No Fuel' }
      ]);
      const state = getGameStateWithCards('Standard', story);
      const details = calculateStartingResources(state, undefined, story);

      expect(details.fuel).toBe(0);
      expect(details.isFuelDisabled).toBe(true);
      expect(details.parts).toBe(2);
      expect(details.isPartsDisabled).toBe(false);
    });
    
    it('correctly applies effects from TheBrowncoatWay setup card', () => {
      const state = getGameStateWithCards('TheBrowncoatWay');
      const details = calculateStartingResources(state);

      expect(details.credits).toBe(12000);
      expect(details.fuel).toBe(0);
      expect(details.isFuelDisabled).toBe(true);
      expect(details.parts).toBe(0);
      expect(details.isPartsDisabled).toBe(true);
    });

    it('handles adding warrants and other resources', () => {
      const story = mockStory([
        { type: 'modifyResource', resource: 'warrants', method: 'add', value: 2, source: { source: 'story', name: 'Wanted' }, description: 'Wanted' },
        { type: 'modifyResource', resource: 'goalTokens', method: 'add', value: 1, source: { source: 'story', name: 'Goals' }, description: 'Goals' },
      ]);
      const state = getGameStateWithCards('Standard', story);
      const details = calculateStartingResources(state, undefined, story);

      expect(details.warrants).toBe(2);
      expect(details.goalTokens).toBe(1);
    });
  });
});