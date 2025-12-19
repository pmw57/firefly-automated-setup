import { describe, it, expect } from 'vitest';
import { getResourceDetails } from '../../utils/selectors';
import { GameState } from '../../types';
import { getDefaultGameState } from '../../state/reducer';

describe('utils/resources', () => {
  const baseGameState = getDefaultGameState();

  const getGameStateWithConfig = (
    config: Partial<GameState>
  ): GameState => ({
    ...baseGameState,
    ...config,
  });

  describe('getResourceDetails with Effect System', () => {
    it('returns default resources for a standard game', () => {
      const state = getGameStateWithConfig({ setupCardId: 'Standard' });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(3000);
      expect(details.fuel).toBe(6);
      expect(details.parts).toBe(2);
      expect(details.warrants).toBe(0);
      expect(details.isFuelDisabled).toBe(false);
      expect(details.creditModifications[0].description).toBe('Standard Allocation');
    });

    it('applies a "set" credits effect from a setup card', () => {
      const state = getGameStateWithConfig({ setupCardId: 'TheBrowncoatWay' }); // Sets to $12000
      const details = getResourceDetails(state);
      expect(details.credits).toBe(12000);
      expect(details.creditModifications[0].description).toBe('Setup Card Allocation');
    });

    it('applies an "add" credits effect from a story card', () => {
      const state = getGameStateWithConfig({ 
        setupCardId: 'Standard', 
        selectedStoryCard: 'Running On Empty' // Adds $1200
      });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(4200); // 3000 + 1200
      expect(details.creditModifications.length).toBe(2);
      expect(details.creditModifications[1].description).toBe('Story Bonus');
    });
    
    it('applies a "set" credits effect from a story card, overriding the base', () => {
      const state = getGameStateWithConfig({ 
        setupCardId: 'Standard', 
        selectedStoryCard: 'How It All Started' // Sets to $500
      });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(500);
      expect(details.creditModifications[0].description).toBe('Story Override');
    });

    it('identifies a conflict between "set" credit effects and defaults to story priority', () => {
      const state = getGameStateWithConfig({
        setupCardId: 'TheBrowncoatWay', // Sets to $12000
        selectedStoryCard: 'How It All Started' // Sets to $500
      });
      const details = getResourceDetails(state);
      
      expect(details.conflict).toBeDefined();
      expect(details.conflict?.story.value).toBe(500);
      expect(details.conflict?.setupCard.value).toBe(12000);
      expect(details.credits).toBe(500); // Story wins by default
    });
    
    it('respects manual selection for setup card priority in a conflict', () => {
      const state = getGameStateWithConfig({
        setupCardId: 'TheBrowncoatWay', // Sets to $12000
        selectedStoryCard: 'How It All Started', // Sets to $500
        optionalRules: { ...baseGameState.optionalRules, resolveConflictsManually: true },
      });
      const details = getResourceDetails(state, 'setupCard'); // User selects setup card
      
      expect(details.conflict).toBeDefined();
      expect(details.credits).toBe(12000); // Setup card wins
    });

    it('applies "disable" effects for fuel and parts from a story', () => {
      const state = getGameStateWithConfig({ 
        setupCardId: 'Standard',
        selectedStoryCard: 'Running On Empty' // Disables fuel and parts
      });
      const details = getResourceDetails(state);

      expect(details.fuel).toBe(0);
      expect(details.isFuelDisabled).toBe(true);
      expect(details.parts).toBe(0);
      expect(details.isPartsDisabled).toBe(true);
    });
    
    it('correctly applies effects from TheBrowncoatWay setup card', () => {
      const state = getGameStateWithConfig({ setupCardId: 'TheBrowncoatWay' });
      const details = getResourceDetails(state);

      expect(details.credits).toBe(12000);
      expect(details.fuel).toBe(0);
      expect(details.isFuelDisabled).toBe(true);
      expect(details.parts).toBe(0);
      expect(details.isPartsDisabled).toBe(true);
    });

    it('handles adding warrants and other resources', () => {
      const state = getGameStateWithConfig({
        setupCardId: 'Standard',
        selectedStoryCard: "It Ain't Easy Goin' Legit" // Adds 2 warrants
      });
      const details = getResourceDetails(state);

      expect(details.warrants).toBe(2);
      // This story doesn't add goal tokens, so it should be the default
      expect(details.goalTokens).toBe(0);
    });
  });
});