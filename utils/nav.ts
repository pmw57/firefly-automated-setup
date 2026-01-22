
import { 
    GameState, 
    NavDeckSetupDetails,
    StepOverrides,
    SetNavModeRule,
    SpecialRule,
    RuleSourceType
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { RULE_PRIORITY_ORDER } from '../data/constants';

const mapSource = (source: RuleSourceType): SpecialRule['source'] => {
    if (source === 'challenge') return 'warning';
    if (source === 'combinableSetupCard') return 'setupCard';
    if (source === 'optionalRule') return 'info';
    return source as SpecialRule['source'];
};

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
            specialRules.push({
                source: mapSource(rule.source),
                ...rule.rule
            });
        }
    });

    const infoRules = specialRules.filter(r => r.source === 'info' || r.source === 'warning');
    const overrideRules = specialRules.filter(r => r.source !== 'info' && r.source !== 'warning');

    const hasRimDecks = hasRuleFlag(allRules, 'activatesRimDecks');

    return {
        forceReshuffle,
        clearerSkies: navMode === 'clearer_skies',
        showStandardRules,
        isSolo: gameState.playerCount === 1,
        isHighPlayerCount: gameState.playerCount >= 3,
        infoRules,
        overrideRules,
        hasRimDecks,
    };
};
