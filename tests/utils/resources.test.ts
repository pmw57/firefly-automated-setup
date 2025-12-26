/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getResourceDetails } from '../../utils/resources';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { GameState } from '../../types/index';
import { getDefaultGameState } from '../../state/reducer';
import { SETUP_CARD_IDS } from '../../data/ids';

describe('utils/resources', () => {
  const baseGameState = getDefaultGameState();

  const getGameStateWithConfig = (
    config: Partial<GameState>
  ): GameState => ({
    ...baseGameState,
    ...config,
  });

  describe('getResourceDetails with Effect System', () => {
    it.concurrent('returns default resources for a standard game', () => {
      const state = getGameStateWithConfig({ setupCardId: SETUP_CARD_IDS.STANDARD });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(3000);
      expect(details.fuel).toBe(6);
      expect(details.parts).toBe(2);
      expect(details.warrants).toBe(0);
      expect(details.isFuelDisabled).toBe(false);
      expect(details.creditModifications[0].description).toBe('Standard Allocation');
    });

    it.concurrent('applies a "set" credits effect from a setup card', () => {
      const state = getGameStateWithConfig({ setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY }); // Sets to $12000
      const details = getResourceDetails(state);
      expect(details.credits).toBe(12000);
      expect(details.creditModifications[0].description).toBe('Setup Card Allocation');
    });

    it.concurrent('applies an "add" credits effect from a story card', () => {
      const state = getGameStateWithConfig({ 
        setupCardId: SETUP_CARD_IDS.STANDARD, 
        selectedStoryCard: "Running On Empty" // Adds $1200
      });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(4200); // 3000 + 1200
      expect(details.creditModifications.length).toBe(2);
      expect(details.creditModifications[1].description).toBe('Story Bonus');
    });
    
    it.concurrent('applies a "set" credits effect from a story card, overriding the base', () => {
      const state = getGameStateWithConfig({ 
        setupCardId: SETUP_CARD_IDS.STANDARD, 
        selectedStoryCard: "How It All Started" // Sets to $500
      });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(500);
      expect(details.creditModifications[0].description).toBe('Story Override');
    });

    it.concurrent('resolves conflict between "set" credit effects by prioritizing the story rule', () => {
      const state = getGameStateWithConfig({
        setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY, // Sets to $12000
        selectedStoryCard: "How It All Started" // Sets to $500
      });
      // FIX: The conflict property is now on the details object, and should be undefined here as manual resolution is off.
      const details = getResourceDetails(state);
      
      expect(details.conflict).toBeUndefined();
      expect(details.credits).toBe(500); // Story wins by default
      expect(details.creditModifications[0].description).toBe('Story Override');
    });

    it.concurrent('applies "disable" effects for fuel and parts from a story', () => {
      const state = getGameStateWithConfig({ 
        setupCardId: SETUP_CARD_IDS.STANDARD,
        selectedStoryCard: "Running On Empty" // Disables fuel and parts
      });
      const details = getResourceDetails(state);

      expect(details.fuel).toBe(0);
      expect(details.isFuelDisabled).toBe(true);
      expect(details.parts).toBe(0);
      expect(details.isPartsDisabled).toBe(true);
    });
    
    it.concurrent('correctly applies effects from TheBrowncoatWay setup card', () => {
      const state = getGameStateWithConfig({ setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY });
      const details = getResourceDetails(state);

      expect(details.credits).toBe(12000);
      expect(details.fuel).toBe(0);
      expect(details.isFuelDisabled).toBe(true);
      expect(details.parts).toBe(0);
      expect(details.isPartsDisabled).toBe(true);
    });

    it.concurrent('handles adding warrants and other resources', () => {
      const state = getGameStateWithConfig({
        setupCardId: SETUP_CARD_IDS.STANDARD,
        selectedStoryCard: "It Ain't Easy Goin' Legit" // Adds 2 warrants
      });
      const details = getResourceDetails(state);

      expect(details.warrants).toBe(2);
      // This story doesn't add goal tokens, so it should be the default
      expect(details.goalTokens).toBe(0);
    });

    it.concurrent('should return a conflict object and respect manual selection when manual resolution is enabled', () => {
      const state: GameState = getGameStateWithConfig({
        setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY, // Sets to $12000
        selectedStoryCard: "How It All Started", // Sets to $500
        optionalRules: { ...baseGameState.optionalRules, resolveConflictsManually: true },
      });

      // 1. Check if the conflict object is correctly generated
      const initialDetails = getResourceDetails(state);
      expect(initialDetails.conflict).toBeDefined();
      expect(initialDetails.conflict?.story.value).toBe(500);
      expect(initialDetails.conflict?.setupCard.value).toBe(12000);

      // 2. Test the outcome when user selects the 'setupCard' option
      const setupCardSelectionDetails = getResourceDetails(state, 'setupCard');
      expect(setupCardSelectionDetails.credits).toBe(12000);

      // 3. Test the outcome when user selects the 'story' option
      const storySelectionDetails = getResourceDetails(state, 'story');
      expect(storySelectionDetails.credits).toBe(500);
    });
  });
});