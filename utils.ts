

import React from 'react';
import { StoryCardDef, StepOverrides, DiceResult, DraftState, GameState, Expansions, Step, JobSetupDetails, JobSetupMessage } from './types';
import { SETUP_CARDS } from './data/setupCards';
import { SETUP_CONTENT } from './data/steps';
import { STORY_CARDS } from './data/storyCards';
import { EXPANSIONS_METADATA } from './data/expansions';
import { STEP_IDS, SETUP_CARD_IDS, STORY_TITLES, CHALLENGE_IDS, CONTACT_NAMES } from './data/ids';
import { SOLO_EXCLUDED_STORIES } from './data/collections';

// --- Predicates and Filters ---

const SOLO_EXCLUDED_STORIES_SET = new Set(SOLO_EXCLUDED_STORIES);

/**
 * Checks if a story card is valid based on the current game state.
 * This function encapsulates all filtering logic for story card availability.
 */
export const isStoryCompatible = (card: StoryCardDef, state: GameState): boolean => {
    const isClassicSolo = state.gameMode === 'solo' && state.setupCardId !== SETUP_CARD_IDS.FLYING_SOLO;

    if (isClassicSolo) {
        return card.title === STORY_TITLES.AWFUL_LONELY;
    }

    if (state.gameMode === 'multiplayer' && card.isSolo) {
        return false;
    }

    if (state.gameMode === 'solo' && SOLO_EXCLUDED_STORIES_SET.has(card.title)) {
        return false;
    }
    
    if (card.title === STORY_TITLES.SLAYING_THE_DRAGON && state.playerCount !== 2) {
        return false;
    }

    const mainReq = !card.requiredExpansion || state.expansions[card.requiredExpansion];
    const addReq = !card.additionalRequirements || card.additionalRequirements.every(req => state.expansions[req]);
    
    return mainReq && addReq;
};


// --- Draft Logic ---

const findWinnerIndex = (rolls: DiceResult[], overrideWinnerIndex?: number): number => {
    if (overrideWinnerIndex !== undefined && overrideWinnerIndex !== -1) {
        return overrideWinnerIndex;
    }
    const maxRoll = Math.max(...rolls.map(r => r.roll));
    return rolls.findIndex(r => r.roll === maxRoll);
};

const markWinner = (rolls: DiceResult[], winnerIndex: number): DiceResult[] => {
    return rolls.map((r, i) => ({ ...r, isWinner: i === winnerIndex }));
};

const generateDraftOrder = (rolls: DiceResult[], winnerIndex: number, playerCount: number): string[] => {
    const draftOrder: string[] = [];
    for (let i = 0; i < playerCount; i++) {
        const currentIndex = (winnerIndex + i) % playerCount;
        draftOrder.push(rolls[currentIndex].player);
    }
    return draftOrder;
};

export const calculateDraftOutcome = (
  currentRolls: DiceResult[], 
  playerCount: number,
  overrideWinnerIndex?: number
): DraftState => {
  const winnerIndex = findWinnerIndex(currentRolls, overrideWinnerIndex);
  const rollsWithWinner = markWinner(currentRolls, winnerIndex);
  const draftOrder = generateDraftOrder(rollsWithWinner, winnerIndex, playerCount);
  const placementOrder = [...draftOrder].reverse();

  return {
    rolls: rollsWithWinner,
    draftOrder,
    placementOrder
  };
};

// --- Job Mode Precedence Logic ---
export const determineJobMode = (activeStoryCard: StoryCardDef, overrides: StepOverrides): string => {
  const storyJobMode = activeStoryCard.setupConfig?.jobDrawMode;
  
  if (storyJobMode) return storyJobMode;
  if (overrides.browncoatJobMode) return 'no_jobs';
  if (overrides.timesJobMode) return 'times_jobs';
  if (overrides.allianceHighAlertJobMode) return 'high_alert_jobs';
  if (overrides.buttonsJobMode) return 'buttons_jobs';
  if (overrides.awfulJobMode) return 'awful_jobs';
  
  return 'standard';
};

// --- Job Setup Details Logic ---

