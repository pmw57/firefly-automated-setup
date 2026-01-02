import { 
    GameState, 
    NavDeckSetupDetails,
    StepOverrides,
    SetNavModeRule
} from '../types';
import { getResolvedRules } from './selectors/rules';

export const getNavDeckDetails = (gameState: GameState, overrides: StepOverrides): NavDeckSetupDetails => {
    const allRules = getResolvedRules(gameState);
    const navModeRule = allRules.find(r => r.type === 'setNavMode') as SetNavModeRule | undefined;
    const navMode = navModeRule?.mode || overrides.navMode;
    
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