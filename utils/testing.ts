import { STORY_CARDS } from '../data/storyCards';
import { SETUP_CARDS } from '../data/setupCards';
import { isStoryCompatible } from './filters';
import { getDefaultGameState } from '../state/reducer';
import { GameState } from '../types';
import { SETUP_CARD_IDS } from '../data/ids';

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

export const generateTestingMatrixCsv = (options: { excludeNoSetupDescription: boolean }): string => {
    // Header row
    const header = [
        "Setup Card",
        "Story Card",
        "Test Status",
        "Notes"
    ].map(escapeCsvField).join(',');
    
    let csv = `${header}\n`;

    // Create a base game state with all expansions enabled for maximum compatibility check
    const allExpansionsState = getDefaultGameState();
    for (const key in allExpansionsState.expansions) {
        allExpansionsState.expansions[key as keyof typeof allExpansionsState.expansions] = true;
    }
    
    // Ensure all community content ratings are enabled so they aren't filtered out by default settings
    for (const key in allExpansionsState.storyRatingFilters) {
        allExpansionsState.storyRatingFilters[Number(key)] = true;
    }

    // Iterate through every combination
    SETUP_CARDS.forEach(setupCard => {
        STORY_CARDS.forEach(storyCard => {
            // Filter 1: Optional exclusion of stories with no setup description
            if (options.excludeNoSetupDescription && !storyCard.setupDescription) {
                return; // Equivalent to 'continue' in a forEach loop
            }

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

            // Filter 2: Only include compatible combinations
            const compatible = isStoryCompatible(storyCard, baseStateForSetup);
            if (!compatible) {
                return; // Equivalent to 'continue' in a forEach loop
            }

            const row = [
                escapeCsvField(setupCard.label),
                escapeCsvField(storyCard.title),
                "", // Empty field for Test Status
                ""  // Empty field for Notes
            ].join(',');
            
            csv += `${row}\n`;
        });
    });

    return csv;
};

interface CoverageConfig {
    name: string;
    state: GameState;
}

export const generateCoverageReport = (): string => {
    // Base state with ALL expansions enabled and ALL ratings allowed
    const baseState = getDefaultGameState();
    for (const key in baseState.expansions) {
        baseState.expansions[key as keyof typeof baseState.expansions] = true;
    }
    for (const key in baseState.storyRatingFilters) {
        baseState.storyRatingFilters[Number(key)] = true;
    }

    // Define the minimal set of configurations to cover all stories
    const configurations: CoverageConfig[] = [
        {
            name: "1. Solitaire Campaign",
            state: { ...baseState, gameMode: 'solo', playerCount: 1, setupCardId: SETUP_CARD_IDS.SOLITAIRE_FIREFLY }
        },
        {
            name: "2. Flying Solo (10th Anniversary)",
            state: { ...baseState, gameMode: 'solo', playerCount: 1, setupCardId: SETUP_CARD_IDS.FLYING_SOLO }
        },
        {
            name: "3. 2-Player Duel (PvP)",
            state: { ...baseState, gameMode: 'multiplayer', playerCount: 2, setupCardId: SETUP_CARD_IDS.STANDARD }
        },
        {
            name: "4. Standard Multiplayer (4-Player)",
            state: { ...baseState, gameMode: 'multiplayer', playerCount: 4, setupCardId: SETUP_CARD_IDS.STANDARD }
        }
    ];

    let output = "MINIMAL CONFIGURATION COVERAGE REPORT\n";
    output += "=====================================\n\n";

    const coveredStories = new Set<string>();

    configurations.forEach(config => {
        const storiesInThisConfig: string[] = [];

        STORY_CARDS.forEach(story => {
            if (coveredStories.has(story.title)) return;

            if (isStoryCompatible(story, config.state)) {
                storiesInThisConfig.push(story.title);
                coveredStories.add(story.title);
            }
        });

        if (storiesInThisConfig.length > 0) {
            output += `CONFIGURATION: ${config.name}\n`;
            output += `-------------------------------------\n`;
            storiesInThisConfig.sort().forEach(title => {
                output += `[ ] ${title}\n`;
            });
            output += `\nTotal: ${storiesInThisConfig.length}\n\n`;
        }
    });

    // Check for any missed stories
    const missedStories = STORY_CARDS.filter(s => !coveredStories.has(s.title));
    
    if (missedStories.length > 0) {
        output += "⚠️ MISSED STORIES (Review Logic)\n";
        output += "-------------------------------------\n";
        missedStories.forEach(s => {
             output += `[ ] ${s.title}\n`;
        });
    } else {
        output += "✅ 100% Story Coverage Achieved";
    }

    return output;
};