export const determineJobSetupDetails = (
  gameState: GameState, 
  activeStoryCard: StoryCardDef, 
  overrides: StepOverrides
): JobSetupDetails => {
  const jobMode = determineJobMode(activeStoryCard, overrides);
  const { 
      forbiddenStartingContact, 
      allowedStartingContacts, 
      removeJobDecks, 
      primeContactDecks 
  } = activeStoryCard.setupConfig || {};
  const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
  const isDontPrimeChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
  const messages: JobSetupMessage[] = [];
  
  // Highest precedence: no jobs at all
  if (removeJobDecks) {
    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
    messages.push({ source: 'story', title: 'Setup Restriction', content: React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "Remove all Job Card decks from the game.")), React.createElement("p", null, "There's no time for working other Jobs.")) });
    return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }
  
  // Specific Story/Setup modes that don't use the standard UI
  const nonStandardModes = ['caper_start', 'wind_takes_us', 'draft_choice', 'no_jobs'];
  if (nonStandardModes.includes(jobMode)) {
      let title = 'Story Override';
      let source: JobSetupMessage['source'] = 'story';
      let content: React.ReactNode = '';

      // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
      if (jobMode === 'caper_start') content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "Do not deal Starting Jobs.")), React.createElement("p", null, "Each player begins the game with ", React.createElement("strong", null, "one Caper Card"), " instead."));
      
      // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
      if (jobMode === 'wind_takes_us') content = React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "Each player chooses ", React.createElement("strong", null, "one Contact Deck"), " of their choice:"), React.createElement("ul", { className: "list-disc ml-5 mb-3 text-sm" }, React.createElement("li", null, "Draw ", React.createElement("strong", null, gameState.playerCount <= 3 ? '4' : '3', " Jobs"), " from that deck."), React.createElement("li", null, "Place a ", React.createElement("strong", null, "Goal Token"), " at the drop-off/destination sector of each Job."), React.createElement("li", null, "Return all Jobs to the deck and reshuffle.")), React.createElement("p", { className: "font-bold text-red-700 dark:text-red-400" }, "Do not deal Starting Jobs."));
      
      if (jobMode === 'draft_choice') {
        if (isSingleContactChallenge) {
          title = 'Story Override (Challenge Active)';
          // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
          content = React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "In reverse player order, each player chooses ", React.createElement("strong", null, "1 Contact Deck"), " (instead of 3)."), React.createElement("p", { className: "mb-2" }, "Draw the top ", React.createElement("strong", null, "3 Job Cards"), " from that deck."), forbiddenStartingContact === CONTACT_NAMES.NISKA && React.createElement("p", { className: "text-red-600 dark:text-red-400 text-sm font-bold" }, "Note: Mr. Universe is excluded."), React.createElement("p", { className: "opacity-75 mt-2" }, "Players may discard any starting jobs they do not want."));
        } else {
          // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
          content = React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "In reverse player order, each player chooses ", React.createElement("strong", null, "3 different Contact Decks"), "."), React.createElement("p", { className: "mb-2" }, "Draw the top Job Card from each chosen deck."), forbiddenStartingContact === CONTACT_NAMES.NISKA && React.createElement("p", { className: "text-red-600 dark:text-red-400 text-sm font-bold" }, "Note: Mr. Universe is excluded."), React.createElement("p", { className: "opacity-75 mt-2" }, "Players may discard any starting jobs they do not want."));
        }
      }
      
      if (jobMode === 'no_jobs') {
          // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
          if (primeContactDecks && !isDontPrimeChallenge) content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs are dealt.")), React.createElement("p", { className: "mt-2" }, "Instead, ", React.createElement("strong", null, "prime the Contact Decks"), ":"), React.createElement("ul", { className: "list-disc ml-5 mt-1 text-sm" }, React.createElement("li", null, "Reveal the top ", React.createElement("strong", null, "3 cards"), " of each Contact Deck."), React.createElement("li", null, "Place the revealed Job Cards in their discard piles.")));
          // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
          else if (isDontPrimeChallenge) { source = 'warning'; title = "Challenge Active"; content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs.")), React.createElement("p", { className: "mt-1" }, React.createElement("strong", null, "Do not prime the Contact Decks."), " (Challenge Override)")); }
          // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
          else if (overrides.browncoatJobMode) { source = 'setupCard'; title = 'Setup Card Override'; content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs.")), React.createElement("p", null, "Crews must find work on their own out in the black.")); }
          // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
          else content = React.createElement("p", null, React.createElement("strong", null, "Do not take Starting Jobs."));
      }

      messages.push({ source, title, content });
      return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }

  // Standard UI modes
  let contacts: string[] = [];
  if (jobMode === 'buttons_jobs') {
    contacts = ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'];
    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: React.createElement(React.Fragment, null, React.createElement("strong", null, "Specific Contacts:"), " Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.", React.createElement("br", null), React.createElement("strong", null, "Caper Bonus:"), " Draw 1 Caper Card.") });
  } else if (jobMode === 'awful_jobs') {
    contacts = [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'];
    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: (forbiddenStartingContact === CONTACT_NAMES.HARKEN ? React.createElement(React.Fragment, null, React.createElement("strong", null, "Limited Contacts."), " This setup card normally draws from Harken, Amnon Duul, and Patience.", React.createElement("div", { className: "mt-1 text-amber-800 dark:text-amber-400 font-bold text-xs" }, "⚠️ Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only.")) : React.createElement(React.Fragment, null, React.createElement("strong", null, "Limited Contacts."), " Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.")) });
  } else {
    contacts = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];
  }

  if (jobMode === 'high_alert_jobs') {
    contacts = contacts.filter(c => c !== CONTACT_NAMES.HARKEN);
    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: React.createElement("strong", null, "Harken is unavailable.") });
  }
  
  if (jobMode === 'times_jobs') {
    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: React.createElement(React.Fragment, null, React.createElement("p", null, "Each player draws ", React.createElement("strong", null, "3 jobs"), " from ", React.createElement("strong", null, "one Contact Deck"), " of their choice."), React.createElement("p", { className: "text-sm italic opacity-80 mt-1" }, "Players may draw from the same Contact."), React.createElement("p", { className: "opacity-75 mt-2" }, "Players may discard any starting jobs they do not want.")) });
    return { contacts, messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }

  // Apply general filters
  if (forbiddenStartingContact) contacts = contacts.filter(c => c !== forbiddenStartingContact);
  if (allowedStartingContacts && allowedStartingContacts.length > 0) contacts = contacts.filter(c => allowedStartingContacts.includes(c));
  if (activeStoryCard.setupDescription && (forbiddenStartingContact || (allowedStartingContacts && allowedStartingContacts.length > 0))) {
    messages.push({ source: 'story', title: 'Story Override', content: activeStoryCard.setupDescription });
  }

  // Handle single contact challenge
  if (isSingleContactChallenge) {
    // FIX: Replaced JSX with React.createElement to be compatible with a .ts file.
    messages.push({ source: 'warning', title: 'Challenge Active', content: React.createElement("p", null, React.createElement("strong", null, "Single Contact Only:"), " You may only work for one contact.") });
    return { contacts, messages, showStandardContactList: true, isSingleContactChoice: true, cardsToDraw: 3, totalJobCards: 0 };
  }
  
  const totalJobCards = contacts.length;

  return { contacts, messages, showStandardContactList: true, isSingleContactChoice: false, totalJobCards };
};


