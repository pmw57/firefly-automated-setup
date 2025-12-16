

import React from 'react';
import { GameState } from '../types';
import { STORY_CARDS } from '../data/storyCards';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { getDisplaySetupName } from '../utils';
import { useTheme } from './ThemeContext';

interface FinalSummaryProps {
  gameState: GameState;
}

export const FinalSummary: React.FC<FinalSummaryProps> = ({ gameState }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const activeStory = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);
    const activeExpansions = EXPANSIONS_METADATA.filter(e => gameState.expansions[e.id] && e.id !== 'base').map(e => e.label);
    
    const displaySetupName = getDisplaySetupName(gameState);

    // Timer Summary
    let timerSummary = null;
    const isSoloTimerActive = gameState.gameMode === 'solo' && 
                              !activeStory?.setupConfig?.disableSoloTimer &&
                              (gameState.setupCardId === 'FlyingSolo' || activeStory?.setupConfig?.soloGameTimer);
    
    if (isSoloTimerActive) {
        if (gameState.timerConfig.mode === 'standard') {
            timerSummary = "Standard (20 Turns)";
        } else {
            const extraTokens = gameState.timerConfig.unpredictableSelectedIndices.length > 4;
            const randomized = gameState.timerConfig.randomizeUnpredictable;
            timerSummary = `Unpredictable${extraTokens ? ' (Extra Tokens)' : ''}${randomized ? ' (Randomized)' : ''}`;
        }
    } else if (gameState.gameMode === 'solo' && activeStory?.setupConfig?.disableSoloTimer) {
        timerSummary = "Disabled (Story Override)";
    }

    // Optional Rules
    const activeOptionalRules: string[] = [];
    if (gameState.soloOptions?.noSureThings) activeOptionalRules.push("No Sure Things");
    if (gameState.soloOptions?.shesTrouble) activeOptionalRules.push("She's Trouble");
    if (gameState.soloOptions?.recipeForUnpleasantness) activeOptionalRules.push("Recipe For Unpleasantness");
    if (gameState.optionalRules?.optionalShipUpgrades) activeOptionalRules.push("Ship Upgrades");
    
    // Disgruntled Die
    const disgruntledDieMode = gameState.optionalRules?.disgruntledDie || 'standard';
    const disgruntledLabels: Record<string, string> = {
        standard: "Standard (Just a 1)",
        disgruntle: "Disgruntled Crew",
        auto_fail: "Automatic Failure",
        success_at_cost: "Success At Cost"
    };

    // Calculate Active Challenges & Advanced Rules
    const activeStoryChallenges = activeStory?.challengeOptions?.filter(o => gameState.challengeOptions[o.id]) || [];
    const activeAdvancedRules = STORY_CARDS
        .filter(c => c.advancedRule && gameState.challengeOptions[c.advancedRule.id])
        .map(c => c.advancedRule!);

    // Styles
    const summaryBg = isDark ? 'bg-black/20' : 'bg-amber-50/50';
    const summaryBorder = isDark ? 'border-white/10' : 'border-amber-900/10';
    const labelClass = `text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-amber-800/60'} mb-1`;
    const valueClass = `font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`;

    return (
        <div className={`text-left max-w-lg mx-auto mb-8 p-6 rounded-lg border ${summaryBg} ${summaryBorder}`}>
            <h3 className={`font-western text-xl border-b pb-2 mb-4 ${isDark ? 'text-gray-400 border-white/10' : 'text-amber-900 border-amber-900/20'}`}>
                Flight Manifest
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                 <div>
                    <div className={labelClass}>Setup Scenario</div>
                    <div className={valueClass}>{displaySetupName}</div>
                 </div>

                 <div>
                    <div className={labelClass}>Story</div>
                    <div className={valueClass}>{gameState.selectedStoryCard}</div>
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
                        <ul className={`list-disc ml-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
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
                        <ul className={`list-disc ml-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
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
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {gameState.playerNames.join(', ')}
                    </div>
                 </div>

                 {(isSoloTimerActive || timerSummary) && (
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
                    <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        {activeExpansions.join(', ')}
                    </div>
                 </div>
            </div>
        </div>
    );
};