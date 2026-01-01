// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { 
    GameState, 
    Step,
    DraftRuleDetails,
    SpecialRule,
    StructuredContent,
    SetShipPlacementRule,
    SetDraftModeRule,
    SetLeaderSetupRule,
    ThemeColor
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { CHALLENGE_IDS, STEP_IDS } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';

export const getDraftDetails = (gameState: GameState, step: Step): DraftRuleDetails => {
    const specialRules: SpecialRule[] = [];
    const { overrides = {} } = step;
    const allRules = getResolvedRules(gameState);
    const activeStoryCard = getActiveStoryCard(gameState);

    // Process generic special rules for this step category
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule' && rule.category === 'draft') {
            if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
                specialRules.push({
                    source: rule.source as SpecialRule['source'],
                    ...rule.rule
                });
            }
        }
    });

    const isHavenDraft = step.id.includes(STEP_IDS.D_HAVEN_DRAFT);
    const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
    const isHeroesAndMisfits = hasRuleFlag(allRules, 'isHeroesAndMisfits');

    const shipPlacementRule = allRules.find(r => r.type === 'setShipPlacement') as (SetShipPlacementRule | undefined);
    
    let specialStartSector: string | null = null;
    if (shipPlacementRule) {
      if (shipPlacementRule.location === 'persephone' && !isHeroesCustomSetup) specialStartSector = 'Persephone';
      if (shipPlacementRule.location === 'londinium') specialStartSector = 'Londinium';
      if (shipPlacementRule.location === 'border_of_murphy') specialStartSector = 'Border of Murphy';
    }

    const startOutsideAllianceSpace = shipPlacementRule?.location === 'outside_alliance';

    const allianceSpaceOffLimits = hasRuleFlag(allRules, 'allianceSpaceOffLimits');
    const addBorderHavens = hasRuleFlag(allRules, 'addBorderHavens');
    
    const draftModeRule = allRules.find(r => r.type === 'setDraftMode') as SetDraftModeRule | undefined;
    const isBrowncoatDraft = draftModeRule?.mode === 'browncoat' || overrides.draftMode === 'browncoat';

    const leaderSetupRule = allRules.find(r => r.type === 'setLeaderSetup') as SetLeaderSetupRule | undefined;
    const isWantedLeaderMode = leaderSetupRule?.mode === 'wanted' || overrides.leaderSetup === 'wanted';
    
    const showBrowncoatHeroesWarning = isBrowncoatDraft && isHeroesAndMisfits && isHeroesCustomSetup;
    
    let resolvedHavenDraft = isHavenDraft;
    let conflictMessage: StructuredContent | null = null;
  
    if (isHavenDraft && specialStartSector) {
        resolvedHavenDraft = false;
        conflictMessage = [{ type: 'strong', content: 'Story Priority:' }, ` Ships start at `, { type: 'strong', content: specialStartSector }, `, overriding Haven placement rules.`];
    }
    
    if (conflictMessage) specialRules.push({ source: 'info', title: 'Conflict Resolved', content: conflictMessage });
    if (isWantedLeaderMode) specialRules.push({ source: 'setupCard', title: 'The Heat Is On', content: ['Choose Ships & Leaders normally, but each Leader begins play with a ', { type: 'strong', content: 'Warrant' }, ' token.'] });
    
    if (showBrowncoatHeroesWarning) {
        specialRules.push({
            source: 'warning', title: 'Story & Setup Card Interaction',
            content: [
                { type: 'paragraph', content: [`The `, { type: 'strong', content: `"${activeStoryCard?.title}"` }, ` story provides a specific starting Ship & Crew, which overrides the standard "buy" phase of `, { type: 'strong', content: `"The Browncoat Way"` }, `.`] },
                { type: 'warning-box', content: [
                    { type: 'paragraph', content: [`Your starting Capitol is reduced by the cost of your assigned ship (e.g., Serenity costs $4,800), but not below $0.`] },
                    { type: 'paragraph', content: [{ type: 'strong', content: `This will likely leave you with $0, unable to purchase Fuel or Parts during the Browncoat Market phase.` }] }
                ]}
            ]
        });
    }

    if (isHeroesCustomSetup) specialRules.push({ source: 'warning', title: 'Heroes & Misfits: Further Adventures', content: [{ type: 'strong', content: `Custom Setup Active:` }, ` Ignore standard crew/ship/location requirements.`, { type: 'br' }, `Pick your Leader, Ship, and Supply Planet. Start with $2000 and a full compliment of your favourite crew.`] });
    
    if (gameState.optionalRules.optionalShipUpgrades) {
        specialRules.push({
            source: 'expansion', title: 'Optional Ship Upgrades',
            content: [
                { type: 'paragraph', content: [`The following ships have `, { type: 'strong', content: `Optional Ship Upgrade` }, ` cards available. If you choose one of these ships, take its corresponding upgrade card.`] },
                { 
                    type: 'sub-list', 
                    items: [
                        { ship: 'Bonanza', color: 'darkOliveGreen' as ThemeColor },
                        { ship: 'Bonnie Mae', color: 'darkSlateBlue' as ThemeColor },
                        { ship: 'Interceptor', color: 'black' as ThemeColor },
                        { ship: 'Serenity', color: 'saddleBrown' as ThemeColor },
                        { ship: 'Walden', color: 'cordovan' as ThemeColor },
                        { ship: 'Yun Qi', color: 'darkGoldenRod' as ThemeColor }
                    ]
                },
                { type: 'warning-box', content: [{ type: 'strong', content: `Walden & Interceptor:` }, ` These upgrades are double-sided. Choose your side during setup—you cannot switch later.`] }
            ]
        });
    }

    if (addBorderHavens) specialRules.push({ source: 'story', title: activeStoryCard?.title || '', content: [{ type: 'strong', content: `Choose Havens:` }, ` Each player chooses a Haven token. Havens `, { type: 'strong', content: `must be in Border Space` }, `.`] });
    if (startOutsideAllianceSpace) specialRules.push({ source: 'warning', title: 'Placement Restriction', content: [`Players' starting locations `, { type: 'strong', content: `may not be within Alliance Space` }, `.`] });
    if (allianceSpaceOffLimits) specialRules.push({ source: 'warning', title: 'Restricted Airspace', content: [{ type: 'strong', content: `Alliance Space is Off Limits` }, ` until Goal 3.`] });
    if (isBrowncoatDraft) specialRules.push({ source: 'setupCard', title: 'Browncoat Market', content: [{ type: 'strong', content: `Market Phase:` }, ` Once all players have purchased a ship and chosen a leader, everyone may buy fuel ($100) and parts ($300).`, { type: 'br' }, `(Reminder: Free starting fuel/parts are disabled in this mode.)`] });
    
    if (resolvedHavenDraft) {
        specialRules.push({ source: 'setupCard', title: 'Home Sweet Haven: Placement Rules', content: [
            { type: 'list', items: [
                [`Each Haven must be placed in an unoccupied `, { type: 'strong', content: `Planetary Sector adjacent to a Supply Planet` }, `.`],
                [`Havens may not be placed in a Sector with a `, { type: 'strong', content: `Contact` }, `.`],
                [`Remaining players place their Havens in `, { type: 'strong', content: `reverse order` }, `.`],
                [{ type: 'strong', content: `Players' ships start at their Havens.` }],
            ]}
        ]});
    }

    return { specialRules, isHavenDraft: resolvedHavenDraft, isBrowncoatDraft, specialStartSector, conflictMessage };
};