// --- Credit Calculation Logic ---
export const calculateStartingResources = (activeStoryCard: StoryCardDef, overrides: StepOverrides) => {
  const bonusCredits = activeStoryCard.setupConfig?.startingCreditsBonus || 0;
  let totalCredits = overrides.startingCredits || 3000;
  
  // Handle explicit override from story card (e.g., Community Content)
  if (activeStoryCard.setupConfig?.startingCreditsOverride !== undefined) {
    totalCredits = activeStoryCard.setupConfig.startingCreditsOverride;
  } else {
    // Apply bonuses
    totalCredits += bonusCredits;
  }

  const noFuelParts = activeStoryCard.setupConfig?.noStartingFuelParts;
  const customFuel = activeStoryCard.setupConfig?.customStartingFuel;

  return { totalCredits, bonusCredits, noFuelParts, customFuel };
};

// --- UI and Summary Helpers ---

export const getStoryCardSetupSummary = (card: StoryCardDef): string | null => {
    if (card.setupDescription) return "Setup Changes";
    if (card.setupConfig?.jobDrawMode === 'no_jobs') return "No Starting Jobs";
    if (card.setupConfig?.jobDrawMode === 'caper_start') return "Starts with Caper";
    if (card.setupConfig?.shipPlacementMode === 'persephone') return "Starts at Persephone";
    return null;
};

