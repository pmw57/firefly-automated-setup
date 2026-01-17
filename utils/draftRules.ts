import { 
    GameState, 
    Step,
    DraftRuleDetails,
    SpecialRule,
    SetShipPlacementRule,
    SetDraftModeRule,
    SetPlayerBadgesRule,
    ThemeColor,
    AddSpecialRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { CHALLENGE_IDS } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';

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

    // Process generic special rules for this step category
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule') {
            const r = rule as AddSpecialRule;
            const contentRule: SpecialRule = { source: r.source as SpecialRule['source'], ...r.rule };
            const position = r.rule.position || 'after';

            switch (r.category) {
                case 'draft':
                    if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(r.source)) {
                        specialRules.push(contentRule);
                    }
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
    const isHeroesAndMisfits = hasRuleFlag(allRules, 'isHeroesAndMisfits');

    const shipPlacementRule = allRules.find(r => r.type === 'setShipPlacement') as (SetShipPlacementRule | undefined);
    
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
        // NOTE: We no longer automatically extract 'region' restrictions.
        // Instead, we rely on `draft_placement` rules defined in the story/setup data 
        // to populate the UI panel. This prevents code/data duplication logic errors.
      }
    }

    // --- Process Flags into Panel Extras ---
    
    const draftModeRule = allRules.find(r => r.type === 'setDraftMode') as SetDraftModeRule | undefined;
    const isBrowncoatDraft = draftModeRule?.mode === 'browncoat' || overrides.draftMode === 'browncoat';

    const showBrowncoatHeroesWarning = isBrowncoatDraft && isHeroesAndMisfits && isHeroesCustomSetup;
    
    let resolvedHavenDraft = isHavenDraft;
    let conflictMessage: import('../types').StructuredContent | null = null;
  
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
        
        conflictMessage = [{ type: 'strong', content: 'Story Priority:' }, ` Ships start at `, { type: 'strong', content: specialStartSector }, `, overriding Haven placement rules.`];
    }
    
    if (conflictMessage) specialRules.push({ source: 'info', title: 'Conflict Resolved', content: conflictMessage });

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

    // The generic Heroes & Misfits Custom Setup warning is now moved to the story card data.
    
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
    const badgeRule = allRules.find(r => r.type === 'setPlayerBadges') as SetPlayerBadgesRule | undefined;
    const playerBadges: Record<number, string> = badgeRule ? badgeRule.badges : {};
    
    return { 
        specialRules, 
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
        // We no longer pass the full rule object to the UI for automatic rendering,
        // avoiding duplication with the new draft_placement rules.
        havenPlacementRules: null, 
        playerBadges 
    };
};