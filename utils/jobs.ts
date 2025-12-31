// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
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
    StoryCardDef,
    SetJobContactsRule,
    SpecialRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
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

const _getInitialContacts = (allRules: SetupRule[]): string[] => {
    const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
    if (jobContactsRule) {
        return jobContactsRule.contacts;
    }
    const STANDARD_CONTACTS = [CONTACT_NAMES.HARKEN, CONTACT_NAMES.BADGER, CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.PATIENCE, CONTACT_NAMES.NISKA];
    return STANDARD_CONTACTS;
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
    allRules: SetupRule[],
    initialContacts: string[],
    activeStoryCard: StoryCardDef | undefined,
    isSingleContactChallenge: boolean
): JobSetupMessage[] => {
    const messages: JobSetupMessage[] = [];
    const specialRules: SpecialRule[] = [];

    // Process generic special rules for this step category
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule' && rule.category === 'jobs') {
            if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
                specialRules.push({
                    source: rule.source as SpecialRule['source'],
                    ...rule.rule
                });
            }
        }
    });
    
    // Generate a generic "Limited Contacts" message if a specific contact list is defined by a rule.
    const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
    if (jobContactsRule) {
        const forbiddenContact = (allRules.find(r => r.type === 'forbidContact') as ForbidContactRule | undefined)?.contact;
        const isConflict = forbiddenContact && initialContacts.includes(forbiddenContact);
        
        if (isConflict) {
            const remainingContacts = initialContacts.filter(c => c !== forbiddenContact);
            const content: StructuredContent = [
                { type: 'strong', content: 'Limited Contacts.' },
                ` This setup card normally draws from ${initialContacts.join(', ')}.`, 
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
                ` Starting Jobs are drawn only from ${initialContacts.join(', ')}.`
            ];
            messages.push({ source: 'setupCard', title: 'Setup Card Override', content });
        }
    }
    
    // Add the specific special rules to the messages list
    specialRules.forEach(rule => messages.push(rule));
    
    if (isSingleContactChallenge) {
        messages.push({ source: 'warning', title: 'Challenge Active', content: [{ type: 'strong', content: 'Single Contact Only:' }, ' You may only work for one contact.'] });
    }

    return messages;
};

export const getJobSetupDetails = (gameState: GameState, overrides: StepOverrides): JobSetupDetails => {
    const allRules = getResolvedRules(gameState);
    const activeStoryCard = getActiveStoryCard(gameState);

    if (hasRuleFlag(allRules, 'customJobDraw')) {
        const messages: JobSetupMessage[] = [];
        if (activeStoryCard?.setupDescription) {
            messages.push({ source: 'story', title: 'Job Draw Instructions', content: [activeStoryCard.setupDescription] });
        }
        return {
            contacts: [], 
            messages,
            showStandardContactList: false, 
            isSingleContactChoice: false, 
            totalJobCards: 0 
        };
    }
    
    const jobModeRule = allRules.find(r => r.type === 'setJobMode') as SetJobModeRule | undefined;
    const jobDrawMode: JobMode = jobModeRule?.mode || overrides.jobMode || 'standard';

    if (jobDrawMode === 'no_jobs') {
        const jobModeSource: RuleSourceType = jobModeRule ? jobModeRule.source : 'setupCard';
        const dontPrimeContactsChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
        const details = _handleNoJobsMode(allRules, jobModeSource, dontPrimeContactsChallenge)!;
        
        return details;
    }
    
    const initialContacts = _getInitialContacts(allRules);
    const contacts = _filterContacts(initialContacts, allRules);

    const isSingleContactChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
    const messages = _generateJobMessages(
        allRules,
        initialContacts,
        activeStoryCard,
        isSingleContactChallenge
    );
    
    return { contacts, messages, showStandardContactList: true, isSingleContactChoice: isSingleContactChallenge, cardsToDraw: 3, totalJobCards: contacts.length };
};