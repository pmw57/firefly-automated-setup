import { describe, it, expect } from 'vitest';
import { SCENARIOS, STORY_CARDS, EXPANSIONS_METADATA, SETUP_CONTENT } from '../constants';

describe('Data Integrity', () => {
  describe('Scenarios', () => {
    it('all scenarios have a valid requiredExpansion if set', () => {
      SCENARIOS.forEach(scenario => {
        if (scenario.requiredExpansion) {
          const expansion = EXPANSIONS_METADATA.find(e => e.id === scenario.requiredExpansion);
          expect(expansion).toBeDefined();
        }
      });
    });

    it('all steps in scenarios map to valid SETUP_CONTENT', () => {
      SCENARIOS.forEach(scenario => {
        scenario.steps.forEach(step => {
          const content = SETUP_CONTENT[step.id];
          expect(content, `Scenario "${scenario.id}" references missing step "${step.id}"`).toBeDefined();
        });
      });
    });
  });

  describe('Story Cards', () => {
    it('all story cards have valid expansion requirements', () => {
      STORY_CARDS.forEach(card => {
        if (card.requiredExpansion) {
          const expansion = EXPANSIONS_METADATA.find(e => e.id === card.requiredExpansion);
          expect(expansion, `Story "${card.title}" references invalid expansion "${card.requiredExpansion}"`).toBeDefined();
        }
        if (card.additionalRequirements) {
          card.additionalRequirements.forEach(req => {
            const expansion = EXPANSIONS_METADATA.find(e => e.id === req);
            expect(expansion, `Story "${card.title}" references invalid additional expansion "${req}"`).toBeDefined();
          });
        }
      });
    });

    it('unique titles', () => {
        const titles = STORY_CARDS.map(c => c.title);
        const unique = new Set(titles);
        expect(unique.size).toBe(titles.length);
    });
  });
});
