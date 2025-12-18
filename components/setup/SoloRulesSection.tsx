import React from 'react';
import { GameState } from '../../types';
import { useTheme } from '../ThemeContext';
import { PageReference } from '../PageReference';

interface SoloRulesSectionProps {
    soloOptions: GameState['soloOptions'];
    timerConfig: GameState['timerConfig'];
    onToggleOption: (key: keyof GameState['soloOptions']) => void;
    onToggleTimer: () => void;
}

export const SoloRulesSection: React.FC<SoloRulesSectionProps> = ({ 
    soloOptions, 
    timerConfig, 
    onToggleOption, 
    onToggleTimer 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const optionBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const optionHover = isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50';
    const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
    const textSub = isDark ? 'text-gray-400' : 'text-gray-600';
    
    const headerBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
    const headerText = isDark ? 'text-amber-500' : 'text-amber-800';


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
                <h3 className={`font-bold uppercase tracking-wide text-xs ${headerText}`}>Solo Rules</h3>
                <PageReference page={55} manual="10th AE" />
            </div>
            <div className="space-y-4">
                <div 
                    role="checkbox"
                    aria-checked={timerConfig.mode === 'unpredictable'}
                    tabIndex={0}
                    onClick={onToggleTimer} 
                    onKeyDown={(e) => handleKeyDown(e, onToggleTimer)}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={timerConfig.mode === 'unpredictable'} /></div>
                    <div>
                        <h3 className={`font-bold text-base ${textMain}`}>Unpredictable Timer</h3>
                        <p className={`text-xs mt-1 ${textSub}`}>Use numbered tokens in the discard stack. The game might end suddenly when a token matches a die roll.</p>
                    </div>
                </div>
                <div 
                    role="checkbox"
                    aria-checked={soloOptions.noSureThings}
                    tabIndex={0}
                    onClick={() => onToggleOption('noSureThings')} 
                    onKeyDown={(e) => handleKeyDown(e, () => onToggleOption('noSureThings'))}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={soloOptions.noSureThings} /></div>
                    <div>
                        <h3 className={`font-bold text-base ${textMain}`}>No Sure Things In Life</h3>
                        <p className={`text-xs mt-1 ${textSub}`}>Remove 5 cards from every Supply/Contact deck during setup to simulate a lived-in 'Verse.</p>
                    </div>
                </div>
                <div 
                    role="checkbox"
                    aria-checked={soloOptions.shesTrouble}
                    tabIndex={0}
                    onClick={() => onToggleOption('shesTrouble')} 
                    onKeyDown={(e) => handleKeyDown(e, () => onToggleOption('shesTrouble'))}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={soloOptions.shesTrouble} /></div>
                    <div>
                        <h3 className={`font-bold text-base ${textMain}`}>She's Trouble</h3>
                        <p className={`text-xs mt-1 ${textSub}`}>Whenever you begin a turn with a <strong>Deceptive Crew</strong> on your ship and deceptive crew cards in a discard pile, roll a die. On a 1, they become Disgruntled.</p>
                    </div>
                </div>
                <div 
                    role="checkbox"
                    aria-checked={soloOptions.recipeForUnpleasantness}
                    tabIndex={0}
                    onClick={() => onToggleOption('recipeForUnpleasantness')} 
                    onKeyDown={(e) => handleKeyDown(e, () => onToggleOption('recipeForUnpleasantness'))}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={soloOptions.recipeForUnpleasantness} /></div>
                    <div>
                        <h3 className={`font-bold text-base ${textMain}`}>Recipe For Unpleasantness</h3>
                        <p className={`text-xs mt-1 ${textSub}`}>Start of turn: Roll a die against the number of Disgruntled crew. If equal/lower, add a Disgruntled token to a crew member.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};