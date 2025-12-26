
import React, { useState } from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { StoryCardDef, ExpansionId, SetupRule } from '../types/index';
import { EXPANSIONS_METADATA } from '../data/expansions';

interface DevAddStoryCardProps {
    onClose: () => void;
}

const ruleExample = `[
  {
    "type": "setJobMode",
    "mode": "no_jobs",
    "source": "story",
    "sourceName": "Your Story Title"
  }
]`;

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className="w-full bg-gray-900 border border-gray-600 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
);

export const DevAddStoryCard: React.FC<DevAddStoryCardProps> = ({ onClose }) => {
    const [story, setStory] = useState<Partial<StoryCardDef>>({
        title: '',
        intro: '',
        isSolo: false,
        goals: [],
        challengeOptions: [],
        additionalRequirements: [],
    });
    const [rulesJson, setRulesJson] = useState('[]');
    const [generatedJson, setGeneratedJson] = useState('');
    const [copyButtonText, setCopyButtonText] = useState('Copy JSON');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setStory(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setStory(prev => ({ ...prev, [name]: value }));
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

    const handleListChange = (listName: 'goals' | 'challengeOptions', index: number, field: string, value: string) => {
        setStory(prev => {
            if (listName === 'goals') {
                const newList = [...(prev.goals || [])];
                const item = newList[index];
                if (field === 'title' || field === 'description') {
                    newList[index] = { ...item, [field]: value };
                }
                return { ...prev, goals: newList };
            } else { // challengeOptions
                const newList = [...(prev.challengeOptions || [])];
                const item = newList[index];
                if (field === 'id' || field === 'label') {
                    newList[index] = { ...item, [field]: value };
                }
                return { ...prev, challengeOptions: newList };
            }
        });
    };

    const addListItem = (listName: 'goals' | 'challengeOptions') => {
        const newItem = listName === 'goals' ? { title: '', description: '' } : { id: '', label: '' };
        setStory(prev => ({ ...prev, [listName]: [...(prev[listName] || []), newItem] }));
    };

    const removeListItem = (listName: 'goals' | 'challengeOptions', index: number) => {
        setStory(prev => ({ ...prev, [listName]: (prev[listName] || []).filter((_, i) => i !== index) }));
    };

    const handleGenerate = () => {
        if (!story.title || !story.intro) {
            alert('Title and Intro are required.');
            return;
        }
        try {
            const rules = JSON.parse(rulesJson);
            if (!Array.isArray(rules)) {
                alert('Rules must be a valid JSON array.');
                return;
            }

            const finalStory: Partial<StoryCardDef> = { ...story };
            
            // Auto-fill sourceName in rules if it's missing
            const filledRules = rules.map((rule: Record<string, unknown>) => ({
                ...rule,
                source: rule.source || 'story',
                sourceName: rule.sourceName || story.title,
            }));

            // FIX: Cast the dynamically created rules array to SetupRule[] to satisfy TypeScript.
            // The JSON input from the developer is assumed to have the correct structure.
            finalStory.rules = filledRules as SetupRule[];

            // Clean up empty/default values for a cleaner output
            if (!finalStory.setupDescription) delete finalStory.setupDescription;
            if (!finalStory.requiredExpansion) delete finalStory.requiredExpansion;
            if (!finalStory.additionalRequirements?.length) delete finalStory.additionalRequirements;
            if (!finalStory.sourceUrl) delete finalStory.sourceUrl;
            if (!finalStory.isSolo) delete finalStory.isSolo;
            if (!finalStory.goals?.length) delete finalStory.goals;
            if (!finalStory.challengeOptions?.length) delete finalStory.challengeOptions;
            if (!finalStory.rules?.length) delete finalStory.rules;

            setGeneratedJson(JSON.stringify(finalStory, null, 2));
            setCopyButtonText('Copy JSON');
        } catch (e) {
            alert('Invalid JSON in rules text area.');
            console.error(e);
        }
    };
    
    const handleCopy = () => {
        navigator.clipboard.writeText(generatedJson).then(() => {
            setCopyButtonText('Copied!');
            setTimeout(() => setCopyButtonText('Copy JSON'), 2000);
        });
    };
    
    const expansionOptions = EXPANSIONS_METADATA.filter(e => e.id !== 'base' && e.id !== 'community');

    const renderDynamicList = (listName: 'goals' | 'challengeOptions', fields: string[]) => (
        <div className="space-y-2">
            {(story[listName] || []).map((item, index) => (
                <div key={index} className="flex gap-2 items-start bg-gray-900 p-2 rounded border border-gray-700">
                    <div className="flex-1 space-y-1">
                        {fields.map(field => (
                             <Input 
                                key={field}
                                type="text"
                                placeholder={field}
                                value={(item as unknown as Record<string, string>)[field] || ''}
                                onChange={(e) => handleListChange(listName, index, field, e.target.value)}
                            />
                        ))}
                    </div>
                    <button onClick={() => removeListItem(listName, index)} className="text-red-500 hover:text-red-400 p-2">&times;</button>
                </div>
            ))}
            <button onClick={() => addListItem(listName)} className="text-xs bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded">
                Add {listName.slice(0, -1)}
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/80 z-[10000] flex items-center justify-center p-4">
            <div className="bg-gray-800 text-white p-6 rounded-lg shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col border border-gray-600">
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-700">
                    <h2 className="text-2xl font-bold">Add New Story Card</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold">&times;</button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-yellow-400">Card Details</h3>
                        <div><label className="text-xs font-bold">Title</label><Input name="title" value={story.title} onChange={handleChange} /></div>
                        <div><label className="text-xs font-bold">Intro</label><Textarea name="intro" value={story.intro} onChange={handleChange} rows={3} /></div>
                        <div><label className="text-xs font-bold">Setup Description (Optional)</label><Input name="setupDescription" value={story.setupDescription} onChange={handleChange} /></div>
                        <div><label className="text-xs font-bold">Source URL (Optional)</label><Input name="sourceUrl" value={story.sourceUrl} onChange={handleChange} /></div>
                        <div><label className="flex items-center gap-2 text-sm"><Input name="isSolo" type="checkbox" checked={!!story.isSolo} onChange={handleChange} className="w-auto" /> Is Solo?</label></div>

                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Requirements</h3>
                        <div>
                            <label className="text-xs font-bold">Required Expansion</label>
                            <Select name="requiredExpansion" value={story.requiredExpansion} onChange={handleChange}>
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
                        {renderDynamicList('goals', ['title', 'description'])}
                        
                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Challenge Options</h3>
                        {renderDynamicList('challengeOptions', ['id', 'label'])}

                        <h3 className="font-bold text-lg text-yellow-400 pt-2 border-t border-gray-700">Setup Rules (Raw JSON)</h3>
                        <div>
                            <label className="text-xs font-bold">Rules Array</label>
                            <Textarea value={rulesJson} onChange={(e) => setRulesJson(e.target.value)} rows={8} placeholder={ruleExample} />
                        </div>
                    </div>

                    {/* Output Column */}
                    <div className="space-y-4">
                        <h3 className="font-bold text-lg text-green-400">Generated JSON</h3>
                        <div className="relative">
                            <pre className="w-full h-[600px] overflow-auto bg-black p-4 rounded text-xs border border-gray-600 custom-scrollbar">
                                <code>{generatedJson || '// Click "Generate JSON" to see output'}</code>
                            </pre>
                            {generatedJson && (
                                <button onClick={handleCopy} className="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-xs px-2 py-1 rounded">
                                    {copyButtonText}
                                </button>
                            )}
                        </div>
                        <button onClick={handleGenerate} className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded">
                            Generate JSON
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
