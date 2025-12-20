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
    ModifyResourceEffect,
    ResourceType,
    ModifyResourceRule
} from '../../types';
import { hasFlag } from '../data';
import { CONTACT_NAMES, CHALLENGE_IDS, STORY_TITLES, STEP_IDS } from '../../data/ids';
import { getActiveStoryCard, getSetupCardById } from './story';

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
        // FIX: Add missing specialRules property to satisfy the NavDeckSetupDetails interface.
        specialRules: [],
    };
};

export const getPrimeDetails = (gameState: GameState, overrides: StepOverrides): PrimeDetails => {
  const activeStoryCard = getActiveStoryCard(gameState);
  const supplyHeavyExpansions: (keyof GameState['expansions'])[] = ['kalidasa', 'pirates', 'breakin_atmo', 'still_flying'];
  const activeSupplyHeavyCount = supplyHeavyExpansions.filter(exp => gameState.expansions[exp]).length;
  const isHighSupplyVolume = activeSupplyHeavyCount >= 3;

  const baseDiscard = isHighSupplyVolume && gameState.optionalRules.highVolumeSupply ? 4 : 3;
  const storyMultiplier = activeStoryCard?.setupConfig?.primingMultiplier || 1;
  const primeModifier = activeStoryCard?.setupConfig?.primeModifier;
  const isBlitz = overrides.primeMode === 'blitz';

  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) effectiveMultiplier = 2;
  
  let finalCount = baseDiscard * effectiveMultiplier;
  if (primeModifier?.add) finalCount += primeModifier.add;

  const isSlayingTheDragon = activeStoryCard?.title === STORY_TITLES.SLAYING_THE_DRAGON;

  // FIX: Add isSlayingTheDragon to the return object to satisfy the PrimeDetails interface.
  return { baseDiscard, effectiveMultiplier, finalCount, isHighSupplyVolume, isBlitz, isSlayingTheDragon, specialRules: [] };
};

export const getResourceDetails = (gameState: GameState, manualSelection?: 'story' | 'setupCard'): ResourceDetails => {
  const activeSetupCard = getSetupCardById(gameState.setupCardId);
  const activeStoryCard = getActiveStoryCard(gameState);

  const setupRules = (activeSetupCard?.rules?.filter(r => r.type === 'modifyResource') as ModifyResourceRule[] | undefined) || [];
  const setupEffects: ModifyResourceEffect[] = setupRules.map(r => ({
    ...r,
    source: { source: r.source, name: r.sourceName },
  }));

  const storyEffects = (activeStoryCard?.effects?.filter(e => e.type === 'modifyResource') as ModifyResourceEffect[] | undefined) || [];
  const allEffects = [...setupEffects, ...storyEffects];

  const resources: Record<ResourceType, number> = { credits: 3000, fuel: 6, parts: 2, warrants: 0, goalTokens: 0 };
  let creditModifications: { description: string; value: string }[] = [{ description: "Standard Allocation", value: "$3,000" }];

  const setupSetCredits = setupEffects.find(e => e.resource === 'credits' && e.method === 'set');
  if (setupSetCredits?.value !== undefined) {
    resources.credits = setupSetCredits.value;
    creditModifications = [{ description: setupSetCredits.description, value: `$${setupSetCredits.value.toLocaleString()}` }];
  }

  const storySetCredits = storyEffects.find(e => e.resource === 'credits' && e.method === 'set');
  const conflict = (setupSetCredits?.value !== undefined && storySetCredits?.value !== undefined)
    ? { story: { value: storySetCredits.value, source: storySetCredits.source }, setupCard: { value: setupSetCredits.value, source: setupSetCredits.source } }
    : undefined;

  if (conflict) {
    if (gameState.optionalRules.resolveConflictsManually && manualSelection === 'setupCard') {
      // User chose setup card, do nothing as it's already the base
    } else {
      // Default to story priority
      if(storySetCredits?.value !== undefined) {
        resources.credits = storySetCredits.value;
        creditModifications = [{ description: storySetCredits.description, value: `$${storySetCredits.value.toLocaleString()}` }];
      }
    }
  } else if (storySetCredits?.value !== undefined) {
    resources.credits = storySetCredits.value;
    creditModifications = [{ description: storySetCredits.description, value: `$${storySetCredits.value.toLocaleString()}` }];
  }

  allEffects.filter(e => e.method === 'set' && e.resource !== 'credits').forEach(effect => {
    if (effect.value !== undefined) resources[effect.resource] = effect.value;
  });

  allEffects.filter(e => e.method === 'add').forEach(effect => {
    if (effect.value !== undefined) {
        resources[effect.resource] += effect.value;
        if (effect.resource === 'credits') {
            creditModifications.push({ description: effect.description, value: `+$${effect.value.toLocaleString()}` });
        }
    }
  });

  const isFuelDisabled = allEffects.some(e => e.resource === 'fuel' && e.method === 'disable');
  if (isFuelDisabled) resources.fuel = 0;
  const isPartsDisabled = allEffects.some(e => e.resource === 'parts' && e.method === 'disable');
  if (isPartsDisabled) resources.parts = 0;

  return { ...resources, isFuelDisabled, isPartsDisabled, conflict, creditModifications };
};

