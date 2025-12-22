import React from 'react';
import { GameState, DisgruntledDieOption } from '../../types';
import { useTheme } from '../ThemeContext';
import { PageReference } from '../PageReference';

interface TenthRulesSectionProps {
    optionalRules: GameState['optionalRules'];
    onToggleGorrammit: () => void;
    onSetDisgruntledDie: (mode: DisgruntledDieOption) => void;
    onToggleShipUpgrades: () => void;
}

export const TenthRulesSection: React.FC<TenthRulesSectionProps> = ({ 
    optionalRules, 
    onToggleGorrammit,
    onSetDisgruntledDie,
    onToggleShipUpgrades 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const optionBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const optionHover = isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50';
    const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-400' : 'text-gray-600';

    const headerBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
    const headerText = isDark ? 'text-amber-500' : 'text-amber-800';


    const isGorrammitActive = optionalRules.disgruntledDie !== 'standard';

    const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            action();
        }
    };

    const Checkbox = ({ checked }: { checked: boolean }) => (
        <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-green-600 border-green-700' : 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600'}`}>
            {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
        </div>
    );

    return (
        <section>
            <div className={`flex justify-between items-baseline mb-4 pb-1 border-b ${headerBorder}`}>
                <h3 className={`font-bold uppercase tracking-wide text-xs ${headerText}`}>10th Anniversary Rules</h3>
                <PageReference page={53} manual="10th AE" />
            </div>
            
            <div 
                role="checkbox"
                aria-checked={isGorrammitActive}
                tabIndex={0}
                onClick={onToggleGorrammit} 
                onKeyDown={(e) => handleKeyDown(e, onToggleGorrammit)}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} mb-4 focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
                <div className="mt-1 mr-4 shrink-0"><Checkbox checked={isGorrammitActive} /></div>
                <div>
                    <h3 className={`font-bold text-base ${textMain}`}>Gorrammit! (Disgruntled Die)</h3>
                    <p className={`text-sm leading-relaxed ${textSub}`}>
                        Rolling a 1 on the die has severe consequences.
                    </p>
                </div>
            </div>

            {isGorrammitActive && (
                <div className={`ml-8 pl-4 border-l-2 border-dashed mb-6 ${isDark ? 'border-zinc-700' : 'border-gray-300'}`}>
                        <div className="mb-6">
                            <div className="space-y-2">
                                {[
                                    { val: 'disgruntle', label: 'Disgruntled Crew', desc: 'Rolling a 1 disgruntles a crew member involved in the test.' },
                                    { val: 'auto_fail', label: 'Automatic Failure', desc: 'Rolling a 1 is an automatic failure (Botch), regardless of skill.' },
                                    { val: 'success_at_cost', label: 'Success At Cost', desc: 'Rolling a 1 succeeds, but with a penalty (Kill Crew / Spend Part / Disgruntle).' },
                                ].map((opt) => (
                                    <label key={opt.val} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${optionalRules.disgruntledDie === opt.val ? (isDark ? 'border-green-500 bg-green-900/20' : 'border-green-600 bg-green-50') : `${optionBorder} ${optionHover}`}`}>
                                        <input 
                                        type="radio" 
                                        name="gorrammit-mode" 
                                        value={opt.val} 
                                        checked={optionalRules.disgruntledDie === opt.val} 
                                        onChange={() => onSetDisgruntledDie(opt.val as DisgruntledDieOption)} 
                                        className="mt-1 mr-3 accent-green-600 w-4 h-4"
                                        />
                                        <div>
                                            <span className={`block font-bold text-sm ${textMain}`}>{opt.label}</span>
                                            <span className={`block text-sm leading-relaxed ${textSub}`}>{opt.desc}</span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                </div>
            )}

            <div 
                role="checkbox"
                aria-checked={optionalRules.optionalShipUpgrades}
                tabIndex={0}
                onClick={onToggleShipUpgrades} 
                onKeyDown={(e) => handleKeyDown(e, onToggleShipUpgrades)}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
            >
                <div className="mt-1 mr-4 shrink-0"><Checkbox checked={optionalRules.optionalShipUpgrades} /></div>
                <div>
                    <h3 className={`font-bold text-base ${textMain}`}>Optional Ship Upgrades</h3>
                    <p className={`text-sm leading-relaxed ${textSub}`}>
                        Include the deck of Ship Upgrades (from 10th Anniversary Edition).
                    </p>
                </div>
            </div>
        </section>
    );
};