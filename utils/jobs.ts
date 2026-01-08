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

const _handleNoJobsMode = (allRules: SetupRule[], jobModeSource: RuleSourceType, dontPrimeContactsChallenge: boolean, activeStoryCard: StoryCardDef | undefined): Omit<JobSetupDetails, 'jobDrawMode'> => {
    const messages: JobSetupMessage[] = [];
    
    // 1. Add any specific "addSpecialRule" rules for the jobs step.
    // For "Down And Out", this adds the "Shared Hand Setup" block.
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

    // 3. Add the main override message from the story or setup card.
    if (jobModeSource === 'story' && activeStoryCard) {
        // "Down and Out" has a setupDescription. This is the primary override text.
        if (activeStoryCard.setupDescription) {
             messages.push({
                source: 'story',
                title: activeStoryCard.title,
                content: [activeStoryCard.setupDescription]
             });
        } 
        // Some older story cards might use noJobsMessage instead.
        else if (activeStoryCard.noJobsMessage) {
            messages.push({
                source: 'story',
                title: activeStoryCard.noJobsMessage.title || activeStoryCard.title,
                content: [{ type: 'paragraph', content: [activeStoryCard.noJobsMessage.description] }]
            });
        }
    } else if (jobModeSource === 'setupCard') {
        // Fallback for setup cards like Browncoat Way
        messages.push({
            source: 'setupCard',
            title: 'Setup Card Override',
            content: [{ type: 'paragraph', content: ["Crews must find work on their own out in the black."] }]
        });
    }
    
    // 4. Deduplicate messages. This is a safeguard in case a specific rule and the 
    // setup description contain identical text.
    const uniqueMessages = messages.reduce((acc, current) => {
        const isDuplicate = acc.some(item => 
            item.title === current.title && 
            JSON.stringify(item.content) === JSON.stringify(current.content)
        );
        if (!isDuplicate) {
            acc.push(current);
        }
        return acc;
    }, [] as JobSetupMessage[]);

    return { contacts: [], messages: uniqueMessages, showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0 };
};

