
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
    SetJobContactsRule,
    SpecialRule,
    ChallengeOption,
    SetJobStepContentRule,
    JobContactListConfig
} from '../types/index';
import { getResolvedRules } from './selectors/rules';
import { CONTACT_NAMES, CHALLENGE_IDS } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';

const _getJobRulesMessages = (allRules: SetupRule[]): JobSetupMessage[] => {
    const messages: JobSetupMessage[] = [];
    allRules.forEach(rule => {
        // Explicit Text Rules (addSpecialRule)
        if (rule.type === 'addSpecialRule' && rule.category === 'jobs') {
            if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
                messages.push({ source: rule.source as SpecialRule['source'], ...rule.rule });
            }
        }
    });
    return messages;
};

const _getInitialContacts = (allRules: SetupRule[], gameState: GameState): string[] => {
    const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
    
    const coreContacts = [
        CONTACT_NAMES.HARKEN, 
        CONTACT_NAMES.BADGER, 
        CONTACT_NAMES.AMNON_DUUL, 
        CONTACT_NAMES.PATIENCE, 
        CONTACT_NAMES.NISKA
    ];

    if (jobContactsRule) {
        if (jobContactsRule.preset === 'all') {
            const allContacts = [...coreContacts];
            // Add Expansion Contacts
            if (gameState.expansions.kalidasa) {
                allContacts.push(
                    CONTACT_NAMES.LORD_HARROW,
                    CONTACT_NAMES.MR_UNIVERSE,
                    CONTACT_NAMES.FANTY_MINGO,
                    CONTACT_NAMES.MAGISTRATE_HIGGINS
                );
            }
            // Future expansions can be added here
            return allContacts;
        } else if (jobContactsRule.preset === 'custom' || jobContactsRule.contacts?.length > 0) {
            return jobContactsRule.contacts;
        }
    }
    
    // Default to core contacts
    return coreContacts;
};

const _filterContacts = (contacts: string[], allRules: SetupRule[]): string[] => {
    let filtered = [...contacts];

    // Identify all contacts forbidden by any active rule
    const forbiddenRules = allRules.filter(r => r.type === 'forbidContact') as ForbidContactRule[];
    const forbiddenContacts = new Set(forbiddenRules.map(r => r.contact));
    
    if (forbiddenContacts.size > 0) {
        filtered = filtered.filter(c => !forbiddenContacts.has(c));
    }

    const allowedContactsRule = allRules.find(r => r.type === 'allowContacts') as AllowContactsRule | undefined;
    if (allowedContactsRule?.contacts?.length) {
        filtered = allowedContactsRule.contacts;
    }
    
    return filtered;
};

