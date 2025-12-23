import { 
    GameState, 
    Step,
    NavDeckSetupDetails,
    PrimeDetails,
    ResourceDetails,
    JobSetupDetails,
    AllianceReaverDetails,
    DraftRuleDetails,
    StepOverrides,
    JobMode,
    JobSetupMessage,
    SpecialRule,
    StructuredContent,
    ResourceType,
    ModifyResourceRule,
    ModifyPrimeRule,
    CreateAlertTokenStackRule,
    SetShipPlacementRule,
    ForbidContactRule,
    AllowContactsRule,
    SetJobModeRule,
    RuleSourceType,
    ResourceConflict,
    SetupRule,
    StoryCardDef
} from '../../types';
import { getResolvedRules, hasRuleFlag } from './rules';
import { CONTACT_NAMES, CHALLENGE_IDS, STORY_TITLES, STEP_IDS } from '../../data/ids';
import { getActiveStoryCard } from './story';

// =================================================================
// Step-Specific Detail Selectors
// =================================================================

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

export const getPrimeDetails = (gameState: GameState, overrides: StepOverrides): PrimeDetails => {
  const activeStoryCard = getActiveStoryCard(gameState);
  const supplyHeavyExpansions: (keyof GameState['expansions'])[] = ['kalidasa', 'pirates', 'breakin_atmo', 'still_flying'];
  const activeSupplyHeavyCount = supplyHeavyExpansions.filter(exp => gameState.expansions[exp]).length;
  const isHighSupplyVolume = activeSupplyHeavyCount >= 3;

  const baseDiscard = isHighSupplyVolume && gameState.optionalRules.highVolumeSupply ? 4 : 3;
  
  const rules = getResolvedRules(gameState);
  
  const primeMultiplierRule = rules.find(r => r.type === 'modifyPrime' && r.multiplier !== undefined) as ModifyPrimeRule | undefined;
  const storyMultiplier = primeMultiplierRule?.multiplier ?? 1;
  
  const primeModifierRule = rules.find(r => r.type === 'modifyPrime' && r.modifier !== undefined) as ModifyPrimeRule | undefined;
  const primeModifier = primeModifierRule?.modifier;

  const isBlitz = overrides.primeMode === 'blitz';

  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) effectiveMultiplier = 2;
  
  let finalCount = baseDiscard * effectiveMultiplier;
  if (primeModifier?.add) finalCount += primeModifier.add;

  const isSlayingTheDragon = activeStoryCard?.title === STORY_TITLES.SLAYING_THE_DRAGON;

  return { baseDiscard, effectiveMultiplier, finalCount, isHighSupplyVolume, isBlitz, isSlayingTheDragon, specialRules: [] };
};

// --- Refactored getResourceDetails ---
const PRIORITY_ORDER: RuleSourceType[] = ['story', 'challenge', 'setupCard', 'optionalRule', 'expansion'];

const _findCreditConflict = (resourceRules: ModifyResourceRule[], manualResolutionEnabled: boolean): {
    conflict?: ResourceConflict;
    storyRule?: ModifyResourceRule;
    setupRule?: ModifyResourceRule;
} => {
    const creditSetRules = resourceRules.filter(r => r.resource === 'credits' && r.method === 'set');
    const storyRule = creditSetRules.find(r => r.source === 'story');
    const setupRule = creditSetRules.find(r => r.source === 'setupCard');

    if (manualResolutionEnabled && storyRule && setupRule && storyRule.value !== undefined && setupRule.value !== undefined) {
        return {
            conflict: {
                story: { value: storyRule.value, label: storyRule.sourceName },
                setupCard: { value: setupRule.value, label: setupRule.sourceName },
            },
            storyRule,
            setupRule,
        };
    }
    return { storyRule, setupRule };
};

