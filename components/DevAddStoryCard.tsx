
import React, { useState, useEffect, useMemo } from 'react';
import { StoryCardDef, ExpansionId, SetupRule, StoryCardGoal, ChallengeOption, JobMode, NavMode, PrimeMode, DraftMode, LeaderSetupMode, AllianceSetupMode, ResourceType, EffectMethod, RuleSourceType, ModifyResourceRule, AddFlagRule, AddSpecialRule, ModifyPrimeRule, AllowContactsRule, PrimeContactsRule, CreateAlertTokenStackRule, BypassDraftRule, SetPlayerBadgesRule, SetJobStepContentRule, AddBoardComponentRule } from '../types/index';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { STORY_CARDS } from '../data/storyCards';
import { StoryCardGridItem } from './story/StoryCardGridItem';
import { CONTACT_NAMES } from '../data/ids';

// --- Local Storage ---
const DEV_STORY_CARD_DRAFT_KEY = 'firefly_dev_story_card_draft';

// --- Visual Rule Builder: Configuration & Components ---

const JOB_MODES: JobMode[] = ['standard', 'no_jobs', 'hide_jobs', 'times_jobs', 'high_alert_jobs', 'buttons_jobs', 'awful_jobs', 'rim_jobs', 'draft_choice', 'caper_start', 'wind_takes_us', 'shared_hand'];
const NAV_MODES: NavMode[] = ['standard', 'browncoat', 'rim', 'flying_solo', 'clearer_skies', 'standard_reshuffle'];
const PRIME_MODES: PrimeMode[] = ['standard', 'blitz'];
const DRAFT_MODES: DraftMode[] = ['standard', 'browncoat'];
const LEADER_SETUP_MODES: LeaderSetupMode[] = ['standard', 'wanted'];
const ALLIANCE_SETUP_MODES: AllianceSetupMode[] = ['standard', 'awful_crowded', 'no_alerts'];
const RESOURCE_TYPES: ResourceType[] = ['credits', 'fuel', 'parts', 'warrants', 'goalTokens'];
const EFFECT_METHODS: EffectMethod[] = ['set', 'add', 'disable'];
const SHIP_PLACEMENT_LOCATIONS = ['persephone', 'londinium', 'outside_alliance'];
const SPECIAL_RULE_CATEGORIES: AddSpecialRule['category'][] = [
    'jobs', 
    'allianceReaver', 
    'draft', 
    'nav', 
    'prime', 
    'resources', 
    'soloTimer', 
    'goal',
    'draft_panel',
    'draft_ships',
    'draft_placement',
    'prime_panel',
    'setup_selection',
    'pressures_high'
];
const DISTRIBUTION_TYPES = ['fixed', 'all_supply_planets', 'region'];
const COMPONENT_TYPES = ['contraband', 'alert_token'];


interface RuleParam {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox';
  options?: string[];
  condition?: (rule: Partial<SetupRule>) => boolean;
}

interface RuleDefinition {
  label: string;
  params: RuleParam[];
  default: () => Partial<SetupRule>;
}

