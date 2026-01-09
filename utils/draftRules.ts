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

export const getDraftDetails = (gameState: GameState, step: Step): Omit<DraftRuleDetails, 'isRuiningIt'> => {
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
    
    // Dynamically add page reference for stories that require it based on game state
    if (hasRuleFlag(allRules, 'hasConditionalHavenPageReference')) {
        const havenRule = specialRules.find(r => r.title === "Salvager's Stash");
        if (havenRule) {
            havenRule.page = gameState.expansions.tenth ? 35 : 13;
            havenRule.manual = gameState.expansions.tenth ? '10th AE' : 'Core';
        }
    }

    const isSetupCardHavenDraft = step.id.includes(STEP_IDS.D_HAVEN_DRAFT);
    const storyHavenRule = specialRules.find(r => r.source === 'story' && r.title === "Salvager's Stash");
    
    let havenPlacementRules: SpecialRule | null = null;
    
    // Story rule takes priority.
    if (storyHavenRule) {
        havenPlacementRules = storyHavenRule;
    } else if (isSetupCardHavenDraft) {
        // Setup card rule is the fallback.
        const setupHavenRule: SpecialRule = {
            source: 'setupCard', 
            title: 'Home Sweet Haven: Placement Rules', 
            page: 35,
            manual: '10th AE',
            content: [
                { type: 'list', items: [
                    [`Each Haven must be placed in an unoccupied `, { type: 'strong', content: `Planetary Sector adjacent to a Supply Planet` }, `.` ],
                    [`Havens may not be placed in a Sector with a `, { type: 'strong', content: `Contact` }, `.` ],
                    [`Remaining players place their Havens in `, { type: 'strong', content: `reverse order` }, `.` ],
                    [{ type: 'strong', content: `Players' ships start at their Havens.` }],
                ]}
            ]
        };
        // Add to both specialRules (for top block) and havenPlacementRules (for panel)
        specialRules.push(setupHavenRule);
        havenPlacementRules = setupHavenRule;
    }
    
    const isHavenDraft = !!havenPlacementRules;
    const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
    const isHeroesAndMisfits = hasRuleFlag(allRules, 'isHeroesAndMisfits');

    const shipPlacementRule = allRules.find(r => r.type === 'setShipPlacement') as (SetShipPlacementRule | undefined);
    
    let specialStartSector: string | null = null;
    let placementRegionRestriction: string | null = null;
    
    if (shipPlacementRule) {
      if (typeof shipPlacementRule.location === 'string') {
        switch (shipPlacementRule.location) {
          case 'persephone':
              if (!isHeroesCustomSetup) specialStartSector = 'Persephone';
              break;
          case 'londinium':
              specialStartSector = 'Londinium';
              break;
        }
      } else if (typeof shipPlacementRule.location === 'object') {
        if ('region' in shipPlacementRule.location) {
            placementRegionRestriction = shipPlacementRule.location.region;
        } else if ('sector' in shipPlacementRule.location) {
            specialStartSector = shipPlacementRule.location.sector;
        }
      }
    }

    const startOutsideAllianceSpace = hasRuleFlag(allRules, 'startOutsideAllianceSpace');
    const excludeNewCanaanPlacement = hasRuleFlag(allRules, 'excludeNewCanaanPlacement');
    const allianceSpaceOffLimits = hasRuleFlag(allRules, 'allianceSpaceOffLimits');
    
    const draftModeRule = allRules.find(r => r.type === 'setDraftMode') as SetDraftModeRule | undefined;
    const isBrowncoatDraft = draftModeRule?.mode === 'browncoat' || overrides.draftMode === 'browncoat';

    const leaderSetupRule = allRules.find(r => r.type === 'setLeaderSetup') as SetLeaderSetupRule | undefined;
    const isWantedLeaderMode = leaderSetupRule?.mode === 'wanted' || overrides.leaderSetup === 'wanted';
    
    const showBrowncoatHeroesWarning = isBrowncoatDraft && isHeroesAndMisfits && isHeroesCustomSetup;
    
    let resolvedHavenDraft = isHavenDraft;
    let conflictMessage: StructuredContent | null = null;
  
    if (isHavenDraft && specialStartSector) {
        resolvedHavenDraft = false;
        
        // Remove the original haven rule, as it's being overridden by a special start sector.
        const ruleToRemove = havenPlacementRules;
        if (ruleToRemove) {
            const index = specialRules.indexOf(ruleToRemove);
            if (index > -1) {
                specialRules.splice(index, 1);
            }
        }
        
        havenPlacementRules = null;
        conflictMessage = [{ type: 'strong', content: 'Story Priority:' }, ` Ships start at `, { type: 'strong', content: specialStartSector }, `, overriding Haven placement rules.`];
    }
    
    if (conflictMessage) specialRules.push({ source: 'info', title: 'Conflict Resolved', content: conflictMessage });

    if (isWantedLeaderMode) specialRules.push({ source: 'setupCard', title: 'The Heat Is On', content: ['Choose Ships & Leaders normally, but each Leader begins play with a ', { type: 'strong', content: 'Warrant' }, ' token.'] });
    if (isBrowncoatDraft) specialRules.push({ source: 'setupCard', title: 'Browncoat Market', content: ['Once all players have purchased a ship and chosen a leader, everyone may buy supplies. ', { type: 'strong', content: 'Fuel: $100, Parts: $300' }, '.'] });
    
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

    if (allianceSpaceOffLimits) specialRules.push({ source: 'warning', title: 'Restricted Airspace', content: [{ type: 'strong', content: `Alliance Space is Off Limits` }, ` until Goal 3.`] });
    
    if (startOutsideAllianceSpace) specialRules.push({ source: 'warning', title: 'Placement Restriction', content: ['Starting locations may not be within Alliance Space.'] });

    return { specialRules, isHavenDraft: resolvedHavenDraft, isBrowncoatDraft, specialStartSector, placementRegionRestriction, conflictMessage, startOutsideAllianceSpace, excludeNewCanaanPlacement, isWantedLeaderMode, havenPlacementRules };
};