import React from 'react';
import { describe, it, expect } from 'vitest';
import { calculateDraftDetails } from '../../utils/draftRules';
import { GameState, Step } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { STEP_IDS, STORY_TITLES, CHALLENGE_IDS } from '../../data/ids';

// Helper to recursively flatten React children to a searchable string
const getTextContent = (content: React.ReactNode): string => {
    return React.Children.toArray(content)
      .map(child => (React.isValidElement(child) ? getTextContent(child.props.children) : child))
      .join('');
};

describe('utils/draftRules', () => {
    const baseStep: Step = { type: 'core', id: STEP_IDS.CORE_DRAFT };
    const baseGameState = getDefaultGameState();

    it('returns empty special rules for a standard game', () => {
        const details = calculateDraftDetails(baseGameState, baseStep);
        expect(details.specialRules).toEqual([]);
        expect(details.isHavenDraft).toBe(false);
        expect(details.specialStartSector).toBeNull();
    });

    it('identifies Haven Draft mode', () => {
        const step: Step = { ...baseStep, id: STEP_IDS.D_HAVEN_DRAFT };
        const details = calculateDraftDetails(baseGameState, step);
        expect(details.isHavenDraft).toBe(true);
        expect(details.specialRules.some(r => getTextContent(r.title).includes('Placement Rules'))).toBe(true);
    });
    
    it('generates a rule for Wanted Leader mode', () => {
        const step: Step = { ...baseStep, overrides: { leaderSetup: 'wanted' } };
        const details = calculateDraftDetails(baseGameState, step);
        const rule = details.specialRules.find(r => r.title === 'The Heat Is On');
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('each Leader begins play with a Wanted token');
    });

    it('generates a rule for Optional Ship Upgrades', () => {
        const state: GameState = { ...baseGameState, optionalRules: { ...baseGameState.optionalRules, optionalShipUpgrades: true } };
        const details = calculateDraftDetails(state, baseStep);
        const rule = details.specialRules.find(r => r.title === 'Optional Ship Upgrades');
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('Bonanza');
    });
    
    it('generates a rule for Racing a Pale Horse', () => {
        const state: GameState = { ...baseGameState, selectedStoryCard: STORY_TITLES.RACING_A_PALE_HORSE };
        const details = calculateDraftDetails(state, baseStep);
        const rule = details.specialRules.find(r => r.title === 'Story Setup: Haven');
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('Place your Haven at Deadwood');
    });

    it('generates a rule for Heroes & Misfits custom setup', () => {
        const state: GameState = { 
            ...baseGameState, 
            selectedStoryCard: STORY_TITLES.HEROES_AND_MISFITS,
            challengeOptions: { [CHALLENGE_IDS.HEROES_CUSTOM_SETUP]: true }
        };
        const details = calculateDraftDetails(state, baseStep);
        const rule = details.specialRules.find(r => r.title === 'Heroes & Misfits: Further Adventures');
        expect(rule).toBeDefined();
        expect(getTextContent(rule?.content)).toContain('Custom Setup Active');
    });

    it('resolves conflict between Haven Draft and special start sector (Story Priority)', () => {
        const state: GameState = { ...baseGameState, selectedStoryCard: 'It\'s a Mad, Mad, Mad, Mad \'Verse!' }; // This story forces Persephone start
        const step: Step = { ...baseStep, id: STEP_IDS.D_HAVEN_DRAFT }; // This is Haven Draft
        const details = calculateDraftDetails(state, step);
        
        expect(details.isHavenDraft).toBe(false); // Overridden
        expect(details.specialStartSector).toBe('Persephone');
        expect(details.specialRules.some(r => r.title === 'Conflict Resolved')).toBe(true);
    });
});
