import React from 'react';
import { GameState, StoryCardDef, StepOverrides, JobSetupDetails, JobSetupMessage } from '../types';
import { CONTACT_NAMES, CHALLENGE_IDS } from '../data/ids';
import { hasFlag } from './data';

const STANDARD_CONTACTS = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];

const OVERRIDE_JOB_MODES: [keyof StepOverrides, string][] = [
    ['browncoatJobMode', 'no_jobs'],
    ['timesJobMode', 'times_jobs'],
    ['allianceHighAlertJobMode', 'high_alert_jobs'],
    ['buttonsJobMode', 'buttons_jobs'],
    ['awfulJobMode', 'awful_jobs'],
    ['rimJobMode', 'rim_jobs'],
];

const JOB_MODE_DETAILS: Record<string, { getContacts?: () => string[], getMessage?: (forbidden: string | undefined) => JobSetupMessage | null }> = {
    buttons_jobs: {
        getContacts: () => ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'],
        getMessage: () => ({
            source: 'setupCard',
            title: 'Setup Card Override',
            content: React.createElement(React.Fragment, null, 
                React.createElement('strong', null, 'Specific Contacts:'), ' Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.', 
                React.createElement('br'), 
                React.createElement('strong', null, 'Caper Bonus:'), ' Draw 1 Caper Card.'
            )
        })
    },
    awful_jobs: {
        getContacts: () => [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'],
        getMessage: (forbidden) => ({
            source: 'setupCard',
            title: 'Setup Card Override',
            content: forbidden === CONTACT_NAMES.HARKEN
                ? React.createElement(React.Fragment, null,
                    React.createElement('strong', null, 'Limited Contacts.'), ' This setup card normally draws from Harken, Amnon Duul, and Patience.',
                    React.createElement('div', { className: 'mt-1 text-amber-800 dark:text-amber-400 font-bold text-xs' }, '⚠️ Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only.')
                  )
                : React.createElement(React.Fragment, null, 
                    React.createElement('strong', null, 'Limited Contacts.'), ' Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.'
                  )
        })
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

const getJobDrawMode = (storyCard: StoryCardDef | undefined, overrides: StepOverrides): string => {
    if (storyCard?.setupConfig?.jobDrawMode) {
        return storyCard.setupConfig.jobDrawMode;
    }
    const override = OVERRIDE_JOB_MODES.find(([key]) => overrides[key]);
    return override ? override[1] : 'standard';
};

const getNoJobsMessage = (mode: string, overrides: StepOverrides, prime: boolean, noPrimeChallenge: boolean): JobSetupMessage => {
    if (noPrimeChallenge) {
        return {
            source: 'warning',
            title: 'Challenge Active',
            content: React.createElement(React.Fragment, null,
                React.createElement('p', null, React.createElement('strong', null, 'No Starting Jobs.')),
                React.createElement('p', { className: 'mt-1' }, React.createElement('strong', null, 'Do not prime the Contact Decks.'), ' (Challenge Override)')
            )
        };
    }
    if (prime) {
        return {
            source: 'story',
            title: 'Story Override',
            content: React.createElement(React.Fragment, null,
                React.createElement('p', null, React.createElement('strong', null, 'No Starting Jobs are dealt.')),
                React.createElement('p', { className: 'mt-2' }, 'Instead, ', React.createElement('strong', null, 'prime the Contact Decks'), ':'),
                React.createElement('ul', { className: 'list-disc ml-5 mt-1 text-sm' },
                    React.createElement('li', null, 'Reveal the top ', React.createElement('strong', null, '3 cards'), ' of each Contact Deck.'),
                    React.createElement('li', null, 'Place the revealed Job Cards in their discard piles.')
                )
            )
        };
    }
    return overrides.browncoatJobMode
        ? { source: 'setupCard', title: 'Setup Card Override', content: React.createElement(React.Fragment, null, React.createElement('p', null, React.createElement('strong', null, 'No Starting Jobs.')), React.createElement('p', null, "Crews must find work on their own out in the black.")) }
        : { source: 'story', title: 'Story Override', content: React.createElement('p', null, React.createElement('strong', null, 'Do not take Starting Jobs.')) };
};


export const determineJobSetupDetails = (
    gameState: GameState,
    activeStoryCard: StoryCardDef | undefined,
    overrides: StepOverrides,
): JobSetupDetails => {
    const jobDrawMode = getJobDrawMode(activeStoryCard, overrides);
    const storyConfig = activeStoryCard?.setupConfig;
    const { forbiddenStartingContact, allowedStartingContacts } = storyConfig || {};
    const messages: JobSetupMessage[] = [];
    
    const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
    const dontPrimeContactsChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];

    if (jobDrawMode === 'no_jobs') {
        messages.push(getNoJobsMessage(jobDrawMode, overrides, hasFlag(storyConfig, 'primeContactDecks'), dontPrimeContactsChallenge));
        return { contacts: [], messages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
    }
    
    let contacts: string[] = [];
    const modeDetails = JOB_MODE_DETAILS[jobDrawMode] || JOB_MODE_DETAILS.standard;
    if (modeDetails.getContacts) {
        contacts = modeDetails.getContacts();
    }
    if (modeDetails.getMessage) {
        const msg = modeDetails.getMessage(forbiddenStartingContact);
        if (msg) messages.push(msg);
    }
    
    if (forbiddenStartingContact) {
        contacts = contacts.filter(c => c !== forbiddenStartingContact);
    }
    if (allowedStartingContacts && allowedStartingContacts.length > 0) {
        contacts = contacts.filter(c => allowedStartingContacts.includes(c));
    }
    
    if (storyConfig?.forbiddenStartingContact || (storyConfig?.allowedStartingContacts && storyConfig.allowedStartingContacts.length > 0)) {
        if (activeStoryCard?.setupDescription) {
            messages.push({ source: 'story', title: 'Story Override', content: activeStoryCard.setupDescription });
        }
    }

    if (isSingleContactChallenge) {
        messages.push({ source: 'warning', title: 'Challenge Active', content: React.createElement('p', null, React.createElement('strong', null, 'Single Contact Only:'), ' You may only work for one contact.') });
    }

    return {
        contacts,
        messages,
        showStandardContactList: true,
        isSingleContactChoice: isSingleContactChallenge,
        cardsToDraw: 3, // For single contact choice
        totalJobCards: contacts.length
    };
};