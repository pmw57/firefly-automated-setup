import { describe, it, expect } from 'vitest';
import { SETUP_CARDS } from '../data/setupCards';
import { STORY_CARDS } from '../data/storyCards';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { SETUP_CONTENT } from '../data/steps';

describe('Data Integrity', () => {
  describe('Setup Cards', () => {
    it('all setup cards have a valid requiredExpansion if set', () => {
      SETUP_CARDS.forEach(setup => {
        if (setup.requiredExpansion) {
          const expansion = EXPANSIONS_METADATA.find(e => e.id === setup.requiredExpansion);
          expect(expansion).toBeDefined();
        }
      });
    });

    it('all steps in setup cards map to valid SETUP_CONTENT', () => {
      SETUP_CARDS.forEach(setup => {
        setup.steps.forEach(step => {
          const content = SETUP_CONTENT[step.id];
          expect(content, `Setup Card "${setup.id}" references missing step "${step.id}"`).toBeDefined();
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
