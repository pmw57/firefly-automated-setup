import { GameState, Step, HeaderDetails } from '../../types';
import { getDisplaySetupName } from '../ui';
import { SETUP_CARD_IDS } from '../../data/ids';
import { getSetupCardById } from './story';

/**
 * Consolidates all presentation logic for the main wizard header.
 * It determines exactly what text should be displayed based on the current
 * game state and progress through the setup flow.
 *
 * @param gameState The current state of the game setup.
 * @param flow The calculated array of steps for the current setup.
 * @param currentStepIndex The user's current position in the flow.
 * @returns A HeaderDetails object containing the final strings to display.
 */
export const getHeaderDetails = (
    gameState: GameState,
    flow: Step[],
    currentStepIndex: number
): HeaderDetails => {
    const firstCoreStepIndex = flow.findIndex(step => step.type === 'core');
    const isPastFirstStep = firstCoreStepIndex !== -1 && currentStepIndex >= firstCoreStepIndex;

    const secondaryCard = gameState.secondarySetupId ? getSetupCardById(gameState.secondarySetupId) : undefined;
    const setupName = gameState.setupCardName ? getDisplaySetupName(gameState, secondaryCard) : 'Configuring...';
    
    const storyName = gameState.selectedStoryCard ? gameState.selectedStoryCard : null;

    let soloMode: 'Expanded' | 'Classic' | null = null;
    if (gameState.gameMode === 'solo' && isPastFirstStep) {
        soloMode = gameState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO ? 'Expanded' : 'Classic';
    }
    
    return {
        setupName,
        storyName,
        soloMode
    };
};