import React, { useState, useEffect, useMemo, useRef } from 'react';
import { StoryCardDef, ExpansionId, SetupRule, StoryCardGoal, ChallengeOption, JobMode, NavMode, PrimeMode, DraftMode, LeaderSetupMode, AllianceSetupMode, ResourceType, EffectMethod, RuleSourceType, ModifyResourceRule, AddFlagRule, AddSpecialRule, ModifyPrimeRule, AllowContactsRule, PrimeContactsRule, CreateAlertTokenStackRule, BypassDraftRule, SetPlayerBadgesRule, SetJobStepContentRule, AddBoardComponentRule } from '../types/index';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { STORY_CARDS } from '../data/storyCards/index';
import { StoryCardGridItem } from './story/StoryCardGridItem';
import { CONTACT_NAMES } from '../data/ids';
import { loadStoryData } from '../utils/storyLoader';
import { LOCATION_IDS } from '../data/locations/index';
import { isStoryOverride, isActiveSetupRule } from '../utils/overrides';

// --- Local Storage ---
const DEV_STORY_CARD_DRAFT_KEY = 'firefly_dev_story_card_draft';

// --- Visual Rule Builder: Configuration & Components ---
// ... (rest of the file remains similar but without auth/db logic)

const JOB_MODES: JobMode[] = ['standard', 'no_jobs', 'hide_jobs', 'times_jobs', 'high_alert_jobs', 'buttons_jobs', 'awful_jobs', 'rim_jobs', 'draft_choice', 'caper_start', 'wind_takes_us', 'shared_hand'];
const NAV_MODES: NavMode[] = ['standard', 'browncoat', 'rim', 'flying_solo', 'clearer_skies', 'standard_reshuffle'];
const PRIME_MODES: PrimeMode[] = ['standard', 'blitz'];
const DRAFT_MODES: DraftMode[] = ['standard', 'browncoat'];
const LEADER_SETUP_MODES: LeaderSetupMode[] = ['standard', 'wanted'];
const ALLIANCE_SETUP_MODES: AllianceSetupMode[] = ['standard', 'awful_crowded', 'no_alerts'];
const RESOURCE_TYPES: ResourceType[] = ['credits', 'fuel', 'parts', 'warrants', 'goalTokens'];
const EFFECT_METHODS: EffectMethod[] = ['set', 'add', 'disable'];
const SHIP_PLACEMENT_LOCATIONS = LOCATION_IDS;
const SPECIAL_RULE_CATEGORIES: AddSpecialRule['category'][] = [
    'allianceReaver', 
    'nav', 
    'draft', 
    'draft_panel',
    'draft_ships',
    'draft_placement',
    'goal',
    'resources', 
    'jobs', 
    'prime', 
    'prime_panel',
    'soloTimer', 
    'setup_selection',
    'pressures_high'
];
const DISTRIBUTION_TYPES = ['fixed', 'all_supply_planets', 'region'];
const COMPONENT_TYPES = ['contraband', 'alert_token'];


interface RuleParam {
  name: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'textarea' | 'checkbox' | 'multi-select' | 'string-list-builder' | 'key-value-builder' | 'special-rule-builder' | 'player-badges';
  options?: string[];
  condition?: (rule: Partial<SetupRule>) => boolean;
}

interface RuleDefinition {
  label: string;
  params: RuleParam[];
  default: () => Partial<SetupRule>;
}


