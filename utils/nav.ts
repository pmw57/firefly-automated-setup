import { 
    GameState, 
    NavDeckSetupDetails,
    StepOverrides
} from '../types';

export const getNavDeckDetails = (gameState: GameState, overrides: StepOverrides): NavDeckSetupDetails => {
    const { navMode } = overrides;
    const forceReshuffle = ['standard_reshuffle', 'browncoat', 'rim', 'flying_solo', 'clearer_skies'].includes(navMode || '');
    const showStandardRules = !forceReshuffle;

    return {
        forceReshuffle,
        clearerSkies: navMode === 'clearer_skies',
        showStandardRules,
        isSolo: gameState.playerCount === 1,
        isHighPlayerCount: gameState.playerCount >= 3,
        specialRules: [],
    };
};