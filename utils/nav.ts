
import { 
    GameState, 
    NavDeckSetupDetails,
    StepOverrides,
    SetNavModeRule,
    SpecialRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { mapRuleSourceToBlockSource, processOverrulableRules } from './ruleProcessing';

const getNavModeLabel = (rule: SetNavModeRule): string => {
    switch (rule.mode) {
        case 'standard': return 'Standard Rules';
        case 'standard_reshuffle': return 'Standard (Forced Reshuffle)';
        case 'browncoat': return 'Browncoat Rules (Hard Economy)';
        case 'rim': return 'Rim Space Rules';
        case 'flying_solo': return 'Flying Solo Rules';
        case 'clearer_skies': return 'Clearer Skies Variant';
        case 'disabled': return 'Nav Decks Disabled';
        default: return 'Custom Rules';
    }
};

export const getNavDeckDetails = (gameState: GameState, overrides: StepOverrides): NavDeckSetupDetails => {
    const allRules = getResolvedRules(gameState);

    const navModeRules = allRules.filter((r): r is SetNavModeRule => r.type === 'setNavMode');
    
    // Use helper to resolve priority and identify overruled rules
    const { activeRule, overruledRules: navOverruled } = processOverrulableRules(
        navModeRules,
        getNavModeLabel,
        () => 'Nav Deck Rules'
    );
    
    const navMode = activeRule?.mode || overrides.navMode;
    
    const isDisabled = navMode === 'disabled';
    const forceReshuffle = !isDisabled && ['standard_reshuffle', 'browncoat', 'rim', 'clearer_skies', 'flying_solo'].includes(navMode || '');
    const showStandardRules = !forceReshuffle && !isDisabled;

    const specialRules: SpecialRule[] = [];

    // Process generic special rules for this step category
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule' && rule.category === 'nav') {
            specialRules.push({
                source: mapRuleSourceToBlockSource(rule.source),
                ...rule.rule
            });
        }
    });

    // Add identified overruled rules to the list
    specialRules.push(...navOverruled);

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
        isDisabled,
    };
};
