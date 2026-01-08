import { 
    GameState, 
    NavDeckSetupDetails,
    StepOverrides,
    SetNavModeRule,
    SpecialRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { RULE_PRIORITY_ORDER } from '../data/constants';

export const getNavDeckDetails = (gameState: GameState, overrides: StepOverrides): NavDeckSetupDetails => {
    const allRules = getResolvedRules(gameState);

    // Find all nav mode rules and sort them by priority
    const navModeRules = allRules.filter(
        (r): r is SetNavModeRule => r.type === 'setNavMode'
    );
    
    if (navModeRules.length > 1) {
        navModeRules.sort((a, b) => RULE_PRIORITY_ORDER.indexOf(a.source) - RULE_PRIORITY_ORDER.indexOf(b.source));
    }
    
    // The highest priority rule is the first one in the sorted list
    const navModeRule = navModeRules[0];
    const navMode = navModeRule?.mode || overrides.navMode;
    
    const forceReshuffle = ['standard_reshuffle', 'browncoat', 'rim', 'clearer_skies', 'flying_solo'].includes(navMode || '');
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

    if (navMode === 'browncoat') {
        specialRules.push({
            source: 'setupCard',
            title: 'Forced Reshuffle',
            page: 22,
            manual: 'Core',
            content: ["Place the 'RESHUFFLE' cards in their Nav Decks."],
        });
    }
    
    const hasRimDecks = hasRuleFlag(allRules, 'activatesRimDecks');

    return {
        forceReshuffle,
        clearerSkies: navMode === 'clearer_skies',
        showStandardRules,
        isSolo: gameState.playerCount === 1,
        isHighPlayerCount: gameState.playerCount >= 3,
        specialRules,
        hasRimDecks,
    };
};