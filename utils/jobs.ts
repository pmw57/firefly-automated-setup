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
    SpecialRule,
    ChallengeOption,
    SetJobStepContentRule
} from '../types/index';
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { CONTACT_NAMES, CHALLENGE_IDS } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';

const _handleNoJobsMode = (allRules: SetupRule[], jobModeSource: RuleSourceType, dontPrimeContactsChallenge: boolean): Omit<JobSetupDetails, 'jobDrawMode' | 'mainContent' | 'mainContentPosition' | 'showNoJobsMessage' | 'primeContactsInstruction'> => {
    const messages: JobSetupMessage[] = [];
    
    // 1. Add any specific "addSpecialRule" rules for the jobs step.
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule' && rule.category === 'jobs') {
            if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
                messages.push({ source: rule.source as SpecialRule['source'], ...rule.rule });
            }
        }
    });

    // 2. Handle priming rules if they exist
    if (dontPrimeContactsChallenge) {
        messages.push({
            source: 'warning',
            title: 'Challenge Active',
            content: [{ type: 'paragraph', content: [{ type: 'strong', content: 'Do not prime the Contact Decks.' }, ' (Challenge Override)'] }]
        });
    } else if (allRules.some(r => r.type === 'primeContacts')) {
        messages.push({
            source: 'story',
            title: 'Prime Contact Decks',
            content: [
              { type: 'paragraph', content: ['Instead of taking Starting Jobs, ', { type: 'strong', content: 'prime the Contact Decks' }, ':'] },
              { type: 'list', items: [['Reveal the top ', { type: 'strong', content: '3 cards' }, ' of each Contact Deck.'], ['Place the revealed Job Cards in their discard piles.']] }
            ]
        });
    }

    // 3. Add a generic override message if the source was a setup card.
    // Story cards are now expected to provide their own explicit `addSpecialRule` message.
    if (jobModeSource === 'setupCard' && !messages.some(m => m.source === 'setupCard')) {
        // Fallback for setup cards like Browncoat Way
        messages.push({
            source: 'setupCard',
            title: 'No Starting Jobs',
            content: [{ type: 'paragraph', content: ["Crews must find work on their own out in the black."] }]
        });
    }
    
    // 4. Deduplicate messages. This is a safeguard in case a specific rule and the 
    // setup description contain identical text.
    const uniqueMessages = messages.reduce((acc, current) => {
        const isDuplicate = acc.some(item => 
            item.title === current.title && 
            JSON.stringify(item.content) === JSON.stringify(item.content)
        );
        if (!isDuplicate) {
            acc.push(current);
        }
        return acc;
    }, [] as JobSetupMessage[]);
    
    const infoMessages = uniqueMessages.filter(m => m.source === 'info' || m.source === 'warning');
    const overrideMessages = uniqueMessages.filter(m => m.source !== 'info' && m.source !== 'warning');

    return { contacts: [], infoMessages, overrideMessages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
};

const _getInitialContacts = (allRules: SetupRule[], gameState: GameState): string[] => {
    const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
    if (jobContactsRule) {
        return jobContactsRule.contacts;
    }
    
    // Standard setup only uses the five core contacts for the initial job draw,
    // regardless of which expansions are enabled. Expansion contacts are only
    // added if a Setup or Story Card explicitly dictates it.
    const availableContacts = [
        CONTACT_NAMES.HARKEN, 
        CONTACT_NAMES.BADGER, 
        CONTACT_NAMES.AMNON_DUUL, 
        CONTACT_NAMES.PATIENCE, 
        CONTACT_NAMES.NISKA
    ];

    // Specific story flag to add all contacts for the job draft
    if (hasRuleFlag(allRules, 'useAllContactsForJobDraft')) {
        if (gameState.expansions.kalidasa) {
            availableContacts.push(
                CONTACT_NAMES.LORD_HARROW,
                CONTACT_NAMES.MR_UNIVERSE,
                CONTACT_NAMES.FANTY_MINGO,
                CONTACT_NAMES.MAGISTRATE_HIGGINS
            );
        }
    }
    
    return availableContacts;
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
    
    // Story-specific filter for 'Friends in Low Places'
    if (hasRuleFlag(allRules, 'useAllContactsForJobDraft')) {
        filtered = filtered.filter(c => c !== CONTACT_NAMES.MR_UNIVERSE);
    }
    
    return filtered;
};

const _generateJobMessages = (
    allRules: SetupRule[],
    initialContacts: string[],
    activeStoryCard: StoryCardDef | undefined,
    gameState: GameState
): JobSetupMessage[] => {
    const messages: JobSetupMessage[] = [];
    
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
            messages.push({ source: 'setupCard', title: 'Limited Contacts', content });
        }
    }
    
    // Process generic special rules for this step category
    allRules.forEach(rule => {
        if (rule.type === 'addSpecialRule' && rule.category === 'jobs') {
            if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
                messages.push({
                    source: rule.source as SpecialRule['source'],
                    ...rule.rule
                });
            }
        }
    });
    
    // Handle "Single Contact" first because it has custom text
    const processedChallenges = new Set<string>();
    if (gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT]) {
        messages.push({ source: 'warning', title: 'Challenge Active', content: [{ type: 'strong', content: 'Single Contact Only:' }, ' You may only work for one contact.'] });
        processedChallenges.add(CHALLENGE_IDS.SINGLE_CONTACT);
    }
    
    // Handle other active story challenges
    if (activeStoryCard?.challengeOptions) {
        const activeStoryChallenges = activeStoryCard.challengeOptions.filter(
            (opt: ChallengeOption) => gameState.challengeOptions[opt.id] && !processedChallenges.has(opt.id)
        );
        activeStoryChallenges.forEach(challenge => {
            messages.push({
                source: 'warning',
                title: 'Challenge Active',
                content: [{ type: 'strong', content: challenge.label }]
            });
        });
    }

    return messages;
};