const _applyResourceRules = (
    resourceType: ResourceType,
    baseValue: number,
    rulesForResource: ModifyResourceRule[],
    creditConflictInfo: ReturnType<typeof _findCreditConflict>,
    manualSelection?: 'story' | 'setupCard'
): { value: number; modifications: { description: string; value: string }[] } => {
    let finalValue = baseValue;
    let modifications: { description: string; value: string }[] = [];

    if (rulesForResource.some(r => r.method === 'disable')) {
        return { value: 0, modifications: [] };
    }

    // Handle 'set' rules
    if (resourceType === 'credits' && creditConflictInfo.conflict && manualSelection) {
        const selectedRule = manualSelection === 'story' ? creditConflictInfo.storyRule : creditConflictInfo.setupRule;
        if (selectedRule?.value !== undefined) {
            finalValue = selectedRule.value;
            modifications = [{ description: selectedRule.description, value: `$${finalValue.toLocaleString()}` }];
        }
    } else {
        const setRules = rulesForResource.filter(r => r.method === 'set');
        if (setRules.length > 0) {
            setRules.sort((a, b) => PRIORITY_ORDER.indexOf(a.source) - PRIORITY_ORDER.indexOf(b.source));
            const topRule = setRules[0];
            if (topRule.value !== undefined) {
                finalValue = topRule.value;
                if (resourceType === 'credits') {
                    modifications = [{ description: topRule.description, value: `$${finalValue.toLocaleString()}` }];
                }
            }
        }
    }

    // Handle 'add' rules
    const addRules = rulesForResource.filter(r => r.method === 'add');
    addRules.forEach(rule => {
        if (rule.value !== undefined) {
            finalValue += rule.value;
            if (resourceType === 'credits') {
                if (modifications.length === 0) {
                     modifications.push({ description: "Base Allocation", value: `$${baseValue.toLocaleString()}` });
                }
                modifications.push({ description: rule.description, value: `+$${rule.value.toLocaleString()}` });
            }
        }
    });
    
    // Default modification for credits if no other rules applied
    if (resourceType === 'credits' && modifications.length === 0) {
        modifications.push({ description: "Standard Allocation", value: `$${finalValue.toLocaleString()}` });
    }

    return { value: finalValue, modifications };
};

export const getResourceDetails = (gameState: GameState, manualSelection?: 'story' | 'setupCard'): ResourceDetails => {
  const allRules = getResolvedRules(gameState);
  const resourceRules = allRules.filter(r => r.type === 'modifyResource') as ModifyResourceRule[];
  
  const baseResources: Record<ResourceType, number> = { credits: 3000, fuel: 6, parts: 2, warrants: 0, goalTokens: 0 };
  const finalResources: Partial<Record<ResourceType, number>> = {};
  let finalCreditModifications: { description: string; value: string }[] = [];

  const creditConflictInfo = _findCreditConflict(resourceRules, gameState.optionalRules.resolveConflictsManually);
  
  (Object.keys(baseResources) as ResourceType[]).forEach(resource => {
    const { value, modifications } = _applyResourceRules(
      resource,
      baseResources[resource],
      resourceRules.filter(r => r.resource === resource),
      creditConflictInfo,
      manualSelection
    );
    finalResources[resource] = value;
    if (resource === 'credits') {
      finalCreditModifications = modifications;
    }
  });

  return {
    credits: finalResources.credits!,
    fuel: finalResources.fuel!,
    parts: finalResources.parts!,
    warrants: finalResources.warrants!,
    goalTokens: finalResources.goalTokens!,
    isFuelDisabled: resourceRules.some(e => e.resource === 'fuel' && e.method === 'disable'),
    isPartsDisabled: resourceRules.some(e => e.resource === 'parts' && e.method === 'disable'),
    creditModifications: finalCreditModifications,
    conflict: creditConflictInfo.conflict
  };
};

