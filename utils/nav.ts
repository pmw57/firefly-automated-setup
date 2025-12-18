import { GameState, StepOverrides } from '../types';

export const determineNavDeckDetails = (gameState: GameState, overrides: StepOverrides) => {
    const { browncoatNavMode, rimNavMode, forceReshuffle: forceReshuffleOverride, clearerSkiesNavMode, flyingSoloNavMode } = overrides;

    const forceReshuffle = !!browncoatNavMode || !!rimNavMode || !!forceReshuffleOverride || !!flyingSoloNavMode;
    const showStandardRules = !forceReshuffle;

    return {
        forceReshuffle,
        clearerSkies: !!clearerSkiesNavMode,
        showStandardRules,
        isSolo: gameState.playerCount === 1,
        isHighPlayerCount: gameState.playerCount >= 3,
    };
};
