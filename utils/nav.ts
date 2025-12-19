import { GameState, StepOverrides } from '../types';

export const determineNavDeckDetails = (gameState: GameState, overrides: StepOverrides) => {
    const { navMode, forceReshuffle: forceReshuffleOverride } = overrides;

    const forceReshuffle = !!forceReshuffleOverride || 
        navMode === 'browncoat' || 
        navMode === 'rim' || 
        navMode === 'flying_solo' ||
        navMode === 'clearer_skies';
        
    const showStandardRules = !forceReshuffle;

    return {
        forceReshuffle,
        clearerSkies: navMode === 'clearer_skies',
        showStandardRules,
        isSolo: gameState.playerCount === 1,
        isHighPlayerCount: gameState.playerCount >= 3,
    };
};