export const getJobSetupDetails = (gameState: GameState, overrides: StepOverrides): JobSetupDetails => {
    const activeStoryCard = getActiveStoryCard(gameState);
    const storyConfig = activeStoryCard?.setupConfig;
    const { forbiddenStartingContact, allowedStartingContacts } = storyConfig || {};
    const messages: JobSetupMessage[] = [];

    const jobDrawMode: JobMode = storyConfig?.jobDrawMode || overrides.jobMode || 'standard';
    const jobModeSource = storyConfig?.jobDrawMode ? 'story' : 'setupCard';
    
    const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
    const dontPrimeContactsChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];

    if (jobDrawMode === 'no_jobs') {
        let content: StructuredContent;
        if (dontPrimeContactsChallenge) {
            content = [{ type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs.'}] }, { type: 'paragraph', content: [{ type: 'strong', content: 'Do not prime the Contact Decks.'}, ' (Challenge Override)'] }];
            messages.push({ source: 'warning', title: 'Challenge Active', content });
        } else if (hasFlag(storyConfig, 'primeContactDecks')) {
            content = [
              { type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs are dealt.' }] },
              { type: 'paragraph', content: ['Instead, ', { type: 'strong', content: 'prime the Contact Decks' }, ':'] },
              { type: 'list', items: [
                  ['Reveal the top ', { type: 'strong', content: '3 cards' }, ' of each Contact Deck.'],
                  ['Place the revealed Job Cards in their discard piles.']
              ]}
            ];
            messages.push({ source: 'story', title: 'Story Override', content });
        } else {
            content = (jobModeSource === 'setupCard')
              ? [{ type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs.' }] }, { type: 'paragraph', content: ["Crews must find work on their own out in the black."] }]
              : [{ type: 'paragraph', content: [{ type: 'strong', content: 'Do not take Starting Jobs.' }] }];
            messages.push({ source: jobModeSource, title: `${jobModeSource === 'story' ? 'Story' : 'Setup Card'} Override`, content });
        }
        return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
    }
    
    const STANDARD_CONTACTS = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];
    const JOB_MODE_CONTACTS: Record<string, string[]> = {
        buttons_jobs: ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'],
        awful_jobs: [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'],
        rim_jobs: ['Lord Harrow', 'Mr. Universe', 'Fanty & Mingo', 'Magistrate Higgins'],
    };
    
    let contacts = JOB_MODE_CONTACTS[jobDrawMode] || STANDARD_CONTACTS;
    
    if (jobDrawMode === 'buttons_jobs') {
        messages.push({ source: 'setupCard', title: 'Setup Card Override', content: [{ type: 'strong', content: 'Specific Contacts:' }, ' Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.', { type: 'br' }, { type: 'strong', content: 'Caper Bonus:' }, ' Draw 1 Caper Card.'] });
    }
    if (jobDrawMode === 'awful_jobs') {
        const content: StructuredContent = forbiddenStartingContact === CONTACT_NAMES.HARKEN
            ? [{ type: 'strong', content: 'Limited Contacts.' }, " This setup card normally draws from Harken, Amnon Duul, and Patience.", { type: 'warning-box', content: ['Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only.'] }]
            : [{ type: 'strong', content: 'Limited Contacts.' }, ' Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.'];
        messages.push({ source: 'setupCard', title: 'Setup Card Override', content });
    }
    
    if (forbiddenStartingContact) contacts = contacts.filter(c => c !== forbiddenStartingContact);
    if (allowedStartingContacts?.length) contacts = contacts.filter(c => allowedStartingContacts.includes(c));
    
    if ((forbiddenStartingContact || allowedStartingContacts) && activeStoryCard?.setupDescription) {
        messages.push({ source: 'story', title: 'Story Override', content: [activeStoryCard.setupDescription] });
    }

    if (isSingleContactChallenge) {
        messages.push({ source: 'warning', title: 'Challenge Active', content: [{ type: 'strong', content: 'Single Contact Only:' }, ' You may only work for one contact.'] });
    }

    return { contacts, messages, showStandardContactList: true, isSingleContactChoice: isSingleContactChallenge, cardsToDraw: 3, totalJobCards: contacts.length };
};

export const getAllianceReaverDetails = (gameState: GameState, stepOverrides: StepOverrides): AllianceReaverDetails => {
  const activeStoryCard = getActiveStoryCard(gameState);
  const storyConfig = activeStoryCard?.setupConfig;
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
  
  if (hasFlag(storyConfig, 'placeAllianceAlertsInAllianceSpace')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place an ', { type: 'action', content: 'Alliance Alert Token' }, ' on ', { type: 'strong', content: 'every planetary sector in Alliance Space' }, '.'] });
  }
  
  if (hasFlag(storyConfig, 'placeMixedAlertTokens')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place ', { type: 'strong', content: '3 Alliance Alert Tokens' }, " in the 'Verse:", { type: 'list', items: [['1 in ', { type: 'strong', content: 'Alliance Space' }], ['1 in ', { type: 'strong', content: 'Border Space' }], ['1 in ', { type: 'strong', content: 'Rim Space' }]] }] });
  }

  if (storyConfig?.createAlertTokenStackMultiplier) {
    const alertStackCount = storyConfig.createAlertTokenStackMultiplier * gameState.playerCount;
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Create a stack of ', { type: 'strong', content: `${alertStackCount} Alliance Alert Tokens` }, ` (${storyConfig.createAlertTokenStackMultiplier} per player).`] });
  }

  const smugglersBluesSetup = hasFlag(storyConfig, 'smugglersBluesSetup');
  if (smugglersBluesSetup) {
    const useSmugglersRimRule = smugglersBluesSetup && gameState.expansions.blue && gameState.expansions.kalidasa;
    specialRules.push({ source: 'story', title: 'Story Override', content: useSmugglersRimRule 
      ? ['Place ', { type: 'strong', content: '2 Contraband' }, ' on each Planetary Sector in ', { type: 'strong', content: 'Rim Space' }, '.']
      : ['Place ', { type: 'strong', content: '3 Contraband' }, ' on each Planetary Sector in ', { type: 'strong', content: 'Alliance Space' }, '.'] });
  }
  
  if (hasFlag(storyConfig, 'lonelySmugglerSetup')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Place ', { type: 'strong', content: '3 Contraband' }, ' on each Supply Planet ', { type: 'strong', content: 'except Persephone and Space Bazaar' }, '.'] });
  }

  if (hasFlag(storyConfig, 'startWithAlertCard')) {
    specialRules.push({ source: 'story', title: 'Story Override', content: ['Begin the game with one random Alliance Alert Card in play.'] });
  }

  const alliancePlacement = allianceMode === 'extra_cruisers' ? "Place a Cruiser at Regulus AND Persephone." : "Place the Cruiser at Londinium.";
  const reaverPlacement = gameState.expansions.blue ? "Place 3 Cutters in the border sectors closest to Miranda." : "Place 1 Cutter at the Firefly logo (Regina/Osiris).";

  return { specialRules, alliancePlacement, reaverPlacement };
};

export const getDraftDetails = (gameState: GameState, step: Step): DraftRuleDetails => {
    const specialRules: SpecialRule[] = [];
    const { overrides = {} } = step;
    const activeStoryCard = getActiveStoryCard(gameState);

    const isHavenDraft = step.id.includes(STEP_IDS.D_HAVEN_DRAFT);
    const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
    const isHeroesAndMisfits = activeStoryCard?.title === STORY_TITLES.HEROES_AND_MISFITS;
    const isRacingAPaleHorse = activeStoryCard?.title === STORY_TITLES.RACING_A_PALE_HORSE;
    const isPersephoneStart = activeStoryCard?.setupConfig?.shipPlacementMode === 'persephone' && !isHeroesCustomSetup;
    const isLondiniumStart = hasFlag(activeStoryCard?.setupConfig, 'startAtLondinium');
    const startOutsideAllianceSpace = hasFlag(activeStoryCard?.setupConfig, 'startOutsideAllianceSpace');
    const startAtSector = activeStoryCard?.setupConfig?.startAtSector;
    const allianceSpaceOffLimits = hasFlag(activeStoryCard?.setupConfig, 'allianceSpaceOffLimits');
    const addBorderHavens = hasFlag(activeStoryCard?.setupConfig, 'addBorderSpaceHavens');
    const isBrowncoatDraft = overrides.draftMode === 'browncoat';
    const isWantedLeaderMode = overrides.leaderSetup === 'wanted';
    const showBrowncoatHeroesWarning = isBrowncoatDraft && isHeroesAndMisfits && gameState.finalStartingCredits != null && gameState.finalStartingCredits < 4800;
    
    const specialStartSector: string | null = startAtSector || (isPersephoneStart ? 'Persephone' : null) || (isLondiniumStart ? 'Londinium' : null);
    
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