import { 
    GameState, 
    NavDeckSetupDetails,
    StepOverrides,
    SetNavModeRule,
    SpecialRule
} from '../types';
import { getResolvedRules } from './selectors/rules';

export const getNavDeckDetails = (gameState: GameState, overrides: StepOverrides): NavDeckSetupDetails => {
    const allRules = getResolvedRules(gameState);
    const navModeRule = allRules.find(r => r.type === 'setNavMode') as SetNavModeRule | undefined;
    const navMode = navModeRule?.mode || overrides.navMode;
    
    const forceReshuffle = ['standard_reshuffle', 'browncoat', 'rim', 'flying_solo', 'clearer_skies'].includes(navMode || '');
    const showStandardRules = !forceReshuffle;

    const specialRules: SpecialRule[] = [];

    // Process generic special rules for this step category
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule' && rule.category === 'nav') {
            if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
                specialRules.push({
                    source: rule.source as SpecialRule['source'],
                    ...rule.rule
                });
            }
        }
    });

    return {
        forceReshuffle,
        clearerSkies: navMode === 'clearer_skies',
        showStandardRules,
        isSolo: gameState.playerCount === 1,
        isHighPlayerCount: gameState.playerCount >= 3,
        specialRules,
    };
};