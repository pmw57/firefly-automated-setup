import React from 'react';
import { Step } from '../../../types';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';
import { useTheme } from '../../ThemeContext';
import { useGameState } from '../../../hooks/useGameState';
import { ActionType } from '../../../state/actions';
import { hasFlag } from '../../../utils/data';
import { getActiveStoryCard } from '../../../utils/selectors';

interface GameLengthTokensStepProps {
  step: Step;
}

export const GameLengthTokensStep: React.FC<GameLengthTokensStepProps> = () => {
    const { state: gameState, dispatch } = useGameState();
    const activeStoryCard = getActiveStoryCard(gameState);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!dispatch || !activeStoryCard) return null;

    // Handle Disable Flag
    if (hasFlag(activeStoryCard.setupConfig, 'disableSoloTimer')) {
        return (
            <SpecialRuleBlock source="story" title="Story Override" content={[{ type: 'strong', content: "No Timer:" }, " Do not use a Game Timer for this game."]} />
        );
    }
    
    const { shesTrouble, recipeForUnpleasantness } = gameState.soloOptions || {};
    
    const AVAILABLE_TOKENS = [1, 1, 2, 2, 3, 4]; // The complete pool
    
    const { mode, unpredictableSelectedIndices, randomizeUnpredictable } = gameState.timerConfig;

    const toggleExtraTokens = () => {
        dispatch({ type: ActionType.TOGGLE_TIMER_MODE });
    };

    const selectedTokens = unpredictableSelectedIndices.map(i => AVAILABLE_TOKENS[i]);
    const displayStack = [...selectedTokens];
    
    if (!randomizeUnpredictable) {
        displayStack.sort((a, b) => a - b);
    }

    const tokensToRemove = gameState.isCampaign ? gameState.campaignStoriesCompleted * 2 : 0;
    const totalTokens = Math.max(0, 20 - tokensToRemove);
    const numNumbered = selectedTokens.length;
    const topDisgruntled = Math.max(0, totalTokens - 1 - numNumbered);
    
    const warningBg = isDark ? 'bg-amber-900/30' : 'bg-amber-50';
    const warningBorder = isDark ? 'border-amber-700/50' : 'border-amber-200';
    const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
    const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
    const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
    const subText = isDark ? 'text-gray-400' : 'text-gray-500';

    return (
        <div className="space-y-6">
            {tokensToRemove > 0 && (
                <SpecialRuleBlock source="story" title="Campaign Rule: Time Catches Up" content={["Removing ", { type: 'strong', content: `${tokensToRemove} tokens` }, " from the timer for your ", { type: 'strong', content: `${gameState.campaignStoriesCompleted}` }, " completed stories."]} />
            )}

            {(shesTrouble || recipeForUnpleasantness) && (
                <div className={`p-4 rounded-lg border ${warningBorder} ${warningBg} mb-4`}>
                    <h4 className={`font-bold text-sm uppercase tracking-wide mb-3 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Active Solo Rules</h4>
                    <div className="space-y-3">
                        {shesTrouble && (
                            <div>
                                <strong className={`block text-xs ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>She's Trouble</strong>
                                <p className={`text-xs mt-1 ${isDark ? 'text-amber-200/80' : 'text-amber-800'}`}>
                                    Whenever you begin a turn with a <strong>Deceptive Crew</strong> on your ship and deceptive crew cards in a discard pile, roll a die. If you roll a 1, disgruntle your deceptive crew.
                                    <br/><em className="opacity-80">Note: If a deceptive crew is part of your crew and you hire another, you may remove one from play.</em>
                                </p>
                            </div>
                        )}
                        {recipeForUnpleasantness && (
                            <div className={shesTrouble ? `pt-3 border-t ${warningBorder}` : ''}>
                                <strong className={`block text-xs ${isDark ? 'text-amber-200' : 'text-amber-900'}`}>Recipe For Unpleasantness</strong>
                                <p className={`text-xs mt-1 ${isDark ? 'text-amber-200/80' : 'text-amber-800'}`}>
                                    Whenever you begin a turn with <strong>1 or more disgruntled crew</strong> (including your leader), roll a die. If you roll equal to or lower than the number of disgruntled crew on your ship, add a disgruntled token to the crew of your choice.
                                    <br/><em className="opacity-80">Crew who jump ship or are fired as a result are removed from play.</em>
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {mode === 'standard' && (
                <div className={`${panelBg} p-4 rounded-lg border ${panelBorder} shadow-sm animate-fade-in`}>
                    <h4 className={`font-bold mb-2 ${textColor}`}>Standard Solo Timer</h4>
                    <p className={subText}>Set aside <strong>{totalTokens} Disgruntled Tokens</strong> to use as Game Length Tokens.</p>
                    <p className={`text-sm mt-2 opacity-80 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-2`}>
                        Discard one token at the start of every turn. When the last token is gone, you have one final turn.
                    </p>
                </div>
            )}

            {mode === 'unpredictable' && (
                <div className={`animate-fade-in space-y-4`}>
                    <SpecialRuleBlock source="expansion" title="Pirates & Bounty Hunters Rule" content={[
                        { type: 'paragraph', content: ["Replace the bottom Game Length Tokens with numbered Destination Tokens."] },
                        { type: 'paragraph', content: [{ type: 'strong', content: 'The Mechanic:' }, " Whenever you discard a numbered Game Length Token, ", { type: 'strong', content: 'roll a die' }, ". If you roll ", { type: 'strong', content: 'equal to or lower' }, " than the number, discard all remaining Game Length Tokens. Take one final turn."] }
                    ]}/>

                    <div className={`${panelBg} p-4 rounded-lg border ${panelBorder}`}>
                        <h5 className={`font-bold text-sm uppercase tracking-wide mb-3 ${textColor}`}>Configure Stack</h5>
                        
                        <div className="space-y-3 mb-6">
                            <label className={`flex items-center cursor-pointer p-2 rounded border ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={mode === 'unpredictable'}
                                    onChange={toggleExtraTokens}
                                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <div className="ml-3">
                                    <span className={`block text-sm font-medium ${textColor}`}>Unpredictable Timer Active</span>
                                    <span className={`block text-xs ${subText}`}>Tokens can end game early.</span>
                                </div>
                            </label>
                        </div>

                        <div className={`mt-4 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800`}>
                             <h6 className={`font-bold text-xs uppercase mb-2 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Stack Construction (Top to Bottom)</h6>
                             <ol className={`list-decimal ml-5 text-sm space-y-1 ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
                                 <li>Stack <strong>{topDisgruntled}</strong> Disgruntled Tokens.</li>
                                 {randomizeUnpredictable ? (
                                     <li>Stack the <strong>{numNumbered} numbered tokens</strong> in <strong>RANDOM</strong> order.</li>
                                 ) : (
                                     displayStack.map((val, i) => (
                                         <li key={i}>Place <strong>Token #{val}</strong>.</li>
                                     ))
                                 )}
                                 <li>Place <strong>1 Disgruntled Token</strong> at the very bottom (Last Turn).</li>
                             </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};