export const getDisplaySetupName = (state: GameState): string => {
    if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO && state.secondarySetupId) {
        const secondary = SETUP_CARDS.find(s => s.id === state.secondarySetupId);
        if (secondary) return `Flying Solo + ${secondary.label}`;
    }
    return state.setupCardName;
};

export const getTimerSummaryText = (state: GameState, activeStory?: StoryCardDef): string | null => {
    const isSoloTimerActive = state.gameMode === 'solo' &&
                              !activeStory?.setupConfig?.disableSoloTimer &&
                              (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO || activeStory?.setupConfig?.soloGameTimer);

    if (!isSoloTimerActive) {
        return state.gameMode === 'solo' && activeStory?.setupConfig?.disableSoloTimer
            ? "Disabled (Story Override)"
            : null;
    }

    if (state.timerConfig.mode === 'standard') {
        return "Standard (20 Turns)";
    }

    const extraTokens = state.timerConfig.unpredictableSelectedIndices.length > 4;
    const randomized = state.timerConfig.randomizeUnpredictable;
    let summary = 'Unpredictable';
    if (extraTokens) summary += ' (Extra Tokens)';
    if (randomized) summary += ' (Randomized)';
    return summary;
};

export const getActiveOptionalRulesText = (state: GameState): string[] => {
    const rules: string[] = [];
    if (state.soloOptions?.noSureThings) rules.push("No Sure Things");
    if (state.soloOptions?.shesTrouble) rules.push("She's Trouble");
    if (state.soloOptions?.recipeForUnpleasantness) rules.push("Recipe For Unpleasantness");
    if (state.optionalRules?.optionalShipUpgrades) rules.push("Ship Upgrades");
    return rules;
};


// --- Setup Flow Logic ---

const createStep = (id: string, overrides: StepOverrides = {}): Step | null => {
  const content = SETUP_CONTENT[id];
  if (!content) return null;
  return {
    type: content.type,
    id: content.id || content.elementId || id,
    data: content,
    overrides
  };
};

const getInitialSetupSteps = (): Step[] => [
    { type: 'setup', id: STEP_IDS.SETUP_CAPTAIN_EXPANSIONS },
    { type: 'setup', id: STEP_IDS.SETUP_CARD_SELECTION },
];

const getOptionalRulesStep = (state: GameState): Step[] => {
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    const has10th = state.expansions.tenth;
    if (isFlyingSolo || has10th) {
        return [{ type: 'setup', id: STEP_IDS.SETUP_OPTIONAL_RULES }];
    }
    return [];
};

const getCoreStepsFromSetupCard = (state: GameState): Step[] => {
    const setupCard = SETUP_CARDS.find(s => s.id === state.setupCardId) || SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.STANDARD)!;
    return setupCard.steps
        .map(stepDef => createStep(stepDef.id, stepDef.overrides))
        .filter((step): step is Step => step !== null);
};

const getFinalStep = (): Step => ({ type: 'final', id: STEP_IDS.FINAL });

export const calculateSetupFlow = (state: GameState): Step[] => {
    return [
        ...getInitialSetupSteps(),
        ...getOptionalRulesStep(state),
        ...getCoreStepsFromSetupCard(state),
        getFinalStep(),
    ];
};


// --- Game State Updaters ---

const calculatePlayerNames = (currentNames: string[], newCount: number): string[] => {
    const newNames = [...currentNames];
    if (newCount > newNames.length) {
        for (let i = newNames.length; i < newCount; i++) {
            newNames.push(`Captain ${i + 1}`);
        }
    } else {
        newNames.length = newCount;
    }
    return newNames;
};

