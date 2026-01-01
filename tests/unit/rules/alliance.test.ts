/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getAllianceReaverDetails } from '../../../utils/alliance';
import { StructuredContent, StructuredContentPart } from '../../../types/index';
import { getDefaultGameState } from '../../../state/reducer';
import { STORY_CARDS } from '../../../data/storyCards';

const getStoryTitle = (title: string): string => {
  const card = STORY_CARDS.find(c => c.title === title);
  if (!card) throw new Error(`Test data missing: Could not find story card "${title}"`);
  return card.title;
};

// Helper to recursively flatten structured content to a searchable string
const getTextContent = (content: StructuredContent | StructuredContentPart): string => {
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content.map(part => getTextContent(part)).join('');
    }
    if (!content) return '';

    switch(content.type) {
        case 'strong':
        case 'action':
        case 'paragraph':
        case 'warning-box':
            return getTextContent(content.content as StructuredContent);
        case 'list':
        case 'numbered-list':
            return content.items.map(item => getTextContent(item)).join(' ');
        case 'sub-list':
            return content.items.map(item => item.ship).join(' ');
        case 'br':
            return ' ';
        default:
            return '';
    }
};

describe('rules/alliance', () => {
  describe('getAllianceReaverDetails', () => {
    const baseGameState = getDefaultGameState();

    it.concurrent('returns default values for a standard game', () => {
      const details = getAllianceReaverDetails(baseGameState, {});
      expect(details.specialRules).toEqual([]);
      expect(details.alliancePlacement).toContain('Londinium');
      expect(details.reaverPlacement).toContain('3 Cutters'); // Default state has Blue Sun
    });

    it.concurrent('generates a rule for alertStackCount based on player count and multiplier', () => {
      const storyTitle = "It's All In Who You Know";
      const state = { 
        ...baseGameState, 
        playerCount: 4, 
        // FIX: Updated test state setup to use `selectedStoryCardIndex` with the story card's index instead of `selectedStoryCard` with its title, correcting the property access to match the `GameState` type.
        selectedStoryCardIndex: STORY_CARDS.findIndex(c => c.title === storyTitle)
      };
      
      const details = getAllianceReaverDetails(state, {});
      expect(details.specialRules.some(rule => 
        rule.source === 'story' && 
        getTextContent(rule.content).includes('12') // 4 players * 3 = 12
      )).toBe(true);
    });

    it.concurrent('generates the correct smugglersBluesSetup content based on expansions', () => {
      const storyTitle = getStoryTitle("Smuggler's Blues");
      const storyIndex = STORY_CARDS.findIndex(c => c.title === storyTitle);
      // Case 1: Both expansions active
      const stateWithBoth = { 
        ...baseGameState, 
        expansions: { ...baseGameState.expansions, blue: true, kalidasa: true }, 
        selectedStoryCardIndex: storyIndex
      };
      const detailsBoth = getAllianceReaverDetails(stateWithBoth, {});
      expect(detailsBoth.specialRules.some(rule => getTextContent(rule.content).includes('Rim Space'))).toBe(true);

      // Case 2: Only one expansion active
      const stateWithOne = { 
        ...baseGameState, 
        expansions: { ...baseGameState.expansions, blue: true, kalidasa: false }, 
        selectedStoryCardIndex: storyIndex
      };
      const detailsOne = getAllianceReaverDetails(stateWithOne, {});
      expect(detailsOne.specialRules.some(rule => getTextContent(rule.content).includes('Alliance Space'))).toBe(true);
    });

    it.concurrent('correctly sets reaver placement based on blue sun expansion', () => {
        // With Blue Sun
        const detailsWith = getAllianceReaverDetails(baseGameState, {});
        expect(detailsWith.reaverPlacement).toContain('3 Cutters');
        
        // Without Blue Sun
        const stateWithoutBlue = { ...baseGameState, expansions: { ...baseGameState.expansions, blue: false } };
        const detailsWithout = getAllianceReaverDetails(stateWithoutBlue, {});
        expect(detailsWithout.reaverPlacement).toContain('1 Cutter');
    });

    it.concurrent('correctly sets alliance placement based on allianceMode', () => {
        // Standard
        const detailsStandard = getAllianceReaverDetails(baseGameState, {});
        expect(detailsStandard.alliancePlacement).toContain('Londinium');
        
        // Extra Cruisers
        const detailsExtra = getAllianceReaverDetails(baseGameState, { allianceMode: 'extra_cruisers' });
        expect(detailsExtra.alliancePlacement).toContain('Regulus AND Persephone');
    });
  });
});
