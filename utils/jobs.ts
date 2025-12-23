import { 
    GameState, 
    StepOverrides,
    JobMode,
    JobSetupDetails,
    JobSetupMessage,
    StructuredContent,
    ForbidContactRule,
    AllowContactsRule,
    SetJobModeRule,
    RuleSourceType,
    SetupRule,
    StoryCardDef
} from '../types';
import { getResolvedRules } from './selectors/rules';
import { CONTACT_NAMES, CHALLENGE_IDS } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';

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
    const STANDARD_CONTACTS = [CONTACT_NAMES.HARKEN, CONTACT_NAMES.BADGER, CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.PATIENCE, CONTACT_NAMES.NISKA];
    const JOB_MODE_CONTACTS: Record<string, string[]> = {
        buttons_jobs: [CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.LORD_HARROW, CONTACT_NAMES.MAGISTRATE_HIGGINS],
        awful_jobs: [CONTACT_NAMES.HARKEN, CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.PATIENCE],
        rim_jobs: [CONTACT_NAMES.LORD_HARROW, CONTACT_NAMES.MR_UNIVERSE, CONTACT_NAMES.FANTY_MINGO, CONTACT_NAMES.MAGISTRATE_HIGGINS],
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
        messages.push({ source: 'setupCard', title: 'Setup Card Override', content: [{ type: 'strong', content: 'Specific Contacts:' }, ` Draw from ${CONTACT_NAMES.AMNON_DUUL}, ${CONTACT_NAMES.LORD_HARROW}, and ${CONTACT_NAMES.MAGISTRATE_HIGGINS}.`, { type: 'br' }, { type: 'strong', content: 'Caper Bonus:' }, ' Draw 1 Caper Card.'] });
    }

    if (jobDrawMode === 'awful_jobs') {
        const originalContacts = _getInitialContacts(jobDrawMode);
        const isConflict = forbiddenContact && originalContacts.includes(forbiddenContact);
        
        if (isConflict) {
            const remainingContacts = originalContacts.filter(c => c !== forbiddenContact);
            const content: StructuredContent = [
                { type: 'strong', content: 'Limited Contacts.' },
                ` This setup card normally draws from ${originalContacts.join(', ')}.`, 
                { 
                    type: 'warning-box', 
                    content: [
                        `Story Card Conflict: `, 
                        { type: 'strong', content: forbiddenContact }, 
                        ` is unavailable. Draw from `,
                        { type: 'strong', content: remainingContacts.join(' and ') },
                        ` only.`
                    ] 
                }
            ];
            messages.push({ source: 'setupCard', title: 'Setup Card Override', content });
        } else {
            const content: StructuredContent = [
                { type: 'strong', content: 'Limited Contacts.' },
                ` Starting Jobs are drawn only from ${originalContacts.join(', ')}.`
            ];
            messages.push({ source: 'setupCard', title: 'Setup Card Override', content });
        }
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