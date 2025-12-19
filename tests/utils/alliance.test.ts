// FIX: Added import for React to resolve 'React' is not defined errors when asserting on React elements.
import React from 'react';
import { describe, it, expect } from 'vitest';
import { calculateAllianceReaverDetails } from '../../utils/alliance';
import { StoryCardDef } from '../../types';
import { getDefaultGameState } from '../../state/reducer';

// Helper to recursively flatten React children to a searchable string
const getTextContent = (content: React.ReactNode): string => {
    return React.Children.toArray(content)
      .map(child => (React.isValidElement(child) ? getTextContent(child.props.children) : child))
      .join('');
};

describe('utils/alliance', () => {
  describe('calculateAllianceReaverDetails', () => {
    const baseGameState = getDefaultGameState();
    const mockStory: StoryCardDef = { title: 'Mock Story', intro: '' };

    it('returns default values for a standard game', () => {
      const details = calculateAllianceReaverDetails(baseGameState, undefined, 'standard');
      expect(details.specialRules).toEqual([]);
      expect(details.alliancePlacement).toContain('Londinium');
      expect(details.reaverPlacement).toContain('3 Cutters'); // Default state has Blue Sun
    });

    it('generates a rule for alertStackCount based on player count and multiplier', () => {
      const storyWithMultiplier: StoryCardDef = {
        ...mockStory,
        setupConfig: { createAlertTokenStackMultiplier: 3 },
      };
      const state = { ...baseGameState, playerCount: 4, selectedStoryCard: storyWithMultiplier.title };
      
      const details = calculateAllianceReaverDetails(state, storyWithMultiplier, 'standard');
      expect(details.specialRules.some(rule => 
        rule.source === 'story' && 
        getTextContent(rule.content).includes('12') // Use helper to search text content
      )).toBe(true);
    });

    it('generates the correct smugglersBluesSetup content based on expansions', () => {
      const storyWithSmugglers: StoryCardDef = {
        ...mockStory,
        setupConfig: { flags: ['smugglersBluesSetup'] },
      };

      // Case 1: Both expansions active
      const stateWithBoth = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: true }, selectedStoryCard: storyWithSmugglers.title };
      const detailsBoth = calculateAllianceReaverDetails(stateWithBoth, storyWithSmugglers, 'standard');
      expect(detailsBoth.specialRules.some(rule => getTextContent(rule.content).includes('Rim Space'))).toBe(true);

      // Case 2: Only one expansion active
      const stateWithOne = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: true, kalidasa: false }, selectedStoryCard: storyWithSmugglers.title };
      const detailsOne = calculateAllianceReaverDetails(stateWithOne, storyWithSmugglers, 'standard');
      expect(detailsOne.specialRules.some(rule => getTextContent(rule.content).includes('Alliance Space'))).toBe(true);
    });

    it('correctly sets reaver placement based on blue sun expansion', () => {
        // With Blue Sun
        const detailsWith = calculateAllianceReaverDetails(baseGameState, mockStory, 'standard');
        expect(detailsWith.reaverPlacement).toContain('3 Cutters');
        
        // Without Blue Sun
        const stateWithoutBlue = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false } };
        const detailsWithout = calculateAllianceReaverDetails(stateWithoutBlue, mockStory, 'standard');
        expect(detailsWithout.reaverPlacement).toContain('1 Cutter');
    });

    it('correctly sets alliance placement based on allianceMode', () => {
        // Standard
        const detailsStandard = calculateAllianceReaverDetails(baseGameState, mockStory, 'standard');
        expect(detailsStandard.alliancePlacement).toContain('Londinium');
        
        // Extra Cruisers
        const detailsExtra = calculateAllianceReaverDetails(baseGameState, mockStory, 'extra_cruisers');
        expect(detailsExtra.alliancePlacement).toContain('Regulus AND Persephone');
    });
  });
});