const RULE_DEFINITIONS: Record<string, RuleDefinition> = {
  // Job Rules
  setJobMode: { label: 'Set Job Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: JOB_MODES }], default: () => ({ type: 'setJobMode', mode: 'standard' }) },
  setJobContacts: { label: 'Set Specific Job Contacts', params: [{ name: 'contacts', label: 'Contacts (comma-sep)', type: 'text' }], default: () => ({ type: 'setJobContacts', contacts: [] }) },
  allowContacts: { label: 'Allow Only Specific Contacts', params: [{ name: 'contacts', label: 'Contacts (comma-sep)', type: 'text' }], default: () => ({ type: 'allowContacts', contacts: [] } as Partial<AllowContactsRule>) },
  forbidContact: { label: 'Forbid Contact', params: [{ name: 'contact', label: 'Contact', type: 'select', options: Object.values(CONTACT_NAMES) }], default: () => ({ type: 'forbidContact', contact: CONTACT_NAMES.HARKEN }) },
  primeContacts: { label: 'Prime Contact Decks', params: [], default: () => ({ type: 'primeContacts' } as Partial<PrimeContactsRule>) },
  setJobStepContent: {
      label: 'Set Job Step Content',
      params: [
          { name: 'position', label: 'Position', type: 'select', options: ['before', 'after'] },
          { name: 'content', label: 'Content (JSON StructuredContent)', type: 'textarea' }
      ],
      default: () => ({ type: 'setJobStepContent', position: 'before', content: [] } as Partial<SetJobStepContentRule>)
  },
  
  // Nav Rules
  setNavMode: { label: 'Set Nav Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: NAV_MODES }], default: () => ({ type: 'setNavMode', mode: 'standard' }) },

  // Prime Rules
  setPrimeMode: { label: 'Set Prime Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: PRIME_MODES }], default: () => ({ type: 'setPrimeMode', mode: 'standard' }) },
  modifyPrime: {
    label: 'Modify Prime the Pump',
    params: [
      { name: 'multiplier', label: 'Set Multiplier (e.g., 2)', type: 'number' },
      { name: 'modifier', label: 'Modifier Object (JSON)', type: 'textarea' }
    ],
    default: () => ({ type: 'modifyPrime', multiplier: 2 } as Partial<ModifyPrimeRule>)
  },
  
  // Draft Rules
  setDraftMode: { label: 'Set Draft Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: DRAFT_MODES }], default: () => ({ type: 'setDraftMode', mode: 'standard' }) },
  setLeaderSetup: { label: 'Set Leader Setup', params: [{ name: 'mode', label: 'Mode', type: 'select', options: LEADER_SETUP_MODES }], default: () => ({ type: 'setLeaderSetup', mode: 'standard' }) },
  bypassDraft: {
    label: 'Bypass Draft',
    params: [{ name: 'reason', label: 'Reason', type: 'text' }],
    default: () => ({ type: 'bypassDraft', reason: 'Assigned Ship & Crew' } as Partial<BypassDraftRule>)
  },
  setPlayerBadges: {
    label: 'Set Player Badges',
    params: [{ name: 'badges', label: 'Badges Map (JSON: {0:"Role"})', type: 'textarea' }],
    default: () => ({ type: 'setPlayerBadges', badges: { 0: "Commander" } } as Partial<SetPlayerBadgesRule>)
  },
  
  // Alliance / Reaver Rules
  setAllianceMode: { label: 'Set Alliance Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: ALLIANCE_SETUP_MODES }], default: () => ({ type: 'setAllianceMode', mode: 'standard' }) },
  setAlliancePlacement: { label: 'Set Alliance Placement', params: [{ name: 'placement', label: 'Placement Text', type: 'text' }], default: () => ({ type: 'setAlliancePlacement', placement: '' }) },
  createAlertTokenStack: { label: 'Create Alert Token Stack', params: [{ name: 'multiplier', label: 'Multiplier (per player)', type: 'number' }], default: () => ({ type: 'createAlertTokenStack', multiplier: 1 } as Partial<CreateAlertTokenStackRule>) },
  addBoardComponent: {
      label: 'Add Board Component',
      params: [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'component', label: 'Component Type', type: 'select', options: COMPONENT_TYPES },
          { name: 'count', label: 'Count', type: 'number' },
          { name: 'distribution', label: 'Distribution', type: 'select', options: DISTRIBUTION_TYPES },
          { name: 'targetRegion', label: 'Target Region (if distribution=region)', type: 'text', condition: (r) => (r as Partial<AddBoardComponentRule>).distribution === 'region' },
          { name: 'locations', label: 'Locations (Specific List - comma sep)', type: 'text', condition: (r) => !(r as Partial<AddBoardComponentRule>).distribution || (r as Partial<AddBoardComponentRule>).distribution === 'fixed' },
          { name: 'locationTitle', label: 'Location Title (Optional Override)', type: 'text' },
          { name: 'locationSubtitle', label: 'Location Subtitle (Optional Override)', type: 'text' },
          { name: 'icon', label: 'Icon (Emoji)', type: 'text' }
      ],
      default: () => ({ type: 'addBoardComponent', title: 'New Component', component: 'contraband', count: 1 } as Partial<AddBoardComponentRule>)
  },

  // General / Misc Rules
  setShipPlacement: { label: 'Set Ship Placement', params: [{ name: 'location', label: 'Location', type: 'select', options: SHIP_PLACEMENT_LOCATIONS }], default: () => ({ type: 'setShipPlacement', location: 'persephone' }) },
  modifyResource: {
    label: 'Modify Resource',
    params: [
      { name: 'resource', label: 'Resource', type: 'select', options: RESOURCE_TYPES },
      { name: 'method', label: 'Method', type: 'select', options: EFFECT_METHODS },
      { name: 'value', label: 'Value', type: 'number', condition: (r: Partial<SetupRule>) => (r as Partial<ModifyResourceRule>).method !== 'disable' },
      { name: 'description', label: 'Description', type: 'text' },
    ],
    default: () => ({ type: 'modifyResource', resource: 'credits', method: 'add', value: 0, description: '' })
  },
  addFlag: {
    label: 'Add Flag',
    params: [
      { name: 'flag', label: 'Flag Name', type: 'text' },
      { name: 'reaverShipCount', label: 'Reaver Ship Count (Optional)', type: 'number', condition: (r: Partial<SetupRule>) => (r as Partial<AddFlagRule>).flag === 'huntForTheArcReaverPlacement' }
    ],
    default: () => ({ type: 'addFlag', flag: '' })
  },
  addSpecialRule: {
    label: 'Add Special Rule',
    params: [
      { name: 'category', label: 'Category', type: 'select', options: SPECIAL_RULE_CATEGORIES },
      { name: 'rule', label: 'Rule Object (JSON)', type: 'textarea' }
    ],
    default: () => ({ type: 'addSpecialRule', category: 'goal', rule: { title: 'New Rule', content: ['Description here.'] } } as Partial<AddSpecialRule>)
  },
};


const RuleInput: React.FC<{ param: RuleParam, value: unknown, onChange: (val: string | number | boolean) => void }> = ({ param, value, onChange }) => {
    const commonProps = "w-full bg-gray-900 border border-gray-700 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500";
    if (param.type === 'select') {
        return <select className={commonProps} value={String(value ?? '')} onChange={(e) => onChange(e.target.value)}>{param.options?.map(o => <option key={o} value={o}>{o}</option>)}</select>;
    }
    if (param.type === 'number') {
        return <input type="number" className={commonProps} value={Number(value ?? 0)} onChange={(e) => onChange(parseInt(e.target.value, 10))} />;
    }
    if (param.type === 'checkbox') {
        return <input type="checkbox" className="h-4 w-4" checked={!!value} onChange={(e) => onChange(e.target.checked)} />;
    }
    if (param.type === 'textarea') {
        const textValue = typeof value === 'object' && value !== null ? JSON.stringify(value, null, 2) : String(value ?? '');
        return <textarea className={commonProps} rows={4} value={textValue} onChange={(e) => onChange(e.target.value)} />;
    }
    
    const inputValue = Array.isArray(value) ? value.join(', ') : String(value ?? '');
    return <input type="text" className={commonProps} value={inputValue} onChange={(e) => onChange(e.target.value)} />;
};

const RuleEditor: React.FC<{ rule: Partial<SetupRule>, index: number, onUpdate: (index: number, newRule: Partial<SetupRule>) => void, onRemove: (index: number) => void }> = ({ rule, index, onUpdate, onRemove }) => {
  const definition = RULE_DEFINITIONS[rule.type!];
  if (!definition) return <div className="text-red-500 text-xs p-2 bg-red-900/50 rounded">Unknown rule type: {rule.type}</div>;
  
  const handleFieldChange = (name: string, value: string | number | boolean) => {
    onUpdate(index, { ...rule, [name]: value });
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h5 className="font-bold text-sm text-cyan-400">{definition.label}</h5>
        <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-400 font-bold text-xl">&times;</button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {definition.params.map(param => {
          if (param.condition && !param.condition(rule)) return null;
          return (
            <div key={param.name} className={definition.params.length <= 2 && param.type !== 'select' ? 'col-span-2' : ''}>
              <label className="text-xs text-gray-400">{param.label}</label>
              <RuleInput param={param} value={(rule as Record<string, unknown>)[param.name]} onChange={(val) => handleFieldChange(param.name, val)} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const VisualRuleBuilder: React.FC<{ rules: Partial<SetupRule>[], onRulesChange: (rules: Partial<SetupRule>[]) => void }> = ({ rules, onRulesChange }) => {
  const [newRuleType, setNewRuleType] = useState(Object.keys(RULE_DEFINITIONS)[0]);

  const addRule = () => {
    const definition = RULE_DEFINITIONS[newRuleType];
    if (definition) {
      onRulesChange([...rules, definition.default()]);
    }
  };

  const updateRule = (index: number, newRule: Partial<SetupRule>) => {
    const newRules = [...rules];
    let processedRule = newRule;
    
    // Auto-process certain string lists back to arrays for the object model
    if (processedRule.type === 'setJobContacts' || processedRule.type === 'allowContacts') {
      const contactsValue = processedRule.contacts as unknown;
      if (typeof contactsValue === 'string') {
        processedRule = {
          ...processedRule,
          contacts: contactsValue.split(',').map((s: string) => s.trim()).filter(Boolean),
        };
      }
    } else if (processedRule.type === 'addBoardComponent') {
        const locationsVal = (processedRule as Partial<AddBoardComponentRule>).locations;
        if (typeof locationsVal === 'string') {
             processedRule = {
                 ...processedRule,
                 locations: (locationsVal as string).split(',').map((s: string) => s.trim()).filter(Boolean)
             } as Partial<SetupRule>;
        }
    }
    
    // Auto-parse JSON fields
    const jsonFields = ['rule', 'modifier', 'badges', 'content'];
    jsonFields.forEach(field => {
        const ruleAsRecord = processedRule as Record<string, unknown>;
        if (ruleAsRecord[field] && typeof ruleAsRecord[field] === 'string') {
            try {
                const parsed = JSON.parse(ruleAsRecord[field] as string);
                processedRule = { ...processedRule, [field]: parsed };
            } catch (e) {
                // Keep as string if invalid JSON to allow editing
            }
        }
    });

    newRules[index] = processedRule;
    onRulesChange(newRules);
  };
  
  const removeRule = (index: number) => {
    onRulesChange(rules.filter((_, i) => i !== index));
  };
  
  return (
    <div className="space-y-3">
      {rules.map((rule, index) => (
        <RuleEditor key={index} rule={rule} index={index} onUpdate={updateRule} onRemove={removeRule} />
      ))}
      <div className="flex gap-2 pt-2 border-t border-gray-700">
        <select value={newRuleType} onChange={(e) => setNewRuleType(e.target.value)} className="flex-1 w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {Object.entries(RULE_DEFINITIONS).map(([type, { label }]) => <option key={type} value={type}>{label}</option>)}
        </select>
        <button onClick={addRule} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm">Add Rule</button>
      </div>
    </div>
  );
};

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);

// --- Main Component ---
interface DevAddStoryCardProps {
    onClose: () => void;
}

const ratingLabels = [
    "Not Rated",
    "0 stars: Dev/Not Ready",
    "1 star: Draft/Prototype",
    "2 stars: Experimental",
    "3 stars: Stable/Playtested",
    "4 stars: Highly Recommended",
    "5 stars: Essential"
];

const getInitialState = () => ({
    story: {
        title: '',
        intro: '',
        isSolo: false,
        isCoOp: false,
        isPvP: false,
        goals: [],
        challengeOptions: [],
        additionalRequirements: [],
        // Explicitly define all clearable fields for a robust reset
        setupDescription: '',
        sourceUrl: '',
        requiredExpansion: undefined,
        rating: undefined,
        sortOrder: undefined,
    } as Partial<StoryCardDef>,
    rules: [] as Partial<SetupRule>[],
});

export const DevAddStoryCard: React.FC<DevAddStoryCardProps> = ({ onClose }) => {
    const [story, setStory] = useState<Partial<StoryCardDef>>(getInitialState().story);
    const [rules, setRules] = useState<Partial<SetupRule>[]>(getInitialState().rules);
    const [copyButtonText, setCopyButtonText] = useState('Copy JSON');
    const [cardToLoad, setCardToLoad] = useState('');
    // Add a key to force re-mounting of the VisualRuleBuilder on clear
    const [builderKey, setBuilderKey] = useState(0);

    const sortedStoryCardsForDropdown = useMemo(() => 
        [...STORY_CARDS].sort((a, b) => a.title.localeCompare(b.title)), 
    []);

    // Load draft from local storage on mount
    useEffect(() => {
        try {
            const savedDraft = localStorage.getItem(DEV_STORY_CARD_DRAFT_KEY);
            if (savedDraft) {
                const { story: savedStory, rules: savedRules } = JSON.parse(savedDraft);
                setStory(savedStory);
                setRules(savedRules);
            }
        } catch (error) {
            console.error("Failed to load story draft from local storage", error);
        }
    }, []);

    // Save draft to local storage on change (debounced)
    useEffect(() => {
        const handler = setTimeout(() => {
            try {
                const draft = { story, rules };
                localStorage.setItem(DEV_STORY_CARD_DRAFT_KEY, JSON.stringify(draft));
            } catch (error) {
                console.error("Failed to save story draft to local storage", error);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [story, rules]);
    
    // Load selected card from dropdown
    useEffect(() => {
        if (cardToLoad) {
            const cardData = STORY_CARDS.find(c => c.title === cardToLoad);
            if (cardData) {
                const { rules: cardRules, ...cardStoryData } = cardData;
                setStory(cardStoryData);
                // Deep copy rules to prevent accidental mutation
                setRules(cardRules ? JSON.parse(JSON.stringify(cardRules)) : []);
            }
        }
    }, [cardToLoad]);
    
    const clearForm = () => {
        const { story: initialStory, rules: initialRules } = getInitialState();
        setStory(initialStory);
        setRules(initialRules);
        setCardToLoad('');
        setCopyButtonText('Copy JSON');
        // Incrementing the key will force VisualRuleBuilder to re-mount with fresh state
        setBuilderKey(prev => prev + 1); 
        localStorage.removeItem(DEV_STORY_CARD_DRAFT_KEY);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            if (name === 'isSolo' || name === 'isCoOp' || name === 'isPvP') {
                setStory(prev => ({ ...prev, [name]: checked }));
            }
        } else if (name === 'rating') {
            const ratingValue = parseInt(value, 10);
            setStory(prev => ({
                ...prev,
                rating: ratingValue === -1 ? undefined : ratingValue,
            }));
        } else if (name === 'sortOrder') {
            setStory(prev => ({
                ...prev,
                sortOrder: value ? parseInt(value, 10) : undefined,
            }));
        } else {
            const finalValue = name === 'requiredExpansion' && value === '' ? undefined : value;
            setStory(prev => ({ ...prev, [name]: finalValue }));
        }
    };
    
    const handleAdditionalReqChange = (id: ExpansionId) => {
        setStory(prev => {
            const currentReqs = prev.additionalRequirements || [];
            if (currentReqs.includes(id)) {
                return { ...prev, additionalRequirements: currentReqs.filter(reqId => reqId !== id) };
            } else {
                return { ...prev, additionalRequirements: [...currentReqs, id] };
            }
        });
    };

    const handleListChange = (
        listName: 'goals' | 'challengeOptions',
        index: number,
        field: keyof StoryCardGoal | keyof ChallengeOption,
        value: string
    ) => {
        setStory(prev => {
            if (listName === 'goals' && (field === 'title' || field === 'description')) {
                const newList = [...(prev.goals || [])];
                const item = newList[index] || { title: '', description: '' };
                newList[index] = { ...item, [field]: value };
                return { ...prev, goals: newList };
            }
            if (listName === 'challengeOptions' && (field === 'id' || field === 'label')) {
                const newList = [...(prev.challengeOptions || [])];
                const item = newList[index] || { id: '', label: '' };
                newList[index] = { ...item, [field]: value };
                return { ...prev, challengeOptions: newList };
            }
            return prev;
        });
    };

    const addListItem = (listName: 'goals' | 'challengeOptions') => {
        setStory(prev => {
            if (listName === 'goals') {
                const newItem: StoryCardGoal = { title: '', description: '' };
                return { ...prev, goals: [...(prev.goals || []), newItem] };
            } else { // challengeOptions
                const newItem: ChallengeOption = { id: '', label: '' };
                return { ...prev, challengeOptions: [...(prev.challengeOptions || []), newItem] };
            }
        });
    };
    
    const removeListItem = (listName: 'goals' | 'challengeOptions', index: number) => {
        setStory(prev => {
            if (listName === 'goals') {
                return { ...prev, goals: (prev.goals || []).filter((_, i) => i !== index) };
            } else { // challengeOptions
                return { ...prev, challengeOptions: (prev.challengeOptions || []).filter((_, i) => i !== index) };
            }
        });
    };

    const generatedJson = useMemo(() => {
      if (!story.title || !story.intro) {
        return '// Title and Intro are required to generate valid JSON.';
      }
      try {
        const finalStory: Partial<StoryCardDef> = { ...story };
        
        const filledRules = rules.map(rule => ({
          ...rule,
          source: 'story' as RuleSourceType,
          sourceName: story.title,
        }));

        finalStory.rules = filledRules as SetupRule[];

        if (!finalStory.setupDescription) delete finalStory.setupDescription;
        if (!finalStory.requiredExpansion) delete finalStory.requiredExpansion;
        if (!finalStory.additionalRequirements?.length) delete finalStory.additionalRequirements;
        if (!finalStory.sourceUrl) delete finalStory.sourceUrl;
        if (!finalStory.isSolo) delete finalStory.isSolo;
        if (!finalStory.isCoOp) delete finalStory.isCoOp;
        if (!finalStory.isPvP) delete finalStory.isPvP;
        if (!finalStory.goals?.length) delete finalStory.goals;
        if (!finalStory.challengeOptions?.length) delete finalStory.challengeOptions;
        if (!finalStory.rules?.length) delete finalStory.rules;
        if (finalStory.rating === undefined) delete finalStory.rating;
        if (finalStory.sortOrder === undefined) delete finalStory.sortOrder;

        const jsonString = JSON.stringify(finalStory, null, 2);
        const objectLiteralString = jsonString.replace(/"([^"]+)":/g, '$1:');
        
        return objectLiteralString;
      } catch (e) {
        console.error(e);
        return '// Error generating JSON. See console for details.';
      }
    }, [story, rules]);

    useEffect(() => {
        setCopyButtonText('Copy JSON');
    }, [generatedJson]);
    
    const handleCopy = () => {
        if (!generatedJson || generatedJson.startsWith('//')) return;
        navigator.clipboard.writeText(generatedJson).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy JSON'), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            setCopyButtonText('Error');
            setTimeout(() => setCopyButtonText('Copy JSON'), 2000);
        });
    };
    
    const expansionOptions = EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.id !== 'community');

    const renderGoalsList = () => (
        <div className="space-y-2">
            {(story.goals || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-900 p-2 rounded border border-gray-700">
                    <div className="flex-1 space-y-1">
                        <Input type="text" placeholder="title" value={item.title} onChange={(e) => handleListChange('goals', index, 'title', e.target.value)} />
                        <Input type="text" placeholder="description" value={item.description} onChange={(e) => handleListChange('goals', index, 'description', e.target.value)} />
                    </div>
                    <button onClick={() => removeListItem('goals', index)} className="text-red-500 hover:text-red-400 p-2">&times;</button>
                </div>
            ))}
            <button onClick={() => addListItem('goals')} className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded">Add Goal</button>
        </div>
    );

    const renderChallengesList = () => (
        <div className="space-y-2">
            {(story.challengeOptions || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-900 p-2 rounded border border-gray-700">
                    <div className="flex-1 space-y-1">
                        <Input type="text" placeholder="id" value={item.id} onChange={(e) => handleListChange('challengeOptions', index, 'id', e.target.value)} />
                        <Input type="text" placeholder="label" value={item.label} onChange={(e) => handleListChange('challengeOptions', index, 'label', e.target.value)} />
                    </div>
                    <button onClick={() => removeListItem('challengeOptions', index)} className="text-red-500 hover:text-red-400 p-2">&times;</button>
                </div>
            ))}
            <button onClick={() => addListItem('challengeOptions')} className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded">Add Challenge Option</button>
        </div>
    );
    
    const previewCard: StoryCardDef = {
        title: story.title || 'Untitled Story',
        intro: story.intro || 'Your intro text will appear here...',
        isSolo: !!story.isSolo,
        isCoOp: !!story.isCoOp,
        isPvP: !!story.isPvP,
        requiredExpansion: story.requiredExpansion,
        ...story,
    };

    return (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col border border-gray-600">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold">Add New Story Card</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Column */}
                    <div className="space-y-4">
                        <div className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg space-y-2">
                           <h3 className="font-bold text-sm text-yellow-400">Load & Clear</h3>
                           <div className="flex gap-2">
                             <Select value={cardToLoad} onChange={(e) => setCardToLoad(e.target.value)} className="flex-1">
                                 <option value="">Load an existing card to edit...</option>
                                 {sortedStoryCardsForDropdown.map(c => <option key={c.title} value={c.title}>{c.title}</option>)}
                             </Select>
                             <button onClick={clearForm} className="bg-red-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded text-sm">Clear Form</button>
                           </div>
                        </div>

                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Card Details</h3>
                        <div><label className="text-xs font-bold">Title</label><Input name="title" value={story.title || ''} onChange={handleChange} /></div>
                        <div><label className="text-xs font-bold">Intro</label><Textarea name="intro" value={story.intro || ''} onChange={handleChange} rows={3} /></div>
                        <div><label className="text-xs font-bold">Setup Description (Optional)</label><Input name="setupDescription" value={story.setupDescription || ''} onChange={handleChange} /></div>
                        <div><label className="text-xs font-bold">Source URL (Optional)</label><Input name="sourceUrl" value={story.sourceUrl || ''} onChange={handleChange} /></div>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 text-sm"><Input name="isSolo" type="checkbox" checked={!!story.isSolo} onChange={handleChange} className="w-auto" /> Is Solo?</label>
                            <label className="flex items-center gap-2 text-sm"><Input name="isCoOp" type="checkbox" checked={!!story.isCoOp} onChange={handleChange} className="w-auto" /> Is Co-Op?</label>
                            <label className="flex items-center gap-2 text-sm"><Input name="isPvP" type="checkbox" checked={!!story.isPvP} onChange={handleChange} className="w-auto" /> Is PvP?</label>
                        </div>

                        <div>
                            <label className="text-xs font-bold">Rating (for Community Content)</label>
                            <Select name="rating" value={story.rating === undefined ? -1 : story.rating} onChange={handleChange}>
                                {ratingLabels.map((label, index) => (
                                    <option key={index - 1} value={index - 1}>{label}</option>
                                ))}
                            </Select>
                        </div>
                        
                        <div><label className="text-xs font-bold">Sort Order (Number)</label><Input name="sortOrder" type="number" value={story.sortOrder || ''} onChange={handleChange} /></div>

                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Requirements</h3>
                        <div>
                            <label className="text-xs font-bold">Required Expansion</label>
                            <Select name="requiredExpansion" value={story.requiredExpansion || ''} onChange={handleChange}>
                                <option value="">None (Base Game)</option>
                                <option value="community">Community Content</option>
                                {expansionOptions.map(e => <option key={e.id} value={e.id}>{e.label}</option>)}
                            </Select>
                        </div>
                        <div>
                            <label className="text-xs font-bold">Additional Requirements</label>
                            <div className="grid grid-cols-2 gap-2 mt-1">
                                {expansionOptions.map(e => (
                                    <label key={e.id} className="flex items-center gap-2 text-sm">
                                        <Input type="checkbox" checked={story.additionalRequirements?.includes(e.id)} onChange={() => handleAdditionalReqChange(e.id as ExpansionId)} className="w-auto" />
                                        {e.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                        
                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Goals</h3>
                        {renderGoalsList()}
                        
                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Challenge Options</h3>
                        {renderChallengesList()}

                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Setup Rules (Visual Builder)</h3>
                        <VisualRuleBuilder key={builderKey} rules={rules} onRulesChange={setRules} />
                    </div>

                    {/* Output Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-green-400">Generated Object Literal</h3>
                        <div className="relative">
                            <pre className="w-full h-[600px] overflow-auto bg-black p-4 rounded text-xs border border-gray-600 custom-scrollbar whitespace-pre">
                                <code>{generatedJson}</code>
                            </pre>
                            {!generatedJson.startsWith('//') && (
                                <button onClick={handleCopy} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded">
                                    {copyButtonText}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-4 p-4 border-t border-gray-700 bg-black/30 rounded-b-lg">
                    <h3 className="font-bold text-sm text-yellow-400 mb-2">Live Preview</h3>
                    <div className="max-w-md mx-auto">
                        {story.title || story.intro ? (
                            <StoryCardGridItem card={previewCard} isSelected={false} onClick={() => {}} />
                        ) : (
                            <div className="text-center text-gray-500 text-sm italic py-4">Preview will appear here as you type.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
