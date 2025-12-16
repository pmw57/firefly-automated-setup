
import React from 'react';
import { StoryCardDef, StepOverrides, GameState, JobSetupDetails, JobSetupMessage } from '../types';
import { CHALLENGE_IDS, CONTACT_NAMES } from '../data/ids';

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
    messages.push({ source: 'story', title: 'Setup Restriction', content: React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "Remove all Job Card decks from the game.")), React.createElement("p", null, "There's no time for working other Jobs.")) });
    return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }
  
  // Specific Story/Setup modes that don't use the standard UI
  const nonStandardModes = ['caper_start', 'wind_takes_us', 'draft_choice', 'no_jobs'];
  if (nonStandardModes.includes(jobMode)) {
      let title = 'Story Override';
      let source: JobSetupMessage['source'] = 'story';
      let content: React.ReactNode = '';

      if (jobMode === 'caper_start') content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "Do not deal Starting Jobs.")), React.createElement("p", null, "Each player begins the game with ", React.createElement("strong", null, "one Caper Card"), " instead."));
      
      if (jobMode === 'wind_takes_us') content = React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "Each player chooses ", React.createElement("strong", null, "one Contact Deck"), " of their choice:"), React.createElement("ul", { className: "list-disc ml-5 mb-3 text-sm" }, React.createElement("li", null, "Draw ", React.createElement("strong", null, gameState.playerCount <= 3 ? '4' : '3', " Jobs"), " from that deck."), React.createElement("li", null, "Place a ", React.createElement("strong", null, "Goal Token"), " at the drop-off/destination sector of each Job."), React.createElement("li", null, "Return all Jobs to the deck and reshuffle.")), React.createElement("p", { className: "font-bold text-red-700 dark:text-red-400" }, "Do not deal Starting Jobs."));
      
      if (jobMode === 'draft_choice') {
        if (isSingleContactChallenge) {
          title = 'Story Override (Challenge Active)';
          content = React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "In reverse player order, each player chooses ", React.createElement("strong", null, "1 Contact Deck"), " (instead of 3)."), React.createElement("p", { className: "mb-2" }, "Draw the top ", React.createElement("strong", null, "3 Job Cards"), " from that deck."), forbiddenStartingContact === CONTACT_NAMES.NISKA && React.createElement("p", { className: "text-red-600 dark:text-red-400 text-sm font-bold" }, "Note: Mr. Universe is excluded."), React.createElement("p", { className: "opacity-75 mt-2" }, "Players may discard any starting jobs they do not want."));
        } else {
          content = React.createElement(React.Fragment, null, React.createElement("p", { className: "mb-2" }, "In reverse player order, each player chooses ", React.createElement("strong", null, "3 different Contact Decks"), "."), React.createElement("p", { className: "mb-2" }, "Draw the top Job Card from each chosen deck."), forbiddenStartingContact === CONTACT_NAMES.NISKA && React.createElement("p", { className: "text-red-600 dark:text-red-400 text-sm font-bold" }, "Note: Mr. Universe is excluded."), React.createElement("p", { className: "opacity-75 mt-2" }, "Players may discard any starting jobs they do not want."));
        }
      }
      
      if (jobMode === 'no_jobs') {
          if (primeContactDecks && !isDontPrimeChallenge) content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs are dealt.")), React.createElement("p", { className: "mt-2" }, "Instead, ", React.createElement("strong", null, "prime the Contact Decks"), ":"), React.createElement("ul", { className: "list-disc ml-5 mt-1 text-sm" }, React.createElement("li", null, "Reveal the top ", React.createElement("strong", null, "3 cards"), " of each Contact Deck."), React.createElement("li", null, "Place the revealed Job Cards in their discard piles.")));
          else if (isDontPrimeChallenge) { source = 'warning'; title = "Challenge Active"; content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs.")), React.createElement("p", { className: "mt-1" }, React.createElement("strong", null, "Do not prime the Contact Decks."), " (Challenge Override)")); }
          else if (overrides.browncoatJobMode) { source = 'setupCard'; title = 'Setup Card Override'; content = React.createElement(React.Fragment, null, React.createElement("p", null, React.createElement("strong", null, "No Starting Jobs.")), React.createElement("p", null, "Crews must find work on their own out in the black.")); }
          else content = React.createElement("p", null, React.createElement("strong", null, "Do not take Starting Jobs."));
      }

      messages.push({ source, title, content });
      return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
  }

  // Standard UI modes
  let contacts: string[] = [];
  if (jobMode === 'buttons_jobs') {
    contacts = ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'];
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: React.createElement(React.Fragment, null, React.createElement("strong", null, "Specific Contacts:"), " Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.", React.createElement("br", null), React.createElement("strong", null, "Caper Bonus:"), " Draw 1 Caper Card.") });
  } else if (jobMode === 'awful_jobs') {
    contacts = [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'];
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: (forbiddenStartingContact === CONTACT_NAMES.HARKEN ? React.createElement(React.Fragment, null, React.createElement("strong", null, "Limited Contacts."), " This setup card normally draws from Harken, Amnon Duul, and Patience.", React.createElement("div", { className: "mt-1 text-amber-800 dark:text-amber-400 font-bold text-xs" }, "⚠️ Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only.")) : React.createElement(React.Fragment, null, React.createElement("strong", null, "Limited Contacts."), " Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.")) });
  } else {
    contacts = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];
  }

  if (jobMode === 'high_alert_jobs') {
    contacts = contacts.filter(c => c !== CONTACT_NAMES.HARKEN);
    messages.push({ source: 'setupCard', title: 'Setup Card Override', content: React.createElement("strong", null, "Harken is unavailable.") });
  }
  
  if (jobMode === 'times_jobs') {
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
    messages.push({ source: 'warning', title: 'Challenge Active', content: React.createElement("p", null, React.createElement("strong", null, "Single Contact Only:"), " You may only work for one contact.") });
    return { contacts, messages, showStandardContactList: true, isSingleContactChoice: true, cardsToDraw: 3, totalJobCards: 0 };
  }
  
  const totalJobCards = contacts.length;

  return { contacts, messages, showStandardContactList: true, isSingleContactChoice: false, totalJobCards };
};
