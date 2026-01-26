
import { 
    GameState, 
    Step,
    DraftRuleDetails,
    SpecialRule,
    SetShipPlacementRule,
    SetDraftModeRule,
    SetPlayerBadgesRule,
    ThemeColor,
    AddSpecialRule,
    BypassDraftRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { CHALLENGE_IDS } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';
import { mapRuleSourceToBlockSource, processOverrulableRules } from './ruleProcessing';

const getShipPlacementLabel = (rule: SetShipPlacementRule): string => {
    if (typeof rule.location === 'string') {
        switch (rule.location) {
            case 'persephone': return 'Start at Persephone';
            case 'londinium': return 'Start at Londinium';
            case 'outside_alliance': return 'Start Outside Alliance Space';
            default: return `Start at ${rule.location}`;
        }
    }
    if ('sector' in rule.location) return `Start at ${rule.location.sector}`;
    if ('region' in rule.location) return `Start in ${rule.location.region}`;
    return 'Custom Start Location';
};

export const getDraftDetails = (gameState: GameState, step: Step): Omit<DraftRuleDetails, 'isRuiningIt'> => {
    const specialRules: SpecialRule[] = [];
    
    // Separate arrays for positioned content
    const draftPanelsBefore: SpecialRule[] = [];
    const draftPanelsAfter: SpecialRule[] = [];
    
    const draftShipsBefore: SpecialRule[] = [];
    const draftShipsAfter: SpecialRule[] = [];
    
    const draftPlacementBefore: SpecialRule[] = [];
    const draftPlacementAfter: SpecialRule[] = [];
    
    const { overrides = {} } = step;
    const allRules = getResolvedRules(gameState);
    const activeStoryCard = getActiveStoryCard(gameState);
    const isSolo = gameState.playerCount === 1;

    // Process generic special rules for this step category
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule') {
            const r = rule as AddSpecialRule;
            const contentRule: SpecialRule = { source: mapRuleSourceToBlockSource(r.source), ...r.rule };
            const position = r.rule.position || 'after';

            switch (r.category) {
                case 'draft':
                    specialRules.push(contentRule);
                    break;
                case 'draft_panel':
                    if (position === 'before') {
                        draftPanelsBefore.push(contentRule);
                    } else {
                        draftPanelsAfter.push(contentRule);
                    }
                    break;
                case 'draft_ships':
                    if (position === 'before') {
                        draftShipsBefore.push(contentRule);
                    } else {
                        draftShipsAfter.push(contentRule);
                    }
                    break;
                case 'draft_placement':
                    if (position === 'before') {
                        draftPlacementBefore.push(contentRule);
                    } else {
                        draftPlacementAfter.push(contentRule);
                    }
                    break;
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

    const havenPlacementRules = specialRules.find(r => (r.source === 'story' || r.source === 'setupCard') && r.flags?.includes('isHavenPlacement')) || null;
    const isHavenDraft = !!havenPlacementRules;
    const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
    
    // Check if a story explicitly bypasses the draft (e.g. Heroes & Misfits)
    const bypassDraftRule = allRules.find((r): r is BypassDraftRule => r.type === 'bypassDraft');
    const isDraftBypassed = !!bypassDraftRule;

    const shipPlacementRules = allRules.filter((r): r is SetShipPlacementRule => r.type === 'setShipPlacement');
    const { activeRule: shipPlacementRule, overruledRules: placementOverruled } = processOverrulableRules(
        shipPlacementRules,
        getShipPlacementLabel,
        () => 'Starting Location'
    );
    
    specialRules.push(...placementOverruled);
    
    let specialStartSector: string | null = null;
    const placementRegionRestriction: string | null = null;
    
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
        if ('sector' in shipPlacementRule.location) {
            specialStartSector = shipPlacementRule.location.sector;
        }
      }
    }

    let resolvedHavenDraft = isHavenDraft;
    const conflictMessage: import('../types/core').StructuredContent | null = null;

    if (resolvedHavenDraft && specialStartSector) {
        resolvedHavenDraft = false;
        specialRules.push({
            source: 'info',
            title: 'Conflict Resolved',
            content: [{ type: 'paragraph', content: [`Specific starting location (${specialStartSector}) overrides Haven Placement.`] }]
        });
    }

    // --- Process Flags into Panel Extras ---
    
    const draftModeRules = allRules.filter((r): r is SetDraftModeRule => r.type === 'setDraftMode');
    const { activeRule: draftModeRule, overruledRules: draftModeOverruled } = processOverrulableRules(
        draftModeRules,
        (r) => r.mode === 'browncoat' ? 'Browncoat Draft (Buy Ship)' : 'Standard Draft',
        () => 'Draft Mode'
    );
    specialRules.push(...draftModeOverruled);

    const isBrowncoatDraft = draftModeRule?.mode === 'browncoat' || overrides.draftMode === 'browncoat';

    // Conflict Detection: If the draft mode is Browncoat (which requires buying a ship),
    // but the story actively bypasses the draft (assigning a specific ship), we need to warn
    // the user about the financial implications.
    if (isBrowncoatDraft && isDraftBypassed) {
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

    // Process Player Badges
    const badgeRules = allRules.filter((r): r is SetPlayerBadgesRule => r.type === 'setPlayerBadges');
    const { activeRule: badgeRule, overruledRules: badgeOverruled } = processOverrulableRules(
        badgeRules,
        () => 'Custom Player Badges',
        () => 'Player Roles'
    );
    specialRules.push(...badgeOverruled);

    const playerBadges: Record<number, string> = badgeRule ? badgeRule.badges : {};
    
    // --- Text Calculation ---
    // Default text
    let selectShipTitle = "Select Ship & Leader";
    let selectShipDescription = isSolo
        ? "Choose a Leader & Ship."
        : "Winner selects Ship & Leader. Pass to Left.";
    
    let placementTitle = 'Placement';
    let placementDescription = isSolo
        ? "Place Ship in Sector."
        : "Pass to Right (Anti-Clockwise). Place Ship in Sector.";
    
    // Default Haven Draft overrides (can still be overwritten by specific rules)
    if (resolvedHavenDraft) {
        placementTitle = 'Haven Placement';
    }

    if (specialStartSector) {
        placementTitle = 'Special Placement';
        // Note: When specialStartSector is set, the component suppresses placementDescription entirely 
        // in favor of the custom panel content.
    }

    // Apply Overrides from Rules
    if (draftModeRule) {
        if (draftModeRule.selectShipTitle) selectShipTitle = draftModeRule.selectShipTitle;
        if (draftModeRule.selectShipDescription) selectShipDescription = draftModeRule.selectShipDescription;
        if (draftModeRule.placementTitle) placementTitle = draftModeRule.placementTitle;
        if (draftModeRule.placementDescription) placementDescription = draftModeRule.placementDescription;
    }
    
    const infoRules = specialRules.filter(r => r.source === 'info' || r.source === 'warning');
    const overrideRules = specialRules.filter(r => r.source !== 'info' && r.source !== 'warning');

    return { 
        infoRules, 
        overrideRules,
        draftPanelsBefore,
        draftPanelsAfter,
        draftShipsBefore,
        draftShipsAfter,
        draftPlacementBefore,
        draftPlacementAfter,
        isHavenDraft: resolvedHavenDraft, 
        isBrowncoatDraft, 
        specialStartSector, 
        placementRegionRestriction, 
        conflictMessage, 
        havenPlacementRules: null, 
        playerBadges,
        selectShipTitle,
        selectShipDescription,
        placementTitle,
        placementDescription
    };
};
