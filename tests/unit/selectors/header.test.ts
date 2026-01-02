/** @vitest-environment node */
import { describe, it, expect } from 'vitest';
import { getHeaderDetails } from '../../../utils/header';
import { GameState, Step } from '../../../types';
import { getDefaultGameState } from '../../../state/reducer';
import { STEP_IDS, SETUP_CARD_IDS } from '../../../data/ids';
import { getSetupCardById } from '../../../utils/selectors/story';
import { STORY_CARDS } from '../../../data/storyCards';

describe('selectors/header', () => {
    const baseGameState = getDefaultGameState();
    const mockFlow: Step[] = [
        { type: 'setup', id: STEP_IDS.SETUP_CAPTAIN_EXPANSIONS },
        { type: 'setup', id: STEP_IDS.SETUP_CARD_SELECTION },
        { type: 'core', id: STEP_IDS.C1 },
        { type: 'core', id: STEP_IDS.C2 },
    ];

    it.concurrent('shows "Configuring..." before a non-standard setup card is selected', () => {
        const details = getHeaderDetails(baseGameState, mockFlow, 0);
        expect(details.setupName).toBe('Configuring...');
    });

    it.concurrent('shows the setup card name once selected', () => {
        const browncoatDef = getSetupCardById(SETUP_CARD_IDS.THE_BROWNCOAT_WAY)!;
        const state: GameState = { ...baseGameState, setupCardId: browncoatDef.id, setupCardName: browncoatDef.label };
        const details = getHeaderDetails(state, mockFlow, 1);
        expect(details.setupName).toBe(browncoatDef.label);
    });

    it.concurrent('shows the story name once selected', () => {
        const details1 = getHeaderDetails(baseGameState, mockFlow, 1);
        expect(details1.storyName).toBeNull();

        const storyIndex = STORY_CARDS.findIndex(c => c.title === "Harken's Folly");
        const state: GameState = { ...baseGameState, selectedStoryCardIndex: storyIndex };
        const details2 = getHeaderDetails(state, mockFlow, 1);
        expect(details2.storyName).toBe("Harken's Folly");
    });

    it.concurrent('does not show solo mode indicator before core steps begin', () => {
        const state: GameState = { ...baseGameState, gameMode: 'solo' };
        const details = getHeaderDetails(state, mockFlow, 1); // Step 1 is before core steps
        expect(details.soloMode).toBeNull();
    });

    it.concurrent('shows "Classic" solo mode indicator after core steps begin', () => {
        const state: GameState = { ...baseGameState, gameMode: 'solo' };
        const details = getHeaderDetails(state, mockFlow, 2); // Step 2 is a core step
        expect(details.soloMode).toBe('Classic');
    });
    
    it.concurrent('shows "Expanded" solo mode indicator for Flying Solo after core steps begin', () => {
        const state: GameState = { ...baseGameState, gameMode: 'solo', setupCardId: SETUP_CARD_IDS.FLYING_SOLO };
        const details = getHeaderDetails(state, mockFlow, 2);
        expect(details.soloMode).toBe('Expanded');
    });
    
    it.concurrent('does not show solo mode indicator in multiplayer', () => {
        const state: GameState = { ...baseGameState, gameMode: 'multiplayer' };
        const details = getHeaderDetails(state, mockFlow, 2);
        expect(details.soloMode).toBeNull();
    });
});