// Helper to recursively flatten structured content to a searchable string
const getTextFromContent = (content: StructuredContent): string => {
    return content.map(part => {
        if (typeof part === 'string') {
            return part;
        }
        if ('content' in part && part.content) { // for strong, action, paragraph, warning-box
            if (typeof part.content === 'string') {
                return part.content;
            }
            if (Array.isArray(part.content)) {
                return getTextFromContent(part.content);
            }
        }
        if ('items' in part && part.items && Array.isArray(part.items)) { // for list, numbered-list, sub-list
            if (part.type !== 'sub-list') { // list, numbered-list
                return (part.items as StructuredContent[]).map(item => getTextFromContent(item)).join(' ');
            }
        }
        return '';
    }).join('');
};

export const getJobSetupDetails = (gameState: GameState, overrides: StepOverrides): JobSetupDetails => {
    const allRules = getResolvedRules(gameState);
    const activeStoryCard = getActiveStoryCard(gameState);
    const showNoJobsMessageFlag = hasRuleFlag(allRules, 'showNoJobsMessage');

    const jobModeRule = allRules.find(r => r.type === 'setJobMode') as SetJobModeRule | undefined;
    const jobDrawMode: JobMode = jobModeRule?.mode || overrides.jobMode || 'standard';
    
    if (hasRuleFlag(allRules, 'customJobDraw')) {
        const messages: JobSetupMessage[] = [];
        if (activeStoryCard?.setupDescription) {
            messages.push({ source: 'story', title: 'Job Draw Instructions', content: [activeStoryCard.setupDescription] });
        }
        // Custom job draw usually implies a story override, so assume it goes in overrideMessages
        return {
            contacts: [], 
            infoMessages: [],
            overrideMessages: messages,
            showStandardContactList: false, 
            isSingleContactChoice: false, 
            totalJobCards: 0,
            jobDrawMode,
            showNoJobsMessage: showNoJobsMessageFlag,
        };
    }
    
    let baseDetails: Omit<JobSetupDetails, 'jobDrawMode' | 'mainContent' | 'mainContentPosition' | 'showNoJobsMessage' | 'primeContactsInstruction'>;
    let primeContactsInstruction: StructuredContent | undefined;

    if (jobDrawMode === 'no_jobs' || jobDrawMode === 'caper_start') {
        const jobModeSource: RuleSourceType = jobModeRule ? jobModeRule.source : 'setupCard';
        const dontPrimeContactsChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
        const details = _handleNoJobsMode(allRules, jobModeSource, dontPrimeContactsChallenge);
        baseDetails = { ...details };
        
        if (!dontPrimeContactsChallenge && allRules.some(r => r.type === 'primeContacts')) {
            primeContactsInstruction = [
              { type: 'paragraph', content: ['Instead of taking Starting Jobs, ', { type: 'strong', content: 'prime the Contact Decks' }, ':'] },
              { type: 'list', items: [['Reveal the top ', { type: 'strong', content: '3 cards' }, ' of each Contact Deck.'], ['Place the revealed Job Cards in their discard piles.']] }
            ];
            // Remove it from messages so it's not duplicated in detailed view
            baseDetails.overrideMessages = baseDetails.overrideMessages.filter(m => m.title !== 'Prime Contact Decks');
        }

    } else {
        const initialContacts = _getInitialContacts(allRules, gameState);
        const contacts = _filterContacts(initialContacts, allRules);
    
        const messages = _generateJobMessages(
            allRules,
            initialContacts,
            activeStoryCard,
            gameState
        );
        
        const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
        const standardContacts = [CONTACT_NAMES.HARKEN, CONTACT_NAMES.BADGER, CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.PATIENCE, CONTACT_NAMES.NISKA];
        const isContactListOverridden = 
            !!jobContactsRule || 
            JSON.stringify(contacts.slice().sort()) !== JSON.stringify(standardContacts.slice().sort());
    
        const isSingleContactChoice = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
        const showStandardContactList = true;
        
        const actualDrawCount = isSingleContactChoice ? 1 : contacts.length;
        const baseKeepCount = 3;
        const finalKeepCount = Math.min(baseKeepCount, actualDrawCount);
    
        const infoMessages = messages.filter(m => m.source === 'info' || m.source === 'warning');
        const overrideMessages = messages.filter(m => m.source !== 'info' && m.source !== 'warning');

        baseDetails = { contacts, infoMessages, overrideMessages, showStandardContactList, isSingleContactChoice, cardsToDraw: finalKeepCount, totalJobCards: contacts.length, isContactListOverridden };
    }

    let caperDrawCount: number | undefined;
    if (jobDrawMode === 'caper_start') {
        caperDrawCount = 1;
    } else {
        const caperBonusRule = [...baseDetails.infoMessages, ...baseDetails.overrideMessages].find(msg => msg.title === 'Caper Bonus');
        if (caperBonusRule) {
            const contentText = getTextFromContent(caperBonusRule.content);
            const match = contentText.match(/Draw (\d+)/i);
            if (match && match[1]) {
                caperDrawCount = parseInt(match[1], 10);
            } else {
                caperDrawCount = 1; // Default to 1 if parsing fails
            }
        }
    }

    const jobStepContentRule = allRules.find(
        (r): r is SetJobStepContentRule => r.type === 'setJobStepContent'
    );
    const mainContent = jobStepContentRule?.content;
    const mainContentPosition = jobStepContentRule?.position || 'before';

    return {
        ...baseDetails,
        caperDrawCount,
        jobDrawMode,
        mainContent,
        mainContentPosition,
        showNoJobsMessage: showNoJobsMessageFlag,
        primeContactsInstruction,
    };
};