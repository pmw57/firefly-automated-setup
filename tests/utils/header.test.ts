import { describe, it, expect } from 'vitest';
// FIX: Update import to point to the refactored selector function.
import { getHeaderDetails } from '../../utils/selectors';
import { GameState, Step } from '../../types';
import { getDefaultGameState } from '../../state/reducer';
import { STEP_IDS, SETUP_CARD_IDS } from '../../data/ids';

describe('utils/header', () => {
    const baseGameState = getDefaultGameState();
    const mockFlow: Step[] = [
        { type: 'setup', id: STEP_IDS.SETUP_CAPTAIN_EXPANSIONS },
        { type: 'setup', id: STEP_IDS.SETUP_CARD_SELECTION },
        { type: 'core', id: STEP_IDS.CORE_NAV_DECKS },
        { type: 'core', id: STEP_IDS.CORE_ALLIANCE_REAVER },
    ];

    it('shows "Configuring..." before a non-standard setup card is selected', () => {
        // FIX: Update function name to match new selector.
        const details = getHeaderDetails(baseGameState, mockFlow, 0);
        expect(details.setupName).toBe('Configuring...');
    });

    it('shows the setup card name once selected', () => {
        const state: GameState = { ...baseGameState, setupCardId: 'TheBrowncoatWay', setupCardName: 'The Browncoat Way' };
        // FIX: Update function name to match new selector.
        const details = getHeaderDetails(state, mockFlow, 1);
        expect(details.setupName).toBe('The Browncoat Way');
    });

    it('shows the story name once selected', () => {
        // FIX: Update function name to match new selector.
        const details1 = getHeaderDetails(baseGameState, mockFlow, 1);
        expect(details1.storyName).toBeNull();

        const state: GameState = { ...baseGameState, selectedStoryCard: 'My Story' };
        // FIX: Update function name to match new selector.
        const details2 = getHeaderDetails(state, mockFlow, 1);
        expect(details2.storyName).toBe('My Story');
    });

    it('does not show solo mode indicator before core steps begin', () => {
        const state: GameState = { ...baseGameState, gameMode: 'solo' };
        // FIX: Update function name to match new selector.
        const details = getHeaderDetails(state, mockFlow, 1); // Step 1 is before core steps
        expect(details.soloMode).toBeNull();
    });

    it('shows "Classic" solo mode indicator after core steps begin', () => {
        const state: GameState = { ...baseGameState, gameMode: 'solo' };
        // FIX: Update function name to match new selector.
        const details = getHeaderDetails(state, mockFlow, 2); // Step 2 is a core step
        expect(details.soloMode).toBe('Classic');
    });
    
    it('shows "Expanded" solo mode indicator for Flying Solo after core steps begin', () => {
        const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
        // FIX: Update function name to match new selector.
        const details = getHeaderDetails(state, mockFlow, 2);
        expect(details.soloMode).toBe('Expanded');
    });
    
    it('does not show solo mode indicator in multiplayer', () => {
        const state: GameState = { ...baseGameState, gameMode: 'multiplayer' };
        // FIX: Update function name to match new selector.
        const details = getHeaderDetails(state, mockFlow, 2);
        expect(details.soloMode).toBeNull();
    });
});
