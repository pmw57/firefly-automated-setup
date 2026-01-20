
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
import { getResolvedRules, hasRuleFlag } from './selectors/rules';
import { CONTACT_NAMES, CHALLENGE_IDS } from '../data/ids';
import { getActiveStoryCard } from './selectors/story';

const _getJobRulesMessages = (allRules: SetupRule[]): JobSetupMessage[] => {
    const messages: JobSetupMessage[] = [];
    allRules.forEach(rule => {
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
    if (jobContactsRule) {
        return jobContactsRule.contacts;
    }
    
    // Standard setup only uses the five core contacts for the initial job draw.
    const availableContacts = [
        CONTACT_NAMES.HARKEN, 
        CONTACT_NAMES.BADGER, 
        CONTACT_NAMES.AMNON_DUUL, 
        CONTACT_NAMES.PATIENCE, 
        CONTACT_NAMES.NISKA
    ];

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
    
    if (hasRuleFlag(allRules, 'useAllContactsForJobDraft')) {
        filtered = filtered.filter(c => c !== CONTACT_NAMES.MR_UNIVERSE);
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

    // Logic for Standard/Shared Hand/Draft modes
    if (jobDrawMode !== 'no_jobs' && jobDrawMode !== 'caper_start') {
        const initialContacts = _getInitialContacts(allRules, gameState);
        const contacts = _filterContacts(initialContacts, allRules);

        // Generate contact restriction warnings if needed
        if (jobStepPhase !== 'deck_setup') {
            const jobContactsRule = allRules.find(r => r.type === 'setJobContacts') as SetJobContactsRule | undefined;
            if (jobContactsRule) {
                const forbiddenContact = (allRules.find(r => r.type === 'forbidContact') as ForbidContactRule | undefined)?.contact;
                const isConflict = forbiddenContact && initialContacts.includes(forbiddenContact);
                
                if (isConflict) {
                    const remainingContacts = initialContacts.filter(c => c !== forbiddenContact);
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
                                    { type: 'strong', content: forbiddenContact }, 
                                    ` is unavailable. Draw from `,
                                    { type: 'strong', content: remainingContacts.join(' and ') },
                                    ` only.`
                                ] 
                            }
                        ]
                    });
                } else {
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
        // (Existing logic: some rules are phase_deck_setup only)
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
            const finalKeepCount = Math.min(baseKeepCount, actualDrawCount);
            
            const isSharedHand = jobDrawMode === 'shared_hand';
            
            let description = '';
            if (isSharedHand) {
                 description = "Place one Job Card from each Contact Deck listed below face up on top of their Contact's deck.";
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
                title: isSharedHand ? 'Shared Hand Draw' : 'Starting Job Draw',
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
        // Add generic "No Starting Jobs" message if not already covered by rules
        const jobModeSource: RuleSourceType = jobModeRule ? jobModeRule.source : 'setupCard';
        
        // If story provides no specific rule about job removal, we add a default one if it was triggered by a setup card.
        // This maintains compatibility with Setup Cards that set "no_jobs".
        if (jobModeSource === 'setupCard' && !messages.some(m => m.source === 'setupCard')) {
             messages.push({
                source: 'setupCard',
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
            
            // Add a message for visibility in the info/override list too if preferred, 
            // but we have a dedicated UI block for it now.
            // We'll skip adding a duplicate message here since `primeInstruction` is returned.
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
    
    // Deduplicate messages
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
