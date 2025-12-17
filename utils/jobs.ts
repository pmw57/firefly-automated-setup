import React from 'react';
import { StoryCardDef, StepOverrides, GameState, JobSetupDetails, JobSetupMessage } from '../types';
import { CHALLENGE_IDS, CONTACT_NAMES } from '../data/ids';
import { hasFlag } from './data';

// --- Types for Strategy Pattern ---
interface JobModeStrategy {
    getContacts: () => string[];
    getMessage: (forbiddenContact?: string) => JobSetupMessage | null;
}

// --- Constants & Maps ---

const OVERRIDE_TO_MODE_MAP: Array<[keyof StepOverrides, string]> = [
  ['browncoatJobMode', 'no_jobs'],
  ['timesJobMode', 'times_jobs'],
  ['allianceHighAlertJobMode', 'high_alert_jobs'],
  ['buttonsJobMode', 'buttons_jobs'],
  ['awfulJobMode', 'awful_jobs'],
  ['rimJobMode', 'rim_jobs'],
];

const STANDARD_CONTACTS = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];

// --- Strategies ---

const jobModeStrategies: Record<string, JobModeStrategy> = {
    buttons_jobs: {
        getContacts: () => ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'],
        getMessage: () => ({
            source: 'setupCard',
            title: 'Setup Card Override',
            content: React.createElement(React.Fragment, null, React.createElement("strong", null, "Specific Contacts:"), " Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.", React.createElement("br", null), React.createElement("strong", null, "Caper Bonus:"), " Draw 1 Caper Card.")
        })
    },
    awful_jobs: {
        getContacts: () => [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'],
        getMessage: (forbiddenContact) => {
             const harkenContent = forbiddenContact === CONTACT_NAMES.HARKEN 
            ? React.createElement(React.Fragment, null, React.createElement("strong", null, "Limited Contacts."), " This setup card normally draws from Harken, Amnon Duul, and Patience.", React.createElement("div", { className: "mt-1 text-amber-800 dark:text-amber-400 font-bold text-xs" }, "⚠️ Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only."))
            : React.createElement(React.Fragment, null, React.createElement("strong", null, "Limited Contacts."), " Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.");
            return { source: 'setupCard', title: 'Setup Card Override', content: harkenContent };
        }
    },
    rim_jobs: {
        getContacts: () => ['Lord Harrow', 'Mr. Universe', 'Fanty & Mingo', 'Magistrate Higgins'],
        getMessage: () => null
    },
    standard: {
        getContacts: () => STANDARD_CONTACTS,
        getMessage: () => null
    }
};

// --- Helper Functions ---

export const determineJobMode = (activeStoryCard: StoryCardDef, overrides: StepOverrides): string => {
  if (activeStoryCard.setupConfig?.jobDrawMode) {
      return activeStoryCard.setupConfig.jobDrawMode;
  }
  const foundOverride = OVERRIDE_TO_MODE_MAP.find(([key]) => overrides[key]);
  return foundOverride ? foundOverride[1] : 'standard';
};

const buildNoJobsContent = (mode: string, overrides: StepOverrides, primeContactDecks: boolean, isDontPrimeChallenge: boolean): { title: string, source: JobSetupMessage['source'], content: React.ReactNode } => {
    if (mode !== 'no_jobs') {
        return { source: 'info', title: 'Info', content: null };
    }

    if (primeContactDecks && !isDontPrimeChallenge) {
        return {
            source: 'story',
            title: 'Story Override',
            content: React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs are dealt.")), React.createElement("p", { className: "mt-2" }, "Instead, ", React.createElement("strong", null, "prime the Contact Decks"), ":"), React.createElement("ul", { className: "list-disc ml-5 mt-1 text-sm" }, React.createElement("li", null, "Reveal the top ", React.createElement("strong", null, "3 cards"), " of each Contact Deck."), React.createElement("li", null, "Place the revealed Job Cards in their discard piles.")))
        };
    }
    
    if (isDontPrimeChallenge) {
        return {
            source: 'warning',
            title: 'Challenge Active',
            content: React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs.")), React.createElement("p", { className: "mt-1" }, React.createElement("strong", null, "Do not prime the Contact Decks."), " (Challenge Override)"))
        };
    }

    if (overrides.browncoatJobMode) {
        return {
            source: 'setupCard',
            title: 'Setup Card Override',
            content: React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs.")), React.createElement("p", null, "Crews must find work on their own out in the black."))
        };
    }

    return {
        source: 'story',
        title: 'Story Override',
        content: React.createElement("p", null, React.createElement("strong", null, "Do not take Starting Jobs."))
    };
};

// --- Main Logic ---

export const determineJobSetupDetails = (
  gameState: GameState, 
  activeStoryCard: StoryCardDef | undefined, 
  overrides: StepOverrides
): JobSetupDetails => {
  // Use empty baseline if no story card is active (prevents default fallback leaks)
  const safeStory: StoryCardDef = activeStoryCard || { title: '', intro: '' };
  
  const jobMode = determineJobMode(safeStory, overrides);
  const { 
      forbiddenStartingContact, 
      allowedStartingContacts, 
  } = safeStory.setupConfig || {};
  
  const removeJobDecks = hasFlag(safeStory.setupConfig, 'removeJobDecks');
  const primeContactDecks = hasFlag(safeStory.setupConfig, 'primeContactDecks');
  
  const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
  const isDontPrimeChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
  const messages: JobSetupMessage[] = [];
  
  // 1. Critical Stop: No Decks
  if (removeJobDecks) {
    messages.push({ source: 'story', title: 'Setup Restriction', content: React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "Remove all Job Card decks from the game.")), React.createElement("p", null, "There's no time for working other Jobs.")) });
    return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }
  
  // 2. Special Modes (No standard contact list)
  if (jobMode === 'caper_start') {
      messages.push({ source: 'story', title: 'Story Override', content: React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "Do not deal Starting Jobs.")), React.createElement("p", null, "Each player begins the game with ", React.createElement("strong", null, "one Caper Card"), " instead.")) });
      return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }
  
  if (jobMode === 'wind_takes_us') {
      messages.push({ source: 'story', title: 'Story Override', content: React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "Each player chooses ", React.createElement("strong", null, "one Contact Deck"), " of their choice:"), React.createElement("ul", { className: "list-disc ml-5 mb-3 text-sm" }, React.createElement("li", null, "Draw ", React.createElement("strong", null, gameState.playerCount <= 3 ? '4' : '3', " Jobs"), " from that deck."), React.createElement("li", null, "Place a ", React.createElement("strong", null, "Goal Token"), " at the drop-off/destination sector of each Job."), React.createElement("li", null, "Return all Jobs to the deck and reshuffle.")), React.createElement("p", { className: "font-bold text-red-700 dark:text-red-400" }, "Do not deal Starting Jobs.")) });
      return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }

  if (jobMode === 'draft_choice') {
      const cardCount = isSingleContactChallenge ? "1 Contact Deck" : "3 different Contact Decks";
      const jobsPerDeck = isSingleContactChallenge ? "3 Job Cards" : "Job Card";
      const title = isSingleContactChallenge ? 'Story Override (Challenge Active)' : 'Story Override';
      
      const content = React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "In reverse player order, each player chooses ", React.createElement("strong", null, cardCount), "."), React.createElement("p", { className: "mb-2" }, "Draw the top ", React.createElement("strong", null, jobsPerDeck), " from each chosen deck."), forbiddenStartingContact === CONTACT_NAMES.NISKA && React.createElement("p", { className: "text-red-600 dark:text-red-400 text-sm font-bold" }, "Note: Mr. Universe is excluded."), React.createElement("p", { className: "opacity-75 mt-2" }, "Players may discard any starting jobs they do not want."));
      
      messages.push({ source: 'story', title, content });
      return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }

  if (jobMode === 'no_jobs') {
      messages.push(buildNoJobsContent(jobMode, overrides, primeContactDecks, isDontPrimeChallenge));
      return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }
  
  if (jobMode === 'times_jobs') {
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: React.createElement(React.Fragment, null, React.createElement("p", null, "Each player draws ", React.createElement("strong", null, "3 jobs"), " from ", React.createElement("strong", null, "one Contact Deck"), " of their choice."), React.createElement("p", { className: "text-sm italic opacity-80 mt-1" }, "Players may draw from the same Contact."), React.createElement("p", { className: "opacity-75 mt-2" }, "Players may discard any starting jobs they do not want.")) });
    return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }

  if (jobMode === 'high_alert_jobs') {
    messages.push({
      source: 'setupCard',
      title: 'Alliance High Alert',
      content: React.createElement(React.Fragment, null, 
        React.createElement("p", { className: "mb-2" }, React.createElement("strong", null, "Harken's Contact Deck is removed from the game.")),
        React.createElement("p", { className: "mb-2" }, "Each player draws ", React.createElement("strong", null, "3 Starting Jobs"), " from any Contact or combination of Contacts of their choice."),
        React.createElement("p", { className: "text-sm italic opacity-80" }, "Players may keep, or discard, any of the three Jobs they've drawn.")
      )
    });
    return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }

  // 3. Standard UI Modes (Use Strategies)
  
  const strategy = jobModeStrategies[jobMode] || jobModeStrategies.standard;
  let contacts = strategy.getContacts();
  const msg = strategy.getMessage(forbiddenStartingContact);
  if (msg) messages.push(msg);

  // 4. Filters & Challenges (Post-Processing)
  if (forbiddenStartingContact) contacts = contacts.filter(c => c !== forbiddenStartingContact);
  if (allowedStartingContacts && allowedStartingContacts.length > 0) contacts = contacts.filter(c => allowedStartingContacts.includes(c));
  
  if (safeStory.setupDescription && (forbiddenStartingContact || (allowedStartingContacts && allowedStartingContacts.length > 0))) {
    messages.push({ source: 'story', title: 'Story Override', content: safeStory.setupDescription });
  }

  if (isSingleContactChallenge) {
    messages.push({ source: 'warning', title: 'Challenge Active', content: React.createElement("p", null, React.createElement("strong", null, "Single Contact Only:"), " You may only work for one contact.") });
    return { contacts, messages, showStandardContactList: true, isSingleContactChoice: true, cardsToDraw: 3, totalJobCards: 0 };
  }
  
  const totalJobCards = contacts.length;
  return { contacts, messages, showStandardContactList: true, isSingleContactChoice: false, totalJobCards };
};