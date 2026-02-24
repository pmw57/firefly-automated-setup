import React, { useMemo } from 'react';
import { GameState } from '../types/index';
import { getDisplaySetupName, getTimerSummaryText, getActiveOptionalRulesText } from '../utils/selectors/ui';
import { useTheme } from './ThemeContext';
import { getActiveExpansions, getActiveAdvancedRules, getActiveStoryChallenges, getActiveStoryCard } from '../utils/selectors/story';

interface FinalSummaryProps {
  gameState: GameState;
}

export const FinalSummary = ({ gameState }: FinalSummaryProps): React.ReactElement => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const activeExpansions = getActiveExpansions(gameState);
    
    const displaySetupName = getDisplaySetupName(gameState);
    const timerSummary = getTimerSummaryText(gameState);
    const activeOptionalRules = getActiveOptionalRulesText(gameState);
    const activeStoryCard = useMemo(() => getActiveStoryCard(gameState), [gameState]);
    
    // Disgruntled Die
    const disgruntledDieMode = gameState.optionalRules?.disgruntledDie || 'standard';
    const disgruntledLabels: Record<string, string> = {
        standard: "Standard (Just a 1)",
        disgruntle: "Disgruntled Crew",
        auto_fail: "Automatic Failure",
        success_at_cost: "Success At Cost"
    };

    // Calculate Active Challenges & Advanced Rules
    const activeStoryChallenges = useMemo(() => getActiveStoryChallenges(gameState), [gameState]);
    const activeAdvancedRules = useMemo(() => getActiveAdvancedRules(gameState), [gameState]);

    // Styles
    const summaryBg = isDark ? 'bg-black/20' : 'bg-amber-50/50';
    const summaryBorder = isDark ? 'border-white/10' : 'border-amber-900/10';
    const labelClass = `text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-amber-800/60'} mb-1`;
    const valueClass = `font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`;

    return (
        <div className={`text-left max-w-lg mx-auto mb-8 p-6 rounded-lg border ${summaryBg} ${summaryBorder}`}>
            <h3 className={`font-western text-xl border-b pb-2 mb-4 ${isDark ? 'text-gray-400 border-white/10' : 'text-amber-900 border-amber-900/20'}`}>
                Flight Manifest
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-6">
                 <div>
                    <div className={labelClass}>Setup Scenario</div>
                    <div className={valueClass}>{displaySetupName}</div>
                 </div>

                 <div>
                    <div className={labelClass}>Story</div>
                    <div className={valueClass}>{activeStoryCard?.title}</div>
                 </div>

                 {gameState.selectedGoal && (
                     <div className="sm:col-span-2">
                        <div className={labelClass}>Active Goal</div>
                        <div className={`${valueClass} text-amber-700 dark:text-amber-400`}>{gameState.selectedGoal}</div>
                     </div>
                 )}

                 {/* Challenges */}
                 {activeStoryChallenges.length > 0 && (
                     <div className="sm:col-span-2">
                        <div className={labelClass}>Story Directives & Challenges</div>
                        <ul className={`list-disc ml-4 text-sm leading-relaxed space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                            {activeStoryChallenges.map(o => (
                                <li key={o.id}>{o.label}</li>
                            ))}
                        </ul>
                     </div>
                 )}

                 {/* Advanced Rules */}
                 {activeAdvancedRules.length > 0 && (
                     <div className="sm:col-span-2">
                        <div className={labelClass}>Advanced Rules</div>
                        <ul className={`list-disc ml-4 text-sm leading-relaxed space-y-1 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                            {activeAdvancedRules.map(o => (
                                <li key={o.id}>
                                    <strong>{o.title}</strong>
                                </li>
                            ))}
                        </ul>
                     </div>
                 )}

                 <div>
                    <div className={labelClass}>Captain(s)</div>
                    <div className={valueClass}>{gameState.playerCount}</div>
                    <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {gameState.playerNames.slice(0, gameState.playerCount).map((name, i) => name || `Captain ${i + 1}`).join(', ')}
                    </div>
                 </div>

                 {timerSummary && (
                     <div>
                        <div className={labelClass}>Solo Timer</div>
                        <div className={valueClass}>{timerSummary}</div>
                     </div>
                 )}

                 {disgruntledDieMode !== 'standard' && (
                     <div>
                         <div className={labelClass}>Disgruntled Die</div>
                         <div className={valueClass}>{disgruntledLabels[disgruntledDieMode]}</div>
                     </div>
                 )}

                 {activeOptionalRules.length > 0 && (
                     <div className="sm:col-span-2">
                         <div className={labelClass}>Optional Rules</div>
                         <div className={valueClass}>{activeOptionalRules.join(', ')}</div>
                     </div>
                 )}
                 
                 <div className="sm:col-span-2">
                    <div className={labelClass}>Active Expansions</div>
                    <div className={`text-sm leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        {activeExpansions.length > 0 ? activeExpansions.join(', ') : 'None'}
                    </div>
                 </div>
            </div>
        </div>
    );
};