const _getInitialContacts = (allRules: SetupRule[]): string[] => {
    const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
    if (jobContactsRule) {
        return jobContactsRule.contacts;
    }
    
    // Standard setup only uses the five core contacts for the initial job draw,
    // regardless of which expansions are enabled. Expansion contacts are only
    // added if a Setup or Story Card explicitly dictates it via a `setJobContacts` rule.
    const availableContacts = [
        CONTACT_NAMES.HARKEN, 
        CONTACT_NAMES.BADGER, 
        CONTACT_NAMES.AMNON_DUUL, 
        CONTACT_NAMES.PATIENCE, 
        CONTACT_NAMES.NISKA
    ];
    
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

    const jobModeRule = allRules.find(r => r.type === 'setJobMode') as SetJobModeRule | undefined;
    const jobDrawMode: JobMode = jobModeRule?.mode || overrides.jobMode || 'standard';

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
            totalJobCards: 0,
            jobDrawMode,
        };
    }
    
    if (jobDrawMode === 'draft_choice') {
        const jobDraftInstructions: StructuredContent = [
            { type: 'paragraph', content: ["Starting with the last player to choose a Leader, each player chooses 1 Job from 3 different Contacts. Mr. Universe cannot be chosen for these starting Jobs."] }
        ];
    
        const messages: JobSetupMessage[] = [{
            source: 'story',
            title: "Friends in Low Places",
            content: jobDraftInstructions,
        }];
        
        // Note: _getInitialContacts will now correctly return only the base 5.
        // We still need to manually add the expansion contacts for this specific draft mode,
        // as they are explicitly allowed by the story card rule text.
        const baseContacts = _getInitialContacts(allRules);
        const allAvailableContacts = [...baseContacts];

        if (gameState.expansions.kalidasa) {
            allAvailableContacts.push(
                CONTACT_NAMES.LORD_HARROW,
                CONTACT_NAMES.MR_UNIVERSE,
                CONTACT_NAMES.FANTY_MINGO,
                CONTACT_NAMES.MAGISTRATE_HIGGINS
            );
        }

        const finalContacts = allAvailableContacts.filter(c => c !== CONTACT_NAMES.MR_UNIVERSE);
        
        return {
            contacts: finalContacts,
            messages,
            showStandardContactList: true,
            isSingleContactChoice: false,
            totalJobCards: 0,
            jobDrawMode,
        };
    }

    if (jobDrawMode === 'caper_start') {
        const messages: JobSetupMessage[] = [];
        if (activeStoryCard?.setupDescription) {
            messages.push({
                source: 'story',
                title: activeStoryCard.title,
                content: [{ type: 'paragraph', content: [activeStoryCard.setupDescription] }],
            });
        }

        return {
            contacts: [],
            messages,
            showStandardContactList: false,
            isSingleContactChoice: false,
            totalJobCards: 0,
            caperDrawCount: 1,
            jobDrawMode,
        };
    }

    if (jobDrawMode === 'wind_takes_us') {
        const { playerCount } = gameState;
        const isLowPlayerCount = playerCount <= 3;

        const lowPlayerCountInstruction: StructuredContent = [
            { type: 'strong', content: 'For 3 or fewer players, draw 4 Job Cards each.' }
        ];
        const plainLowPlayerCountInstruction: StructuredContent = [
            'For 3 or fewer players, draw 4 Job Cards each.'
        ];
        const highPlayerCountInstruction: StructuredContent = [
            { type: 'strong', content: 'For 4 or more players, draw 3 Job Cards each.' }
        ];
        const plainHighPlayerCountInstruction: StructuredContent = [
            'For 4 or more players, draw 3 Job Cards each.'
        ];

        const content: StructuredContent = [
            { type: 'paragraph', content: ["Each player draws jobs from a single Contact Deck of their choice:"] },
            {
              type: 'list',
              items: [
                isLowPlayerCount ? lowPlayerCountInstruction : plainLowPlayerCountInstruction,
                !isLowPlayerCount ? highPlayerCountInstruction : plainHighPlayerCountInstruction
              ]
            },
            { type: 'paragraph', content: ['Place a ', { type: 'strong', content: 'Goal Token' }, ' at each Job\'s Drop Off / Target / Destination Sector.'] },
            { type: 'paragraph', content: ['After placing tokens, return all drawn Job cards to their Contact Decks and reshuffle the decks.'] },
            { type: 'paragraph', content: [{ type: 'strong', content: 'Do not deal any other Starting Jobs.' }] }
        ];

        const message: JobSetupMessage = {
            source: 'story',
            title: "The Winds of Fate",
            content: content,
        };

        return { contacts: [], messages: [message], showStandardContactList: false, isSingleContactChoice: false, totalJobCards: 0, jobDrawMode };
    }

    if (jobDrawMode === 'no_jobs') {
        const jobModeSource: RuleSourceType = jobModeRule ? jobModeRule.source : 'setupCard';
        const dontPrimeContactsChallenge = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
        const details = _handleNoJobsMode(allRules, jobModeSource, dontPrimeContactsChallenge, activeStoryCard);
        
        return { ...details, jobDrawMode };
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
    
    // Find Caper Bonus rule to set count for the dedicated UI component.
    // The original rule is preserved in the 'messages' array.
    let caperDrawCount: number | undefined;
    const caperBonusRule = messages.find(msg => msg.title === 'Caper Bonus');
    if (caperBonusRule) {
        const contentText = getTextFromContent(caperBonusRule.content);
        const match = contentText.match(/Draw (\d+)/i);
        if (match && match[1]) {
            caperDrawCount = parseInt(match[1], 10);
        } else {
            caperDrawCount = 1; // Default to 1 if parsing fails
        }
    }
    
    // An override has occurred if the final contact list is different from the 5 standard contacts,
    // or if the initial list was already different due to a 'setJobContacts' rule.
    const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
    const standardContacts = [CONTACT_NAMES.HARKEN, CONTACT_NAMES.BADGER, CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.PATIENCE, CONTACT_NAMES.NISKA];
    const isContactListOverridden = 
        !!jobContactsRule || 
        JSON.stringify(contacts.slice().sort()) !== JSON.stringify(standardContacts.slice().sort());

    return { contacts, messages, showStandardContactList: true, isSingleContactChoice: isSingleContactChallenge, cardsToDraw: 3, totalJobCards: contacts.length, caperDrawCount, isContactListOverridden, jobDrawMode };
};