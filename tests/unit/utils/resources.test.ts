/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getResourceDetails } from '../../../utils/resources';
import { GameState } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { SETUP_CARD_IDS } from '../../../data/ids';
import { STORY_CARDS } from '../../../data/storyCards';

describe('rules/resources', () => {
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
      const storyTitle = "Running On Empty";
      const state = getGameStateWithConfig({ 
        setupCardId: SETUP_CARD_IDS.STANDARD, 
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
      });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(4200); // 3000 + 1200
      expect(details.creditModifications.length).toBe(2);
      expect(details.creditModifications[1].description).toBe('Story Bonus');
    });
    
    it.concurrent('applies a "set" credits effect from a story card, overriding the base', () => {
      const storyTitle = "How It All Started";
      const state = getGameStateWithConfig({ 
        setupCardId: SETUP_CARD_IDS.STANDARD, 
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
      });
      const details = getResourceDetails(state);
      expect(details.credits).toBe(500);
      expect(details.creditModifications[0].description).toBe('Scraping By');
    });

    it.concurrent('resolves conflict between "set" credit effects by prioritizing the story rule', () => {
      const storyTitle = "How It All Started";
      const state = getGameStateWithConfig({
        setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
      });
      const details = getResourceDetails(state);
      
      expect(details.conflict).toBeUndefined();
      expect(details.credits).toBe(500); // Story wins by default
      expect(details.creditModifications[0].description).toBe('Scraping By');
    });

    it.concurrent('applies "disable" effects for fuel and parts from a story', () => {
      const storyTitle = "Running On Empty";
      const state = getGameStateWithConfig({ 
        setupCardId: SETUP_CARD_IDS.STANDARD,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
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
      const storyTitle = "It Ain't Easy Goin' Legit";
      const state = getGameStateWithConfig({
        setupCardId: SETUP_CARD_IDS.STANDARD,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
      });
      const details = getResourceDetails(state);

      expect(details.warrants).toBe(2);
      expect(details.goalTokens).toBe(0);
    });

    it.concurrent('should return a conflict object and respect manual selection when manual resolution is enabled', () => {
      const storyTitle = "How It All Started";
      const state: GameState = getGameStateWithConfig({
        setupCardId: SETUP_CARD_IDS.THE_BROWNCOAT_WAY,
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle),
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

    describe("for Smuggler's Blues", () => {
      const storyTitle = "Smuggler's Blues";
      const storyIndex = STORY_CARDS.findIndex(c => c.title === storyTitle);
  
      it.concurrent('makes variant available when Blue Sun and Kalidasa are active', () => {
          const state: GameState = { 
              ...baseGameState, 
              expansions: { ...baseGameState.expansions, blue: true, kalidasa: true }, 
              selectedStoryCardIndex: storyIndex
          };
          const details = getResourceDetails(state);
          expect(details.smugglersBluesVariantAvailable).toBe(true);
      });
  
      it.concurrent('adds a special rule for standard placement when only Blue Sun is active', () => {
          const state: GameState = { 
              ...baseGameState, 
              expansions: { ...baseGameState.expansions, blue: true, kalidasa: false }, 
              selectedStoryCardIndex: storyIndex
          };
          const details = getResourceDetails(state);
          const specialRules = [...details.infoRules, ...details.overrideRules];
          expect(details.smugglersBluesVariantAvailable).toBe(false);
          const rule = specialRules.find(r => r.title === "A Lucrative Opportunity");
          expect(rule).not.toBeUndefined();
          const contentString = JSON.stringify(rule?.content);
          expect(contentString).toContain("3 Contraband");
          expect(contentString).toContain("Alliance Space");
      });
    });
  });
});