import { STORY_CARDS } from '../data/storyCards';
import { SETUP_CARDS } from '../data/setupCards';
import { isStoryCompatible } from './filters';
import { getDefaultGameState } from '../state/reducer';
import { GameState } from '../types';

// Helper to escape CSV fields
const escapeCsvField = (field: string | number): string => {
    const stringField = String(field);
    // If the field contains a comma, double quote, or newline, wrap it in double quotes.
    // Also, double up any existing double quotes.
    if (/[",\n\r]/.test(stringField)) {
        return `"${stringField.replace(/"/g, '""')}"`;
    }
    return stringField;
};

export const generateTestingMatrixCsv = (): string => {
    // Header row
    const header = [
        "Setup Card",
        "Story Card",
        "Compatibility",
        "Test Status",
        "Notes"
    ].map(escapeCsvField).join(',');
    
    let csv = `${header}\n`;

    // Create a base game state with all expansions enabled for maximum compatibility check
    const allExpansionsState = getDefaultGameState();
    for (const key in allExpansionsState.expansions) {
        allExpansionsState.expansions[key as keyof typeof allExpansionsState.expansions] = true;
    }

    // Iterate through every combination
    SETUP_CARDS.forEach(setupCard => {
        STORY_CARDS.forEach(storyCard => {
            const baseStateForSetup: GameState = {
                ...allExpansionsState,
                setupCardId: setupCard.id,
            };

            // Adjust game mode for solo-only setup cards
            if (setupCard.mode === 'solo') {
                baseStateForSetup.gameMode = 'solo';
                baseStateForSetup.playerCount = 1;
            } else {
                baseStateForSetup.gameMode = 'multiplayer';
                baseStateForSetup.playerCount = 2; // Use 2 for multiplayer checks
            }

            const compatible = isStoryCompatible(storyCard, baseStateForSetup);

            const row = [
                escapeCsvField(setupCard.label),
                escapeCsvField(storyCard.title),
                compatible ? 1 : 0,
                "", // Empty field for Test Status
                ""  // Empty field for Notes
            ].join(',');
            
            csv += `${row}\n`;
        });
    });

    return csv;
};