const SHIP_IDS = [
  'serenity', 'jetwash', 'esmeralda', 'interceptor', 'bonanza', 'ss_walden', 
  'white_lightning', 'cantankerous', 'huntingdons_bolt', 'restless_sole'
];
const RULE_DEFINITIONS: Record<string, RuleDefinition> = {
  // Nav Rules (C1)
  setNavMode: { label: 'Set Nav Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: NAV_MODES }], default: () => ({ type: 'setNavMode', mode: 'standard' }) },
  addNavInstructions: {
    label: 'Add Nav Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'nav', rule: { title: 'Navigation Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },

  // Alliance / Reaver Rules (C2)
  setAllianceMode: { label: 'Set Alliance Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: ALLIANCE_SETUP_MODES }], default: () => ({ type: 'setAllianceMode', mode: 'standard' }) },
  setAlliancePlacement: { 
    label: 'Set Alliance Placement', 
    params: [
      { name: 'placement', label: 'Placement Text', type: 'text' },
      { name: 'title', label: 'Title (Optional Override)', type: 'text' }
    ], 
    default: () => ({ type: 'setAlliancePlacement', placement: '' }) 
  },
  addAllianceReaverInstructions: {
    label: 'Add Alliance/Reaver Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'allianceReaver', rule: { title: 'Alliance/Reaver Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  setReaverPlacement: { 
    label: 'Set Reaver Placement', 
    params: [
      { name: 'placement', label: 'Placement Text', type: 'text' },
      { name: 'title', label: 'Title (Optional Override)', type: 'text' }
    ], 
    default: () => ({ type: 'setReaverPlacement', placement: '' }) 
  },
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

  // Draft Rules (C3)
  setDraftMode: { 
    label: 'Set Draft Mode', 
    params: [
      { name: 'mode', label: 'Mode', type: 'select', options: DRAFT_MODES },
      { name: 'capitolModifier', label: 'Capitol Modifier (Browncoat Only)', type: 'number' },
      { name: 'shipDiscounts', label: 'Ship Discounts (Browncoat Only)', type: 'key-value-builder' }
    ], 
    default: () => ({ type: 'setDraftMode', mode: 'standard' }) 
  },
  restrictShips: {
    label: 'Restrict Ships',
    params: [{ name: 'ships', label: 'Allowed Ships', type: 'multi-select', options: SHIP_IDS }],
    default: () => ({ type: 'restrictShips', ships: [] })
  },
  addDraftInstructions: {
    label: 'Add Draft Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'draft', rule: { title: 'Draft Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  addDraftPanel: {
    label: 'Add Custom Draft Panel',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'draft_panel', rule: { title: 'Custom Panel', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  setLeaderSetup: { label: 'Set Leader Setup', params: [{ name: 'mode', label: 'Mode', type: 'select', options: LEADER_SETUP_MODES }], default: () => ({ type: 'setLeaderSetup', mode: 'standard' }) },
  bypassDraft: {
    label: 'Bypass Draft',
    params: [{ name: 'reason', label: 'Reason', type: 'text' }],
    default: () => ({ type: 'bypassDraft', reason: 'Assigned Ship & Crew' } as Partial<BypassDraftRule>)
  },
  setPlayerBadges: {
    label: 'Set Player Badges',
    params: [{ name: 'badges', label: 'Badges Map', type: 'player-badges' }],
    default: () => ({ type: 'setPlayerBadges', badges: { 0: "Commander" } } as Partial<SetPlayerBadgesRule>)
  },
  addDraftShipInstructions: {
    label: 'Add Draft Ship Instructions',
    params: [
      { name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }
    ],
    default: () => ({ type: 'addSpecialRule', category: 'draft_ships', rule: { title: 'Ship Selection Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  addDraftPlacementInstructions: {
    label: 'Add Draft Placement Instructions',
    params: [
      { name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }
    ],
    default: () => ({ type: 'addSpecialRule', category: 'draft_placement', rule: { title: 'Placement Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },

  // Job Rules (C6)
  setJobMode: { label: 'Set Job Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: JOB_MODES }], default: () => ({ type: 'setJobMode', mode: 'standard' }) },
  setJobContacts: { label: 'Set Specific Job Contacts', params: [{ name: 'contacts', label: 'Contacts', type: 'multi-select', options: Object.values(CONTACT_NAMES) }], default: () => ({ type: 'setJobContacts', contacts: [] }) },
  addJobInstructions: {
    label: 'Add Job Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'jobs', rule: { title: 'Job Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  allowContacts: { label: 'Allow Only Specific Contacts', params: [{ name: 'contacts', label: 'Contacts', type: 'multi-select', options: Object.values(CONTACT_NAMES) }], default: () => ({ type: 'allowContacts', contacts: [] } as Partial<AllowContactsRule>) },
  forbidContact: { label: 'Forbid Contact', params: [{ name: 'contact', label: 'Contact', type: 'select', options: Object.values(CONTACT_NAMES) }], default: () => ({ type: 'forbidContact', contact: CONTACT_NAMES.HARKEN }) },
  primeContacts: { label: 'Prime Contact Decks', params: [], default: () => ({ type: 'primeContacts' } as Partial<PrimeContactsRule>) },
  setJobStepContent: {
      label: 'Set Job Step Content',
      params: [
          { name: 'position', label: 'Position', type: 'select', options: ['before', 'after'] },
          { name: 'content', label: 'Content', type: 'string-list-builder' }
      ],
      default: () => ({ type: 'setJobStepContent', position: 'before', content: [{ type: 'paragraph', content: [''] }] } as Partial<SetJobStepContentRule>)
  },

  // Prime Rules (C_PRIME)
  setPrimeMode: { label: 'Set Prime Mode', params: [{ name: 'mode', label: 'Mode', type: 'select', options: PRIME_MODES }], default: () => ({ type: 'setPrimeMode', mode: 'standard' }) },
  addPrimeInstructions: {
    label: 'Add Prime Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'prime', rule: { title: 'Prime Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  addPrimePanel: {
    label: 'Add Custom Prime Panel',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'prime_panel', rule: { title: 'Custom Panel', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  modifyPrime: {
    label: 'Modify Prime the Pump',
    params: [
      { name: 'multiplier', label: 'Set Multiplier (e.g., 2)', type: 'number' },
      { name: 'modifier', label: 'Modifier Object (JSON)', type: 'textarea' }
    ],
    default: () => ({ type: 'modifyPrime', multiplier: 2 } as Partial<ModifyPrimeRule>)
  },
  
  // General / Misc Rules
  setShipPlacement: { label: 'Set Ship Placement', params: [{ name: 'location', label: 'Location', type: 'select', options: SHIP_PLACEMENT_LOCATIONS }], default: () => ({ type: 'setShipPlacement', location: 'persephone' }) },
  setHavenPlacement: {
    label: 'Set Haven Placement',
    params: [{ name: 'enabled', label: 'Enabled', type: 'checkbox' }],
    default: () => ({ type: 'setHavenPlacement', enabled: true })
  },
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
  addResourceInstructions: {
    label: 'Add Resource Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'resources', rule: { title: 'Resource Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  addGoalInstructions: {
    label: 'Add Goal Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'goal', rule: { title: 'Goal Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  addSoloTimerInstructions: {
    label: 'Add Solo Timer Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'soloTimer', rule: { title: 'Solo Timer Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  addSetupSelectionInstructions: {
    label: 'Add Setup Selection Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'setup_selection', rule: { title: 'Setup Selection Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
  },
  addPressuresHighInstructions: {
    label: 'Add Pressures High Instructions',
    params: [{ name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }],
    default: () => ({ type: 'addSpecialRule', category: 'pressures_high', rule: { title: 'Pressures High Note', content: [{ type: 'paragraph', content: [''] }] } } as Partial<AddSpecialRule>)
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
      { name: 'rule', label: 'Rule Object', type: 'special-rule-builder' }
    ],
    default: () => ({ type: 'addSpecialRule', category: 'goal', rule: { title: 'New Rule', content: [{ type: 'paragraph', content: ['Description here.'] }] } } as Partial<AddSpecialRule>)
  },
};


const RuleInput: React.FC<{ param: RuleParam, value: unknown, onChange: (val: unknown) => void, isInvalid?: boolean }> = ({ param, value, onChange, isInvalid }) => {
    const commonProps = `w-full bg-gray-900 border ${isInvalid ? 'border-red-500' : 'border-gray-700'} rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500`;
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
    if (param.type === 'multi-select') {
        const selected = Array.isArray(value) ? value : [];
        const toggle = (opt: string) => {
            if (selected.includes(opt)) onChange(selected.filter(o => o !== opt));
            else onChange([...selected, opt]);
        };
        return (
            <div className="flex flex-wrap gap-1 mt-1">
                {param.options?.map(opt => (
                    <button type="button" key={opt} onClick={() => toggle(opt)} className={`px-2 py-1 text-[10px] rounded ${selected.includes(opt) ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                        {opt}
                    </button>
                ))}
            </div>
        );
    }
    if (param.type === 'string-list-builder') {
        const list = Array.isArray(value) 
            ? value.map(item => typeof item === 'string' ? item : (item.type === 'paragraph' && Array.isArray(item.content) ? item.content[0] : ''))
            : [];
        return (
            <div className="space-y-1 mt-1">
                {list.map((item, i) => (
                    <div key={i} className="flex gap-1">
                        <input type="text" className={commonProps} value={item} onChange={e => {
                            const newList = [...list]; newList[i] = e.target.value; 
                            onChange(newList.map(s => ({ type: 'paragraph', content: [s] })));
                        }} />
                        <button type="button" onClick={() => {
                            const newList = [...list]; newList.splice(i, 1); 
                            onChange(newList.map(s => ({ type: 'paragraph', content: [s] })));
                        }} className="text-red-500 px-1">&times;</button>
                    </div>
                ))}
                <button type="button" onClick={() => onChange([...(Array.isArray(value) ? value : []), { type: 'paragraph', content: [''] }])} className="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded">+ Add Item</button>
            </div>
        );
    }
    if (param.type === 'key-value-builder') {
        const obj = (typeof value === 'object' && value !== null) ? value as Record<string, string> : {};
        const entries = Object.entries(obj);
        return (
            <div className="space-y-1 mt-1">
                {entries.map(([k, v], i) => (
                    <div key={i} className="flex gap-1">
                        <input type="text" className={commonProps} placeholder="Key" value={k} onChange={e => {
                            const newObj = { ...obj }; delete newObj[k]; newObj[e.target.value] = v; onChange(newObj);
                        }} />
                        <input type="text" className={commonProps} placeholder="Value" value={v} onChange={e => {
                            const raw = e.target.value;
                            const num = parseFloat(raw);
                            const finalVal = !isNaN(num) && String(num) === raw ? num : raw;
                            const newObj = { ...obj, [k]: finalVal }; onChange(newObj);
                        }} />
                        <button type="button" onClick={() => {
                            const newObj = { ...obj }; delete newObj[k]; onChange(newObj);
                        }} className="text-red-500 px-1">&times;</button>
                    </div>
                ))}
                <button type="button" onClick={() => onChange({ ...obj, ['newKey']: 'newValue' })} className="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded">+ Add Pair</button>
            </div>
        );
    }
    if (param.type === 'player-badges') {
        const badges = (typeof value === 'object' && value !== null) ? value as Record<string, string> : {};
        return (
            <div className="space-y-2 mt-1">
                {[0, 1, 2, 3, 4, 5].map(idx => (
                    <div key={idx} className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-500 w-16">Player {idx + 1}:</span>
                        <input
                            type="text"
                            className={commonProps}
                            value={badges[String(idx)] || ''}
                            onChange={(e) => {
                                const newVal = { ...badges, [String(idx)]: e.target.value };
                                if (!e.target.value) delete newVal[String(idx)];
                                onChange(newVal);
                            }}
                            placeholder="e.g. The Operative"
                        />
                    </div>
                ))}
            </div>
        );
    }
    if (param.type === 'special-rule-builder') {
        const valObj = (typeof value === 'object' && value !== null) ? value as Record<string, unknown> : {};
        const rawContent = Array.isArray(valObj.content) ? valObj.content : [];
        const content = rawContent.map((item: unknown) => {
            if (typeof item === 'string') return item;
            const itemObj = (typeof item === 'object' && item !== null) ? item as Record<string, unknown> : null;
            if (itemObj?.type === 'paragraph' && Array.isArray(itemObj.content)) return String(itemObj.content[0] || '');
            return '';
        });
        const ruleObj = { title: String(valObj.title || ''), content };
        return (
            <div className="space-y-2 mt-1 bg-gray-800 p-2 rounded border border-gray-700">
                <div>
                    <label className="text-[10px] text-gray-400">Rule Title</label>
                    <input type="text" className={commonProps} value={ruleObj.title || ''} onChange={e => onChange({ ...ruleObj, title: e.target.value, content: ruleObj.content.map(s => ({ type: 'paragraph', content: [s] })) })} />
                </div>
                <div>
                    <label className="text-[10px] text-gray-400">Rule Content (Paragraphs)</label>
                    <div className="space-y-1 mt-1">
                        {ruleObj.content.map((item, i) => (
                            <div key={i} className="flex gap-1">
                                <textarea className={commonProps} rows={2} value={item} onChange={e => {
                                    const newContent = [...ruleObj.content]; newContent[i] = e.target.value; 
                                    onChange({ ...ruleObj, content: newContent.map(s => ({ type: 'paragraph', content: [s] })) });
                                }} />
                                <button type="button" onClick={() => {
                                    const newContent = [...ruleObj.content]; newContent.splice(i, 1); 
                                    onChange({ ...ruleObj, content: newContent.map(s => ({ type: 'paragraph', content: [s] })) });
                                }} className="text-red-500 px-1">&times;</button>
                            </div>
                        ))}
                        <button type="button" onClick={() => onChange({ ...ruleObj, content: [...ruleObj.content, ''].map(s => ({ type: 'paragraph', content: [s] })) })} className="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded">+ Add Paragraph</button>
                    </div>
                </div>
            </div>
        );
    }
    
    const inputValue = Array.isArray(value) ? value.join(', ') : String(value ?? '');
    return <input type="text" className={commonProps} value={inputValue} onChange={(e) => onChange(e.target.value)} />;
};

const RuleEditor: React.FC<{ 
  rule: Partial<SetupRule>, 
  index: number, 
  totalRules: number,
  onUpdate: (index: number, newRule: Partial<SetupRule>) => void, 
  onRemove: (index: number) => void,
  onMove: (index: number, direction: 'up' | 'down') => void,
  onDuplicate: (index: number) => void
}> = ({ rule, index, totalRules, onUpdate, onRemove, onMove, onDuplicate }) => {
  let ruleType: string = rule.type!;
  if (ruleType === 'addSpecialRule') {
    const specialRule = rule as Partial<AddSpecialRule>;
    if (specialRule.category === 'draft_ships') ruleType = 'addDraftShipInstructions';
    else if (specialRule.category === 'draft_placement') ruleType = 'addDraftPlacementInstructions';
    else if (specialRule.category === 'nav') ruleType = 'addNavInstructions';
    else if (specialRule.category === 'prime') ruleType = 'addPrimeInstructions';
    else if (specialRule.category === 'prime_panel') ruleType = 'addPrimePanel';
    else if (specialRule.category === 'allianceReaver') ruleType = 'addAllianceReaverInstructions';
    else if (specialRule.category === 'draft') ruleType = 'addDraftInstructions';
    else if (specialRule.category === 'draft_panel') ruleType = 'addDraftPanel';
    else if (specialRule.category === 'resources') ruleType = 'addResourceInstructions';
    else if (specialRule.category === 'goal') ruleType = 'addGoalInstructions';
    else if (specialRule.category === 'jobs') ruleType = 'addJobInstructions';
    else if (specialRule.category === 'soloTimer') ruleType = 'addSoloTimerInstructions';
    else if (specialRule.category === 'setup_selection') ruleType = 'addSetupSelectionInstructions';
    else if (specialRule.category === 'pressures_high') ruleType = 'addPressuresHighInstructions';
  }
  
  if (rule.type === 'setHavenPlacement') ruleType = 'setHavenPlacement';
  if (rule.type === 'restrictShips') ruleType = 'restrictShips';

  const definition = RULE_DEFINITIONS[ruleType];
  if (!definition) return <div className="text-red-500 text-xs p-2 bg-red-900/50 rounded">Unknown rule type: {rule.type}</div>;
  
  const handleFieldChange = (name: string, value: unknown) => {
    onUpdate(index, { ...rule, [name]: value });
  };

  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded p-3 space-y-2">
      <div className="flex justify-between items-center">
        <h5 className="font-bold text-sm text-cyan-400">{definition.label}</h5>
        <div className="flex items-center gap-2">
          <button onClick={() => onMove(index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-white disabled:opacity-30" title="Move Up">↑</button>
          <button onClick={() => onMove(index, 'down')} disabled={index === totalRules - 1} className="text-gray-400 hover:text-white disabled:opacity-30" title="Move Down">↓</button>
          <button onClick={() => onDuplicate(index)} className="text-blue-400 hover:text-blue-300 text-xs" title="Duplicate">⧉</button>
          <button onClick={() => onRemove(index)} className="text-red-500 hover:text-red-400 font-bold text-xl ml-2" title="Remove">&times;</button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {definition.params.map(param => {
          if (param.condition && !param.condition(rule)) return null;
          const isInvalidJson = param.type === 'textarea' && param.label.includes('JSON') && typeof (rule as Record<string, unknown>)[param.name] === 'string' && (rule as Record<string, unknown>)[param.name] !== '';
          return (
            <div key={param.name} className={definition.params.length <= 2 && param.type !== 'select' ? 'col-span-2' : ''}>
              <label className="text-xs text-gray-400">{param.label}</label>
              <RuleInput param={param} value={(rule as Record<string, unknown>)[param.name]} onChange={(val) => handleFieldChange(param.name, val)} isInvalid={isInvalidJson} />
              {isInvalidJson && <div className="text-red-500 text-xs mt-1">Invalid JSON</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const RULE_GROUPS = [
    {
        label: 'Step 1: Navigation & Prime',
        rules: ['setNavMode', 'addNavInstructions', 'setPrimeMode', 'addPrimeInstructions', 'addPrimePanel', 'modifyPrime']
    },
    {
        label: 'Step 2: Alliance & Reavers',
        rules: ['setAllianceMode', 'setAlliancePlacement', 'setReaverPlacement', 'addAllianceReaverInstructions', 'createAlertTokenStack', 'addBoardComponent']
    },
    {
        label: 'Step 3: Draft & Placement',
        rules: ['setDraftMode', 'restrictShips', 'addDraftInstructions', 'addDraftPanel', 'setLeaderSetup', 'bypassDraft', 'setPlayerBadges', 'setShipPlacement', 'setHavenPlacement', 'addDraftShipInstructions', 'addDraftPlacementInstructions']
    },
    {
        label: 'Step 5: Resources & Goal Tokens',
        rules: ['modifyResource', 'addResourceInstructions', 'addGoalInstructions']
    },
    {
        label: 'Step 6: Jobs & Contacts',
        rules: ['setJobMode', 'addJobInstructions', 'setJobContacts', 'allowContacts', 'forbidContact', 'primeContacts', 'setJobStepContent']
    },
    {
        label: 'System / Advanced',
        rules: ['addSoloTimerInstructions', 'addSetupSelectionInstructions', 'addPressuresHighInstructions', 'addFlag', 'addSpecialRule']
    }
];

const VisualRuleBuilder: React.FC<{ rules: Partial<SetupRule>[], onRulesChange: (rules: Partial<SetupRule>[]) => void }> = ({ rules, onRulesChange }) => {
  const [newRuleType, setNewRuleType] = useState(RULE_GROUPS[0].rules[0]);

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

  const moveRule = (index: number, direction: 'up' | 'down') => {
    const newRules = [...rules];
    if (direction === 'up' && index > 0) {
        [newRules[index - 1], newRules[index]] = [newRules[index], newRules[index - 1]];
    } else if (direction === 'down' && index < newRules.length - 1) {
        [newRules[index + 1], newRules[index]] = [newRules[index], newRules[index + 1]];
    }
    onRulesChange(newRules);
  };

  const duplicateRule = (index: number) => {
    const newRules = [...rules];
    const itemToDuplicate = JSON.parse(JSON.stringify(newRules[index]));
    newRules.splice(index + 1, 0, itemToDuplicate);
    onRulesChange(newRules);
  };
  
  return (
    <div className="space-y-3">
      {rules.map((rule, index) => (
        <RuleEditor key={index} rule={rule} index={index} totalRules={rules.length} onUpdate={updateRule} onRemove={removeRule} onMove={moveRule} onDuplicate={duplicateRule} />
      ))}
      <div className="flex gap-2 pt-2 border-t border-gray-700">
        <select value={newRuleType} onChange={(e) => setNewRuleType(e.target.value)} className="flex-1 w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          {RULE_GROUPS.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.rules.map(type => (
                <option key={type} value={type}>
                  {RULE_DEFINITIONS[type]?.label || type}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <button onClick={addRule} className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded text-sm">Add Rule</button>
      </div>
    </div>
  );
};

interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement> { isInvalid?: boolean; }
const Input = React.forwardRef<HTMLInputElement, CustomInputProps>(({ isInvalid, className, ...props }, ref) => (
    <input ref={ref} {...props} className={`w-full bg-gray-900 border ${isInvalid ? 'border-red-500' : 'border-gray-600'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`} />
));
Input.displayName = 'Input';

interface CustomTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { isInvalid?: boolean; }
const Textarea = React.forwardRef<HTMLTextAreaElement, CustomTextareaProps>(({ isInvalid, className, ...props }, ref) => (
    <textarea ref={ref} {...props} className={`w-full bg-gray-900 border ${isInvalid ? 'border-red-500' : 'border-gray-600'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`} />
));
Textarea.displayName = 'Textarea';

interface CustomSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { isInvalid?: boolean; }
const Select = React.forwardRef<HTMLSelectElement, CustomSelectProps>(({ isInvalid, className, ...props }, ref) => (
    <select ref={ref} {...props} className={`w-full bg-gray-900 border ${isInvalid ? 'border-red-500' : 'border-gray-600'} rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${className || ''}`} />
));
Select.displayName = 'Select';

const FORMAT_TOKENS = ['[CREDITS]', '[PARTS]', '[FUEL]', '[WARRANTS]', '[GOAL]', '[MORAL]', '[LEGAL]', '[ILLEGAL]'];
const FormatToolbar: React.FC<{ onInsert: (token: string) => void }> = ({ onInsert }) => (
    <div className="flex flex-wrap gap-1 mb-1">
        {FORMAT_TOKENS.map(token => (
            <button type="button" key={token} onClick={() => onInsert(token)} className="text-[10px] bg-gray-700 hover:bg-gray-600 text-gray-300 px-1.5 py-0.5 rounded">
                {token}
            </button>
        ))}
    </div>
);

const STORY_TEMPLATES = [
    { label: 'Standard Solo', story: { isSolo: true, title: 'New Solo Story', intro: '' }, rules: [{ type: 'setJobMode', mode: 'standard' }, { type: 'setNavMode', mode: 'standard' }, { type: 'setPrimeMode', mode: 'standard' }, { type: 'setDraftMode', mode: 'standard' }, { type: 'setLeaderSetup', mode: 'standard' }] },
    { label: 'Standard Co-Op', story: { isCoOp: true, title: 'New Co-Op Story', intro: '' }, rules: [{ type: 'setJobMode', mode: 'standard' }, { type: 'setNavMode', mode: 'standard' }, { type: 'setAllianceMode', mode: 'standard' }] },
    { label: 'Bounty Hunter', story: { isSolo: true, title: 'Bounty Hunter', intro: '' }, rules: [{ type: 'setLeaderSetup', mode: 'wanted' }, { type: 'setJobMode', mode: 'standard' }] }
];

// --- Main Component ---
interface StoryCardEditorProps {
    onClose: () => void;
    initialStoryTitle?: string;
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

export const StoryCardEditor: React.FC<StoryCardEditorProps> = ({ onClose, initialStoryTitle }) => {
    const [story, setStory] = useState<Partial<StoryCardDef>>(getInitialState().story);
    const [rules, setRules] = useState<Partial<SetupRule>[]>(getInitialState().rules);
    const [copyButtonText, setCopyButtonText] = useState('Copy JSON');
    const [saveButtonText, setSaveButtonText] = useState('Save to File');
    const [originalTitle, setOriginalTitle] = useState<string | null>(null);
    const [cardToLoad, setCardToLoad] = useState(initialStoryTitle || '');
    const [suppressWarning, setSuppressWarning] = useState(false);
    // Add a key to force re-mounting of the VisualRuleBuilder on clear
    const [builderKey, setBuilderKey] = useState(0);
    const [activeTab, setActiveTab] = useState<'basic' | 'goals' | 'rules'>('basic');

    const [templateToLoad, setTemplateToLoad] = useState('');

    const introRef = useRef<HTMLTextAreaElement>(null);
    const setupDescRef = useRef<HTMLInputElement>(null);
    const rulesRef = useRef<HTMLDivElement>(null);

    const uniqueGoalTitles = useMemo(() => Array.from(new Set(STORY_CARDS.flatMap(c => c.goals?.map(g => g.title) || []).filter(Boolean))), []);
    const uniqueGoalDescriptions = useMemo(() => Array.from(new Set(STORY_CARDS.flatMap(c => c.goals?.map(g => g.description) || []).filter(Boolean))), []);
    const uniqueChallengeIds = useMemo(() => Array.from(new Set(STORY_CARDS.flatMap(c => c.challengeOptions?.map(co => co.id) || []).filter(Boolean))), []);
    const uniqueChallengeLabels = useMemo(() => Array.from(new Set(STORY_CARDS.flatMap(c => c.challengeOptions?.map(co => co.label) || []).filter(Boolean))), []);

    const insertAtCursor = (ref: React.RefObject<HTMLInputElement | HTMLTextAreaElement>, fieldName: string, text: string) => {
        if (!ref.current) return;
        const start = ref.current.selectionStart || 0;
        const end = ref.current.selectionEnd || 0;
        const currentVal = ref.current.value;
        const newVal = currentVal.substring(0, start) + text + currentVal.substring(end);
        
        setStory(prev => ({ ...prev, [fieldName]: newVal }));
        
        setTimeout(() => {
            ref.current?.focus();
            ref.current?.setSelectionRange(start + text.length, start + text.length);
        }, 0);
    };
    const auditCancelledRef = useRef(false);

    const [auditProgress, setAuditProgress] = useState(0);
    const [isAuditing, setIsAuditing] = useState(false);
    const [auditCancelled, setAuditCancelled] = useState(false);
    const [storiesRequiringUpdate, setStoriesRequiringUpdate] = useState<Set<string>>(new Set());
    const [auditComplete, setAuditComplete] = useState(false);

    useEffect(() => {
        auditCancelledRef.current = false;
        let currentIndex = 0;
        const totalCards = STORY_CARDS.length;
        const needsUpdate = new Set<string>();

        setIsAuditing(true);
        setAuditProgress(0);
        setAuditCancelled(false);
        setAuditComplete(false);
        setStoriesRequiringUpdate(new Set());

        const processNextBatch = () => {
            if (auditCancelledRef.current) {
                setIsAuditing(false);
                setAuditCancelled(true);
                return;
            }

            const batchSize = 5;
            const endIndex = Math.min(currentIndex + batchSize, totalCards);

            for (let i = currentIndex; i < endIndex; i++) {
                const card = STORY_CARDS[i];
                const hasSetupDescription = !!card.setupDescription;
                const hasStoryOverride = card.rules?.some(isStoryOverride);
                const isActiveSetup = card.rules?.some(isActiveSetupRule);

                const isMissingSomething = 
                    (hasSetupDescription && (!hasStoryOverride || !isActiveSetup)) ||
                    (hasStoryOverride && !isActiveSetup) ||
                    (isActiveSetup && (!hasStoryOverride || !hasSetupDescription));

                if (isMissingSomething) {
                    needsUpdate.add(card.title);
                }
            }

            currentIndex = endIndex;
            setAuditProgress(Math.round((currentIndex / totalCards) * 100));
            setStoriesRequiringUpdate(new Set(needsUpdate));

            if (currentIndex < totalCards) {
                setTimeout(processNextBatch, 50);
            } else {
                setIsAuditing(false);
                setAuditComplete(true);
            }
        };

        const timeoutId = setTimeout(processNextBatch, 500);

        return () => {
            auditCancelledRef.current = true;
            clearTimeout(timeoutId);
        };
    }, []);

    const handleCancelAudit = () => {
        auditCancelledRef.current = true;
    };

    const handleNextUpdate = () => {
        const sortedNeedsUpdate = sortedStoryCardsForDropdown
            .filter(c => storiesRequiringUpdate.has(c.title))
            .map(c => c.title);
        
        if (sortedNeedsUpdate.length > 0) {
            const currentIndex = sortedNeedsUpdate.indexOf(cardToLoad);
            const nextIndex = currentIndex >= 0 && currentIndex < sortedNeedsUpdate.length - 1 ? currentIndex + 1 : 0;
            const nextCardTitle = sortedNeedsUpdate[nextIndex];
            setCardToLoad(nextCardTitle);
            setSuppressWarning(false);
        }
    };

    const auditChecklist = useMemo(() => {
        // Don't warn on a completely empty new card
        if (!story.title && !story.setupDescription && (!rules || rules.length === 0)) return null;
        
        const hasSetupDescription = !!story.setupDescription;
        const hasStoryOverride = rules?.some(isStoryOverride);
        const hasActiveSetupRules = rules?.some(isActiveSetupRule);

        // If it has none of these, it's not a setup-modifying card, so no checklist needed
        if (!hasSetupDescription && !hasStoryOverride && !hasActiveSetupRules) return null;

        // If it has all three, the checklist is fully complete, so we can hide the warning banner
        if (hasSetupDescription && hasStoryOverride && hasActiveSetupRules) return null;

        return [
            {
                id: 'setupDesc',
                label: 'Setup Description (Story Card)',
                isComplete: hasSetupDescription,
                actionLabel: 'Edit Description',
                action: () => {
                    setupDescRef.current?.focus();
                    setupDescRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            },
            {
                id: 'storyOverride',
                label: 'Story Override (Setup Pages)',
                isComplete: hasStoryOverride,
                actionLabel: 'Add Override',
                action: () => {
                    rulesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            },
            {
                id: 'activeSetupRules',
                label: 'Active Setup Rules',
                isComplete: hasActiveSetupRules,
                actionLabel: 'Add Rules',
                action: () => {
                    rulesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        ];
    }, [story.title, story.setupDescription, rules]);

    const sortedStoryCardsForDropdown = useMemo(() => {
        const allStories = [...STORY_CARDS];
        // Deduplicate by title
        const uniqueStories = new Map<string, StoryCardDef>();
        allStories.forEach(s => uniqueStories.set(s.title, s as StoryCardDef));
        
        return Array.from(uniqueStories.values()).sort((a, b) => a.title.localeCompare(b.title));
    }, []);

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
        const load = async () => {
            if (cardToLoad) {
                let cardData: StoryCardDef | undefined;
                const index = STORY_CARDS.findIndex(c => c.title === cardToLoad);
                if (index >= 0) {
                    try {
                        cardData = await loadStoryData(index);
                    } catch (e) {
                        console.error("Error loading story definition:", e);
                    }
                }

                if (cardData) {
                    const { rules: cardRules, ...cardStoryData } = cardData;
                    setStory(cardStoryData);
                    setOriginalTitle(cardData.title);
                    // Deep copy rules to prevent accidental mutation
                    setRules(cardRules ? JSON.parse(JSON.stringify(cardRules)) : []);
                }
            }
        };
        load();
    }, [cardToLoad]);
    
    // Load selected template
    useEffect(() => {
        if (templateToLoad) {
            const template = STORY_TEMPLATES.find(t => t.label === templateToLoad);
            if (template) {
                setStory({ ...getInitialState().story, ...template.story });
                setRules(JSON.parse(JSON.stringify(template.rules)));
                setBuilderKey(prev => prev + 1);
            }
            setTemplateToLoad('');
        }
    }, [templateToLoad]);

    const clearForm = () => {
        const { story: initialStory, rules: initialRules } = getInitialState();
        setStory(initialStory);
        setRules(initialRules);
        setCardToLoad('');
        setOriginalTitle(null);
        setCopyButtonText('Copy JSON');
        setSaveButtonText('Save to File');
        setSuppressWarning(false);
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

    const moveListItem = (listName: 'goals' | 'challengeOptions', index: number, direction: 'up' | 'down') => {
        setStory(prev => {
            const list = prev[listName] ? [...prev[listName]!] : [];
            if (direction === 'up' && index > 0) {
                [list[index - 1], list[index]] = [list[index], list[index - 1]];
            } else if (direction === 'down' && index < list.length - 1) {
                [list[index + 1], list[index]] = [list[index], list[index + 1]];
            }
            return { ...prev, [listName]: list as never };
        });
    };

    const duplicateListItem = (listName: 'goals' | 'challengeOptions', index: number) => {
        setStory(prev => {
            const list = prev[listName] ? [...prev[listName]!] : [];
            const itemToDuplicate = JSON.parse(JSON.stringify(list[index]));
            list.splice(index + 1, 0, itemToDuplicate);
            return { ...prev, [listName]: list as never };
        });
    };

    const isTitleValid = !!story.title?.trim();
    const isIntroValid = !!story.intro?.trim();

    const hasInvalidJson = useMemo(() => {
        return rules.some(rule => {
            const jsonFields = ['rule', 'modifier', 'badges', 'content'];
            return jsonFields.some(field => {
                const val = (rule as Record<string, unknown>)[field];
                return typeof val === 'string' && val.trim() !== '';
            });
        });
    }, [rules]);

    const isFormValid = isTitleValid && isIntroValid && !hasInvalidJson;

    const generatedJson = useMemo(() => {
      if (!isTitleValid || !isIntroValid) {
        return '// Title and Intro are required to generate valid JSON.';
      }
      if (hasInvalidJson) {
        return '// Fix invalid JSON in rules to generate output.';
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
    }, [story, rules, isTitleValid, isIntroValid, hasInvalidJson]);

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
    
    const handleSaveToFile = async () => {
        if (!isFormValid || !originalTitle) return;
        
        setSaveButtonText('Saving...');
        
        try {
            const finalStory: Partial<StoryCardDef> = { ...story };
            const filledRules = rules.map(rule => ({
                ...rule,
                source: 'story' as RuleSourceType,
                sourceName: story.title,
            }));
            finalStory.rules = filledRules as SetupRule[];

            // Clean up empty fields
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

            const response = await fetch('/api/save-story', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    originalTitle,
                    newStoryData: finalStory
                })
            });

            const result = await response.json();
            if (result.success) {
                setSaveButtonText('Saved!');
                setOriginalTitle(story.title || null); // Update original title to new title if changed
                setTimeout(() => setSaveButtonText('Save to File'), 2000);
            } else {
                throw new Error(result.error || 'Failed to save');
            }
        } catch (error) {
            console.error('Error saving to file:', error);
            setSaveButtonText('Error');
            setTimeout(() => setSaveButtonText('Save to File'), 2000);
        }
    };

    const expansionOptions = EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.id !== 'community');

    const renderGoalsList = () => (
        <div className="space-y-2">
            {(story.goals || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-900 p-2 rounded border border-gray-700">
                    <div className="flex flex-col gap-1 pt-1">
                        <button onClick={() => moveListItem('goals', index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-white disabled:opacity-30 leading-none" title="Move Up">↑</button>
                        <button onClick={() => moveListItem('goals', index, 'down')} disabled={index === (story.goals?.length || 0) - 1} className="text-gray-400 hover:text-white disabled:opacity-30 leading-none" title="Move Down">↓</button>
                    </div>
                    <div className="flex-1 space-y-1">
                        <Input type="text" placeholder="title" value={item.title} onChange={(e) => handleListChange('goals', index, 'title', e.target.value)} list="goal-titles" />
                        <Input type="text" placeholder="description" value={item.description} onChange={(e) => handleListChange('goals', index, 'description', e.target.value)} list="goal-descriptions" />
                    </div>
                    <div className="flex flex-col gap-2 items-center pt-1">
                        <button onClick={() => duplicateListItem('goals', index)} className="text-blue-400 hover:text-blue-300 text-xs leading-none" title="Duplicate">⧉</button>
                        <button onClick={() => removeListItem('goals', index)} className="text-red-500 hover:text-red-400 leading-none text-lg" title="Remove">&times;</button>
                    </div>
                </div>
            ))}
            <button onClick={() => addListItem('goals')} className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded">Add Goal</button>
        </div>
    );

    const renderChallengesList = () => (
        <div className="space-y-2">
            {(story.challengeOptions || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-900 p-2 rounded border border-gray-700">
                    <div className="flex flex-col gap-1 pt-1">
                        <button onClick={() => moveListItem('challengeOptions', index, 'up')} disabled={index === 0} className="text-gray-400 hover:text-white disabled:opacity-30 leading-none" title="Move Up">↑</button>
                        <button onClick={() => moveListItem('challengeOptions', index, 'down')} disabled={index === (story.challengeOptions?.length || 0) - 1} className="text-gray-400 hover:text-white disabled:opacity-30 leading-none" title="Move Down">↓</button>
                    </div>
                    <div className="flex-1 space-y-1">
                        <Input type="text" placeholder="id" value={item.id} onChange={(e) => handleListChange('challengeOptions', index, 'id', e.target.value)} list="challenge-ids" />
                        <Input type="text" placeholder="label" value={item.label} onChange={(e) => handleListChange('challengeOptions', index, 'label', e.target.value)} list="challenge-labels" />
                    </div>
                    <div className="flex flex-col gap-2 items-center pt-1">
                        <button onClick={() => duplicateListItem('challengeOptions', index)} className="text-blue-400 hover:text-blue-300 text-xs leading-none" title="Duplicate">⧉</button>
                        <button onClick={() => removeListItem('challengeOptions', index)} className="text-red-500 hover:text-red-400 leading-none text-lg" title="Remove">&times;</button>
                    </div>
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
                    <h2 className="text-2xl font-bold">Story Card Editor</h2>
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2 items-center bg-gray-900/50 border border-gray-700 rounded-lg p-1">
                             <Select value={templateToLoad} onChange={(e) => setTemplateToLoad(e.target.value)} className="w-40 text-xs py-1">
                                 <option value="">Load Template...</option>
                                 {STORY_TEMPLATES.map(t => (
                                     <option key={t.label} value={t.label}>{t.label}</option>
                                 ))}
                             </Select>
                             <Select value={cardToLoad} onChange={(e) => { setCardToLoad(e.target.value); setSuppressWarning(false); }} className="w-48 text-xs py-1">
                                 <option value="">Load existing...</option>
                                 {sortedStoryCardsForDropdown.map(c => (
                                     <option key={c.title} value={c.title}>
                                         {c.title} {storiesRequiringUpdate.has(c.title) ? ' ⚠️' : ''}
                                     </option>
                                 ))}
                             </Select>
                             <button onClick={clearForm} className="bg-red-800 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">Clear</button>
                        </div>
                        <button onClick={onClose} className="text-gray-400 hover:text-white p-2 -mr-2 transition-colors" title="Close">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Column */}
                    <div className="space-y-4 flex flex-col">
                        
                        {/* Background Audit UI */}
                        {(isAuditing || auditComplete || auditCancelled) && (
                            <div className="p-3 bg-gray-900/50 border border-gray-700 rounded-lg space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-sm text-blue-400">Background Audit</h3>
                                    {isAuditing && (
                                        <button onClick={handleCancelAudit} className="text-xs bg-red-800 hover:bg-red-700 text-white px-2 py-1 rounded">
                                            Cancel
                                        </button>
                                    )}
                                    {auditComplete && storiesRequiringUpdate.size > 0 && (
                                        <button onClick={handleNextUpdate} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded">
                                            Next Story Requiring Update
                                        </button>
                                    )}
                                    {auditComplete && storiesRequiringUpdate.size === 0 && (
                                        <span className="text-xs text-green-400">All stories up to date!</span>
                                    )}
                                    {auditCancelled && (
                                        <span className="text-xs text-yellow-500">Audit Cancelled</span>
                                    )}
                                </div>
                                
                                {isAuditing && (
                                    <div className="w-full bg-gray-700 rounded-full h-2.5">
                                        <div className="bg-blue-500 h-2.5 rounded-full transition-all duration-200" style={{ width: `${auditProgress}%` }}></div>
                                    </div>
                                )}
                                
                                <div className="text-xs text-gray-400">
                                    {isAuditing ? `Auditing stories... ${auditProgress}%` : 
                                     auditComplete ? `Audit complete. Found ${storiesRequiringUpdate.size} stories requiring updates.` :
                                     `Audit cancelled at ${auditProgress}%. Found ${storiesRequiringUpdate.size} stories requiring updates so far.`}
                                </div>
                            </div>
                        )}

                        {/* Tabs Header */}
                        <div className="flex border-b border-gray-700 mt-2">
                            <button onClick={() => setActiveTab('basic')} className={`px-4 py-2 font-bold text-sm ${activeTab === 'basic' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Basic Info</button>
                            <button onClick={() => setActiveTab('goals')} className={`px-4 py-2 font-bold text-sm ${activeTab === 'goals' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Goals & Challenges</button>
                            <button onClick={() => setActiveTab('rules')} className={`px-4 py-2 font-bold text-sm ${activeTab === 'rules' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400 hover:text-gray-200'}`}>Setup Rules</button>
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1">
                            {activeTab === 'basic' && (
                                <div className="space-y-4">
                                    {auditChecklist && !suppressWarning && (
                                        <div className="bg-yellow-900/50 border border-yellow-700 p-3 rounded">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-yellow-400 font-bold text-sm">Setup Modification Audit</h4>
                                                <button onClick={() => setSuppressWarning(true)} className="text-yellow-400 hover:text-yellow-300 text-xs bg-yellow-900/50 px-2 py-1 rounded">Dismiss</button>
                                            </div>
                                            <ul className="space-y-2">
                                                {auditChecklist.map(item => (
                                                    <li key={item.id} className="flex items-center justify-between text-xs">
                                                        <div className="flex items-center gap-2">
                                                            {item.isComplete ? (
                                                                <span className="text-green-400">✓</span>
                                                            ) : (
                                                                <span className="text-yellow-500">○</span>
                                                            )}
                                                            <span className={item.isComplete ? "text-green-200 line-through opacity-50" : "text-yellow-100"}>
                                                                {item.label}
                                                            </span>
                                                        </div>
                                                        {!item.isComplete && (
                                                            <button 
                                                                onClick={() => {
                                                                    if (item.id === 'setupDesc') setActiveTab('basic');
                                                                    else setActiveTab('rules');
                                                                    setTimeout(item.action, 50);
                                                                }}
                                                                className="px-2 py-1 bg-yellow-800 hover:bg-yellow-700 text-yellow-100 rounded transition-colors"
                                                            >
                                                                {item.actionLabel}
                                                            </button>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}

                                    <div><label className="text-xs font-bold">Title <span className="text-red-500">*</span></label><Input name="title" value={story.title || ''} onChange={handleChange} isInvalid={!isTitleValid} /></div>
                                    <div>
                                        <label className="text-xs font-bold">Intro <span className="text-red-500">*</span></label>
                                        <FormatToolbar onInsert={(token) => insertAtCursor(introRef, 'intro', token)} />
                                        <Textarea name="intro" value={story.intro || ''} onChange={handleChange} rows={3} isInvalid={!isIntroValid} ref={introRef} />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold">Setup Description (Optional)</label>
                                        <FormatToolbar onInsert={(token) => insertAtCursor(setupDescRef, 'setupDescription', token)} />
                                        <Input name="setupDescription" value={story.setupDescription || ''} onChange={handleChange} ref={setupDescRef} />
                                    </div>
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
                                </div>
                            )}

                            {activeTab === 'goals' && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Goals</h3>
                                    {renderGoalsList()}
                                    
                                    <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Challenge Options</h3>
                                    {renderChallengesList()}
                                </div>
                            )}

                            {activeTab === 'rules' && (
                                <div className="space-y-4">
                                    <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Setup Rules (Visual Builder)</h3>
                                    <div ref={rulesRef}>
                                        <VisualRuleBuilder key={builderKey} rules={rules} onRulesChange={setRules} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Output Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-green-400">Generated Object Literal</h3>
                        <div className="relative">
                            <pre className="w-full h-[600px] overflow-auto bg-black p-4 rounded text-xs border border-gray-600 custom-scrollbar whitespace-pre">
                                <code>{generatedJson}</code>
                            </pre>
                            {!generatedJson.startsWith('//') && (
                                <div className="absolute top-2 right-2 flex gap-2">
                                    <button 
                                        onClick={handleCopy} 
                                        disabled={!isFormValid}
                                        className={`text-xs px-2 py-1 rounded ${isFormValid ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {copyButtonText}
                                    </button>
                                    {originalTitle && (
                                        <button 
                                            onClick={handleSaveToFile} 
                                            disabled={!isFormValid}
                                            className={`text-xs px-2 py-1 rounded font-bold ${isFormValid ? 'bg-green-700 hover:bg-green-600' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                        >
                                            {saveButtonText}
                                        </button>
                                    )}
                                </div>
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
            
            {/* Datalists for Autocomplete */}
            <datalist id="goal-titles">
                {uniqueGoalTitles.map(t => <option key={t} value={t} />)}
            </datalist>
            <datalist id="goal-descriptions">
                {uniqueGoalDescriptions.map(d => <option key={d} value={d} />)}
            </datalist>
            <datalist id="challenge-ids">
                {uniqueChallengeIds.map(id => <option key={id} value={id} />)}
            </datalist>
            <datalist id="challenge-labels">
                {uniqueChallengeLabels.map(l => <option key={l} value={l} />)}
            </datalist>
        </div>
    );
};