// --- Refactored getJobSetupDetails ---
const _handleNoJobsMode = (allRules: SetupRule[], jobModeSource: RuleSourceType, dontPrimeContactsChallenge: boolean): JobSetupDetails | null => {
    let content: StructuredContent;
    let messageSource: JobSetupMessage['source'] = 'info';
    let messageTitle = 'Information';
    
    if (dontPrimeContactsChallenge) {
        content = [{ type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs.' }] }, { type: 'paragraph', content: [{ type: 'strong', content: 'Do not prime the Contact Decks.' }, ' (Challenge Override)'] }];
        messageSource = 'warning';
        messageTitle = 'Challenge Active';
    } else if (allRules.some(r => r.type === 'primeContacts')) {
        content = [
          { type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs.' }] },
          { type: 'paragraph', content: ['Instead, ', { type: 'strong', content: 'prime the Contact Decks' }, ':'] },
          { type: 'list', items: [['Reveal the top ', { type: 'strong', content: '3 cards' }, ' of each Contact Deck.'], ['Place the revealed Job Cards in their discard piles.']] }
        ];
        messageSource = 'story';
        messageTitle = 'Story Override';
    } else {
        content = (jobModeSource === 'setupCard')
          ? [{ type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs.' }] }, { type: 'paragraph', content: ["Crews must find work on their own out in the black."] }]
          : [{ type: 'paragraph', content: [{ type: 'strong', content: 'Do not take Starting Jobs.' }] }];
        
        switch (jobModeSource) {
            case 'story': messageSource = 'story'; messageTitle = 'Story Override'; break;
            case 'setupCard': messageSource = 'setupCard'; messageTitle = 'Setup Card Override'; break;
            case 'challenge': messageSource = 'warning'; messageTitle = 'Challenge Restriction'; break;
        }
    }
    return { contacts: [], messages: [{ source: messageSource, title: messageTitle, content }], showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
};

const _getInitialContacts = (jobDrawMode: JobMode): string[] => {
    const STANDARD_CONTACTS = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];
    const JOB_MODE_CONTACTS: Record<string, string[]> = {
        buttons_jobs: ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'],
        awful_jobs: [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'],
        rim_jobs: ['Lord Harrow', 'Mr. Universe', 'Fanty & Mingo', 'Magistrate Higgins'],
    };
    return JOB_MODE_CONTACTS[jobDrawMode] || STANDARD_CONTACTS;
};

const _filterContacts = (contacts: string[], allRules: SetupRule[]): string[] => {
    let filtered = [...contacts];
    const forbiddenContactRule = allRules.find(r => r.type === 'forbidContact') as ForbidContactRule | undefined;
    const allowedContactsRule = allRules.find(r => r.type === 'allowContacts') as AllowContactsRule | undefined;

    if (forbiddenContactRule?.contact) {
        filtered = filtered.filter(c => c !== forbiddenContactRule.contact);
    }
    if (allowedContactsRule?.contacts?.length) {
        filtered = allowedContactsRule.contacts;
    }
    return filtered;
};

const _generateJobMessages = (
    jobDrawMode: JobMode,
    forbiddenContact: string | undefined,
    activeStoryCard: StoryCardDef | undefined,
    isSingleContactChallenge: boolean
): JobSetupMessage[] => {
    const messages: JobSetupMessage[] = [];
    if (jobDrawMode === 'buttons_jobs') {
        messages.push({ source: 'setupCard', title: 'Setup Card Override', content: [{ type: 'strong', content: 'Specific Contacts:' }, ' Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.', { type: 'br' }, { type: 'strong', content: 'Caper Bonus:' }, ' Draw 1 Caper Card.'] });
    }
    if (jobDrawMode === 'awful_jobs') {
        const content: StructuredContent = forbiddenContact === CONTACT_NAMES.HARKEN
            ? [{ type: 'strong', content: 'Limited Contacts.' }, " This setup card normally draws from Harken, Amnon Duul, and Patience.", { type: 'warning-box', content: ['Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only.'] }]
            : [{ type: 'strong', content: 'Limited Contacts.' }, ' Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.'];
        messages.push({ source: 'setupCard', title: 'Setup Card Override', content });
    }
    if (isSingleContactChallenge) {
        messages.push({ source: 'warning', title: 'Challenge Active', content: [{ type: 'strong', content: 'Single Contact Only:' }, ' You may only work for one contact.'] });
    }
    if (activeStoryCard?.setupDescription) {
        messages.push({ source: 'story', title: 'Story Override', content: [activeStoryCard.setupDescription] });
    }
    return messages;
};

export const getJobSetupDetails = (gameState: GameState, overrides: StepOverrides): JobSetupDetails => {
    const allRules = getResolvedRules(gameState);
    const jobModeRule = allRules.find(r => r.type === 'setJobMode') as SetJobModeRule | undefined;
    const jobDrawMode: JobMode = jobModeRule?.mode || overrides.jobMode || 'standard';

    if (jobDrawMode === 'no_jobs') {
        const jobModeSource: RuleSourceType = jobModeRule ? jobModeRule.source : 'setupCard';
        const dontPrimeContactsChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
        return _handleNoJobsMode(allRules, jobModeSource, dontPrimeContactsChallenge)!;
    }
    
    let contacts = _getInitialContacts(jobDrawMode);
    contacts = _filterContacts(contacts, allRules);

    const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
    const messages = _generateJobMessages(
        jobDrawMode,
        (allRules.find(r => r.type === 'forbidContact') as ForbidContactRule | undefined)?.contact,
        getActiveStoryCard(gameState),
        isSingleContactChallenge
    );
    
    return { contacts, messages, showStandardContactList: true, isSingleContactChoice: isSingleContactChallenge, cardsToDraw: 3, totalJobCards: contacts.length };
};

export const getAllianceReaverDetails = (gameState: GameState, stepOverrides: StepOverrides): AllianceReaverDetails => {
  const allRules = getResolvedRules(gameState);
  const specialRules: SpecialRule[] = [];
  const allianceMode = stepOverrides.allianceMode;

  switch (allianceMode) {
    case 'no_alerts':
      specialRules.push({ source: 'setupCard', title: 'Setup Card Override', content: [{ type: 'strong', content: 'Safe Skies:' }, ' Do not place any Alert Tokens at the start of the game.'] });
      break;
    case 'awful_crowded':
      specialRules.push({
        source: 'setupCard', title: 'Setup Card Override',
        content: [
          { type: 'strong', content: 'Awful Crowded:' },
          { type: 'list', items: [
            ['Place an ', { type: 'action', content: 'Alert Token' }, ' in ', { type: 'strong', content: 'every planetary sector' }, '.'],
            [{ type: 'strong', content: 'Alliance Space:' }, ' Place Alliance Alert Tokens.'],
            [{ type: 'strong', content: 'Border & Rim Space:' }, ' Place Reaver Alert Tokens.'],
            [{ type: 'warning-box', content: ["Do not place Alert Tokens on players' starting locations."] }],
            [{ type: 'strong', content: 'Alliance Ship movement' }, ' does not generate new Alert Tokens.'],
            [{ type: 'strong', content: 'Reaver Ship movement' }, ' generates new Alert Tokens.']
          ]}
        ]
      });
      break;
  }
  
  if (hasRuleFlag(allRules, 'placeAllianceAlertsInAllianceSpace')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place an ', { type: 'action', content: 'Alliance Alert Token' }, ' on ', { type: 'strong', content: 'every planetary sector in Alliance Space' }, '.'] });
  }
  
  if (hasRuleFlag(allRules, 'placeMixedAlertTokens')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place ', { type: 'strong', content: '3 Alliance Alert Tokens' }, " in the 'Verse:", { type: 'list', items: [['1 in ', { type: 'strong', content: 'Alliance Space' }], ['1 in ', { type: 'strong', content: 'Border Space' }], ['1 in ', { type: 'strong', content: 'Rim Space' }]] }] });
  }

  const createAlertTokenStackRule = allRules.find(r => r.type === 'createAlertTokenStack') as CreateAlertTokenStackRule | undefined;
  if (createAlertTokenStackRule) {
    const alertStackCount = createAlertTokenStackRule.multiplier * gameState.playerCount;
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Create a stack of ', { type: 'strong', content: `${alertStackCount} Alliance Alert Tokens` }, ` (${createAlertTokenStackRule.multiplier} per player).`] });
  }

  const smugglersBluesSetup = hasRuleFlag(allRules, 'smugglersBluesSetup');
  if (smugglersBluesSetup) {
    const useSmugglersRimRule = smugglersBluesSetup && gameState.expansions.blue && gameState.expansions.kalidasa;
    specialRules.push({ source: 'story', title: 'Story Override', content: useSmugglersRimRule 
      ? ['Place ', { type: 'strong', content: '2 Contraband' }, ' on each Planetary Sector in ', { type: 'strong', content: 'Rim Space' }, '.']
      : ['Place ', { type: 'strong', content: '3 Contraband' }, ' on each Planetary Sector in ', { type: 'strong', content: 'Alliance Space' }, '.'] });
  }
  
  if (hasRuleFlag(allRules, 'lonelySmugglerSetup')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place ', { type: 'strong', content: '3 Contraband' }, ' on each Supply Planet ', { type: 'strong', content: 'except Persephone and Space Bazaar' }, '.'] });
  }

  if (hasRuleFlag(allRules, 'startWithAlertCard')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Begin the game with one random Alliance Alert Card in play.'] });
  }

  const alliancePlacement = allianceMode === 'extra_cruisers' ? "Place a Cruiser at Regulus AND Persephone." : "Place the Cruiser at Londinium.";
  const reaverPlacement = gameState.expansions.blue ? "Place 3 Cutters in the border sectors closest to Miranda." : "Place 1 Cutter at the Firefly logo (Regina/Osiris).";

  return { specialRules, alliancePlacement, reaverPlacement };
};

export const getDraftDetails = (gameState: GameState, step: Step): DraftRuleDetails => {
    const specialRules: SpecialRule[] = [];
    const { overrides = {} } = step;
    const allRules = getResolvedRules(gameState);
    const activeStoryCard = getActiveStoryCard(gameState);

    const isHavenDraft = step.id.includes(STEP_IDS.D_HAVEN_DRAFT);
    const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
    const isHeroesAndMisfits = activeStoryCard?.title === STORY_TITLES.HEROES_AND_MISFITS;
    const isRacingAPaleHorse = activeStoryCard?.title === STORY_TITLES.RACING_A_PALE_HORSE;

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
    const isBrowncoatDraft = overrides.draftMode === 'browncoat';
    const isWantedLeaderMode = overrides.leaderSetup === 'wanted';
    const showBrowncoatHeroesWarning = isBrowncoatDraft && isHeroesAndMisfits && gameState.finalStartingCredits != null && gameState.finalStartingCredits < 4800;
    
    let resolvedHavenDraft = isHavenDraft;
    let conflictMessage: StructuredContent | null = null;
  
    if (isHavenDraft && specialStartSector) {
        resolvedHavenDraft = false;
        conflictMessage = [{ type: 'strong', content: 'Story Priority:' }, ` Ships start at `, { type: 'strong', content: specialStartSector }, `, overriding Haven placement rules.`];
    }
    
    if (conflictMessage) specialRules.push({ source: 'info', title: 'Conflict Resolved', content: conflictMessage });
    if (isWantedLeaderMode) specialRules.push({ source: 'setupCard', title: 'The Heat Is On', content: [`Choose Ships & Leaders normally, but `, { type: 'strong', content: `each Leader begins play with a Wanted token` }, `.`] });
    
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
                { type: 'sub-list', items: ['Bonanza', 'Bonnie Mae', 'Interceptor', 'Serenity', 'Walden', 'Yun Qi'].map(ship => ({ ship })) },
                { type: 'warning-box', content: [{ type: 'strong', content: `Walden & Interceptor:` }, ` These upgrades are double-sided. Choose your side during setup—you cannot switch later.`] }
            ]
        });
    }

    if (isRacingAPaleHorse) specialRules.push({ source: 'story', title: 'Story Setup: Haven', content: [{ type: 'strong', content: `Place your Haven at Deadwood (Blue Sun).` }, { type: 'br' }, `If you end your turn at your Haven, remove Disgruntled from all Crew.`] });
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