export const updatePlayerCountState = (prevState: GameState, newCount: number): GameState => {
    const safeCount = Math.max(1, Math.min(9, newCount));
    const newMode = safeCount === 1 ? 'solo' : 'multiplayer';

    const newState: GameState = {
        ...prevState,
        playerCount: safeCount,
        gameMode: newMode,
        playerNames: calculatePlayerNames(prevState.playerNames, safeCount),
        isCampaign: newMode === 'multiplayer' ? false : prevState.isCampaign,
    };

    if (newMode === 'multiplayer' && prevState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        newState.setupCardId = SETUP_CARD_IDS.STANDARD;
        newState.setupCardName = 'Standard Game Setup';
        newState.secondarySetupId = undefined;
    }

    const currentStoryDef = STORY_CARDS.find(c => c.title === prevState.selectedStoryCard);
    if (newMode === 'multiplayer' && currentStoryDef?.isSolo) {
        const defaultMulti = STORY_CARDS.find(c => !c.isSolo && c.requiredExpansion !== 'community') || STORY_CARDS[0];
        newState.selectedStoryCard = defaultMulti.title;
        newState.selectedGoal = defaultMulti.goals?.[0]?.title;
        newState.challengeOptions = {};
    }
    
    return newState;
};

export const updateExpansionState = (prevState: GameState, toggledExpansion: keyof Expansions): GameState => {
    const nextExpansions = {
        ...prevState.expansions,
        [toggledExpansion]: !prevState.expansions[toggledExpansion],
    };

    const newState: GameState = { ...prevState, expansions: nextExpansions };

    if (toggledExpansion === 'tenth') {
        newState.gameEdition = nextExpansions.tenth ? 'tenth' : 'original';
    }

    const currentSetup = SETUP_CARDS.find(s => s.id === prevState.setupCardId);
    let shouldResetSetup = false;

    if (currentSetup?.requiredExpansion && !nextExpansions[currentSetup.requiredExpansion]) {
        shouldResetSetup = true;
    }
    
    if (toggledExpansion === 'tenth' && !nextExpansions.tenth && prevState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        shouldResetSetup = true;
    }

    if (shouldResetSetup) {
        newState.setupCardId = SETUP_CARD_IDS.STANDARD;
        newState.setupCardName = 'Standard Game Setup';
        newState.secondarySetupId = undefined;
    }
    
    return newState;
};

export const autoSelectFlyingSoloState = (prevState: GameState): GameState => {
    const isSolo = prevState.gameMode === 'solo';
    const has10th = prevState.expansions.tenth;
    const isDefaultSetup = !prevState.setupCardId || prevState.setupCardId === SETUP_CARD_IDS.STANDARD;

    if (isSolo && has10th && isDefaultSetup) {
        return {
            ...prevState,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: SETUP_CARD_IDS.STANDARD,
        };
    }
    return prevState;
};

export const getDefaultGameState = (): GameState => {
    const allExpansions = EXPANSIONS_METADATA.reduce((acc, exp) => {
        if (exp.id !== 'base') {
            (acc as Record<keyof Expansions, boolean>)[exp.id] = false;
        }
        return acc;
    }, {} as Expansions);

    const firstStory = STORY_CARDS.find(c => !c.isSolo && c.requiredExpansion !== 'community') || STORY_CARDS[0];

    return {
        gameEdition: 'original',
        gameMode: 'multiplayer',
        playerCount: 4,
        playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'],
        setupCardId: SETUP_CARD_IDS.STANDARD,
        setupCardName: 'Standard Game Setup',
        secondarySetupId: undefined,
        selectedStoryCard: firstStory.title,
        selectedGoal: firstStory.goals?.[0]?.title,
        challengeOptions: {},
        timerConfig: {
            mode: 'standard',
            unpredictableSelectedIndices: [0, 2, 4, 5],
            randomizeUnpredictable: false,
        },
        soloOptions: {
            noSureThings: false,
            shesTrouble: false,
            recipeForUnpleasantness: false,
        },
        optionalRules: {
            disgruntledDie: 'standard',
            optionalShipUpgrades: false,
        },
        expansions: allExpansions,
        isCampaign: false,
        campaignStoriesCompleted: 0,
    };
};