// Helper to recursively flatten structured content to a searchable string
const getTextFromContent = (content: StructuredContent): string => {
    return content.map(part => {
        if (typeof part === 'string') {
            return part;
        }
        if ('content' in part && part.content) {
            if (typeof part.content === 'string') {
                return part.content;
            }
            if (Array.isArray(part.content)) {
                return getTextFromContent(part.content);
            }
        }
        if ('items' in part && part.items && Array.isArray(part.items)) {
            if (part.type !== 'sub-list') {
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
    const { jobStepPhase = 'job_draw' } = overrides;

    let contactList: JobContactListConfig | null = null;
    let caperDraw: number | null = null;
    let primeInstruction: StructuredContent | null = null;
    
    // Collect all messages first
    const messages = _getJobRulesMessages(allRules);
    
    // Handle specific challenge warnings
    const processedChallenges = new Set<string>();
    if (gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT]) {
        messages.push({ source: 'warning', title: 'Challenge Active', content: [{ type: 'strong', content: 'Single Contact Only:' }, ' You may only work for one contact.'] });
        processedChallenges.add(CHALLENGE_IDS.SINGLE_CONTACT);
    }
    
    if (gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS]) {
         messages.push({
            source: 'warning',
            title: 'Challenge Active',
            content: [{ type: 'paragraph', content: [{ type: 'strong', content: 'Do not prime the Contact Decks.' }, ' (Challenge Override)'] }]
        });
    }

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

    // Determine Main Content
    const jobStepContentRule = allRules.find(
        (r): r is SetJobStepContentRule => r.type === 'setJobStepContent'
    );
    const mainContent = jobStepContentRule?.content || null;
    const mainContentPosition = jobStepContentRule?.position || 'before';

    if (jobDrawMode === 'hide_jobs') {
        // In 'hide_jobs' mode, we intentionally do not generate the "No Starting Jobs" message
        // or the contact list. This mode is used when a story completely replaces the concept
        // of starting jobs or handles instructions manually via other rules/components.
        
        // We still allow 'mainContent' (via setJobStepContent) and manual rule messages to pass through,
        // but default warnings are suppressed.
        
    } else if (jobDrawMode !== 'no_jobs' && jobDrawMode !== 'caper_start') {
        // Logic for Standard/Shared Hand/Draft modes
        const initialContacts = _getInitialContacts(allRules, gameState);
        const contacts = _filterContacts(initialContacts, allRules);

        // Generate contact restriction warnings if needed
        if (jobStepPhase !== 'deck_setup') {
            const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
            // The compiler may believe 'all' is not in preset type, causing an overlap error. 
            // We cast to string to safely perform the check.
            if (jobContactsRule && (jobContactsRule.preset as string) !== 'all') {
                // Find all forbidden contacts that might cause a conflict with the initial contact list
                const forbiddenRules = allRules.filter(r => r.type === 'forbidContact') as ForbidContactRule[];
                const conflicts = forbiddenRules
                    .map(r => r.contact)
                    .filter(c => initialContacts.includes(c));
                
                if (conflicts.length > 0) {
                    const remainingContacts = initialContacts.filter(c => !conflicts.includes(c));
                    const conflictText = conflicts.length === 1 ? conflicts[0] : conflicts.join(', ');
                    
                    messages.push({ 
                        source: 'setupCard', 
                        title: 'Setup Card Override', 
                        content: [
                            { type: 'strong', content: 'Limited Contacts.' },
                            ` This setup card normally draws from ${initialContacts.join(', ')}.`, 
                            { 
                                type: 'warning-box', 
                                content: [
                                    `Story Card Conflict: `, 
                                    { type: 'strong', content: conflictText }, 
                                    ` unavailable. Draw from `,
                                    { type: 'strong', content: remainingContacts.join(' and ') },
                                    ` only.`
                                ] 
                            }
                        ]
                    });
                } else if (jobContactsRule.preset !== 'all') {
                    // Only show "Limited Contacts" message if we aren't using "all" mode,
                    // as "all" implies the story specifically wants to expand options, not limit them.
                    messages.push({ 
                        source: 'setupCard', 
                        title: 'Limited Contacts', 
                        content: [
                            { type: 'strong', content: 'Limited Contacts.' },
                            ` Starting Jobs are drawn only from ${initialContacts.join(', ')}.`
                        ]
                    });
                }
            }
        }
        
        // Filter messages by phase
        const relevantMessages = messages.filter(msg => {
            const rulePhase = msg.flags?.find(f => f.startsWith('phase_'));
            if (rulePhase) {
                if (rulePhase === 'phase_deck_setup' && jobStepPhase !== 'deck_setup') return false;
                if (rulePhase === 'phase_job_draw' && jobStepPhase !== 'job_draw') return false;
            }
            return true;
        });
        
        // Populate Contact List Config
        if (jobStepPhase !== 'deck_setup') {
            const isSingleContactChoice = !!gameState.challengeOptions[CHALLENGE_IDS.SINGLE_CONTACT];
            const actualDrawCount = isSingleContactChoice ? 1 : contacts.length;
            const baseKeepCount = 3;
            let finalKeepCount = Math.min(baseKeepCount, actualDrawCount);
            
            const isSharedHand = jobDrawMode === 'shared_hand';
            const isDraftChoice = jobDrawMode === 'draft_choice';
            
            if (isDraftChoice) {
                 finalKeepCount = 3;
            }
            
            let description = '';

            // Use description from data if provided, otherwise fallback to defaults
            if (jobModeRule?.jobDescription) {
                 description = jobModeRule.jobDescription;
            } else {
                 const keepText = finalKeepCount >= actualDrawCount && actualDrawCount > 0
                    ? 'any of the Job Cards drawn.'
                    : `up to ${finalKeepCount} Job Cards.`;
                 
                 const drawText = isSingleContactChoice
                    ? `Choose ONE contact deck below.`
                    : `Draw one Job Card from each Contact Deck listed below.`;
                    
                 description = `${drawText} You may keep ${keepText}`;
            }

            const standardContacts = [CONTACT_NAMES.HARKEN, CONTACT_NAMES.BADGER, CONTACT_NAMES.AMNON_DUUL, CONTACT_NAMES.PATIENCE, CONTACT_NAMES.NISKA];
            const isOverridden = JSON.stringify(contacts.slice().sort()) !== JSON.stringify(standardContacts.slice().sort());

            contactList = {
                title: isSharedHand ? 'Shared Hand Draw' : isDraftChoice ? 'Draft Starting Jobs' : 'Starting Job Draw',
                description,
                contacts,
                cardsToDraw: finalKeepCount,
                isSingleContactChoice,
                isSharedHand,
                isOverridden
            };
        }

        // Replace local 'messages' with filtered ones for return
        messages.length = 0;
        messages.push(...relevantMessages);

    } else {
        // Mode is no_jobs or caper_start
        // Add generic "No Starting Jobs" message if the mode is specifically 'no_jobs'.
        // If content is manually overridden via rules, this message is STILL shown to prevent ambiguity.
        // Use 'hide_jobs' mode if suppression is required.
        
        if (jobDrawMode === 'no_jobs') {
            const jobModeSource: RuleSourceType = jobModeRule ? jobModeRule.source : 'setupCard';
            const validSource = (['story', 'setupCard'].includes(jobModeSource)) ? jobModeSource as 'story' | 'setupCard' : 'setupCard';
             
            messages.push({
                source: validSource,
                title: 'No Starting Jobs',
                content: [{ type: 'paragraph', content: ["Crews must find work on their own out in the black."] }]
            });
        }
        
        // Priming
        const dontPrime = !!gameState.challengeOptions[CHALLENGE_IDS.DONT_PRIME_CONTACTS];
        if (!dontPrime && allRules.some(r => r.type === 'primeContacts')) {
             primeInstruction = [
              { type: 'paragraph', content: ['Instead of taking Starting Jobs, ', { type: 'strong', content: 'prime the Contact Decks' }, ':'] },
              { type: 'list', items: [['Reveal the top ', { type: 'strong', content: '3 cards' }, ' of each Contact Deck.'], ['Place the revealed Job Cards in their discard piles.']] }
            ];
        }
    }

    // Caper Logic
    if (jobDrawMode === 'caper_start') {
        caperDraw = 1;
    } else {
        const caperBonusRule = messages.find(msg => msg.title === 'Caper Bonus');
        if (caperBonusRule) {
            const contentText = getTextFromContent(caperBonusRule.content);
            const match = contentText.match(/Draw (\d+)/i);
            if (match && match[1]) {
                caperDraw = parseInt(match[1], 10);
            } else {
                caperDraw = 1;
            }
        }
    }
    
    const infoMessages = messages.filter(m => m.source === 'info' || m.source === 'warning');
    const overrideMessages = messages.filter(m => m.source !== 'info' && m.source !== 'warning');

    return {
        contactList,
        mainContent,
        mainContentPosition,
        caperDraw,
        primeInstruction,
        infoMessages,
        overrideMessages
    };
};
