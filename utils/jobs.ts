import { GameState, StoryCardDef, StepOverrides, JobSetupDetails, JobSetupMessage, JobMode } from '../types';
import { CONTACT_NAMES, CHALLENGE_IDS } from '../data/ids';
import { hasFlag } from './data';

const STANDARD_CONTACTS = [CONTACT_NAMES.HARKEN, 'Badger', 'Amnon Duul', 'Patience', CONTACT_NAMES.NISKA];

const JOB_MODE_DETAILS: Record<string, { getContacts?: () => string[], getMessage?: (forbidden: string | undefined) => JobSetupMessage | null }> = {
    buttons_jobs: {
        getContacts: () => ['Amnon Duul', 'Lord Harrow', 'Magistrate Higgins'],
        getMessage: () => ({
            source: 'setupCard',
            title: 'Setup Card Override',
            content: [{ type: 'strong', content: 'Specific Contacts:' }, ' Draw from Amnon Duul, Lord Harrow, and Magistrate Higgins.', { type: 'br' }, { type: 'strong', content: 'Caper Bonus:' }, ' Draw 1 Caper Card.']
        })
    },
    awful_jobs: {
        getContacts: () => [CONTACT_NAMES.HARKEN, 'Amnon Duul', 'Patience'],
        getMessage: (forbidden) => ({
            source: 'setupCard',
            title: 'Setup Card Override',
            content: forbidden === CONTACT_NAMES.HARKEN
                ? [{ type: 'strong', content: 'Limited Contacts.' }, ' This setup card normally draws from Harken, Amnon Duul, and Patience.', { type: 'warning-box', content: ['Story Card Conflict: Harken is unavailable. Draw from Amnon Duul and Patience only.'] }]
                : [{ type: 'strong', content: 'Limited Contacts.' }, ' Starting Jobs are drawn only from Harken, Amnon Duul, and Patience.']
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

const getJobDrawMode = (storyCard: StoryCardDef | undefined, overrides: StepOverrides): { mode: JobMode, source: 'story' | 'setupCard' } => {
    if (storyCard?.setupConfig?.jobDrawMode) {
        return { mode: storyCard.setupConfig.jobDrawMode, source: 'story' };
    }
    if (overrides.jobMode) {
        return { mode: overrides.jobMode, source: 'setupCard' };
    }
    return { mode: 'standard', source: 'setupCard' }; // Standard is default
};

const getNoJobsMessage = (source: 'story' | 'setupCard', prime: boolean, noPrimeChallenge: boolean): JobSetupMessage => {
    if (noPrimeChallenge) {
        return {
            source: 'warning',
            title: 'Challenge Active',
            content: [
                { type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs.' }] },
                { type: 'paragraph', content: [{ type: 'strong', content: 'Do not prime the Contact Decks.' }, ' (Challenge Override)'] }
            ]
        };
    }
    if (prime) {
        return {
            source: 'story',
            title: 'Story Override',
            content: [
                { type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs are dealt.' }] },
                { type: 'paragraph', content: ['Instead, ', { type: 'strong', content: 'prime the Contact Decks' }, ':'] },
                { type: 'list', items: [
                    ['Reveal the top ', { type: 'strong', content: '3 cards' }, ' of each Contact Deck.'],
                    ['Place the revealed Job Cards in their discard piles.']
                ]}
            ]
        };
    }
    return source === 'setupCard'
        ? { source: 'setupCard', title: 'Setup Card Override', content: [{ type: 'paragraph', content: [{ type: 'strong', content: 'No Starting Jobs.' }] }, { type: 'paragraph', content: ["Crews must find work on their own out in the black."] }] }
        : { source: 'story', title: 'Story Override', content: [{ type: 'paragraph', content: [{ type: 'strong', content: 'Do not take Starting Jobs.' }] }] };
};


export const determineJobSetupDetails = (
    gameState: GameState,
    activeStoryCard: StoryCardDef | undefined,
    overrides: StepOverrides,
): JobSetupDetails => {
    const { mode: jobDrawMode, source: jobModeSource } = getJobDrawMode(activeStoryCard, overrides);
    const storyConfig = activeStoryCard?.setupConfig;
    const { forbiddenStartingContact, allowedStartingContacts } = storyConfig || {};
    const messages: JobSetupMessage[] = [];
    
    const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
    const dontPrimeContactsChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];

    if (jobDrawMode === 'no_jobs') {
        messages.push(getNoJobsMessage(jobModeSource, hasFlag(storyConfig, 'primeContactDecks'), dontPrimeContactsChallenge));
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
            messages.push({ source: 'story', title: 'Story Override', content: [activeStoryCard.setupDescription] });
        }
    }

    if (isSingleContactChallenge) {
        messages.push({ source: 'warning', title: 'Challenge Active', content: [{ type: 'paragraph', content: [{ type: 'strong', content: 'Single Contact Only:' }, ' You may only work for one contact.'] }] });
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