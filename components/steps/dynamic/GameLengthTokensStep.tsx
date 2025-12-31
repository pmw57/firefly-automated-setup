import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';
import { useTheme } from '../../ThemeContext';
import { useGameState } from '../../../hooks/useGameState';
import { ActionType } from '../../../state/actions';
import { hasRuleFlag } from '../../../utils/selectors/rules';
import { getActiveStoryCard } from '../../../utils/selectors/story';
import { StandardTimerRules } from './timer/StandardTimerRules';
import { UnpredictableTimerRules } from './timer/UnpredictableTimerRules';

export const GameLengthTokensStep: React.FC = () => {
    const { state: gameState, dispatch } = useGameState();
    const activeStoryCard = getActiveStoryCard(gameState);
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    if (!dispatch || !activeStoryCard) return null;

    if (activeStoryCard.rules && hasRuleFlag(activeStoryCard.rules, 'disableSoloTimer')) {
        return (
            <SpecialRuleBlock source="story" title="Story Override" content={[{ type: 'strong', content: "No Timer:" }, " Do not use a Game Timer for this game."]} />
        );
    }
    
    const { shesTrouble, recipeForUnpleasantness } = gameState.soloOptions || {};
    const { mode, unpredictableSelectedIndices, randomizeUnpredictable } = gameState.timerConfig;

    const toggleTimerMode = () => {
        dispatch({ type: ActionType.TOGGLE_TIMER_MODE });
    };

    // FIX: Reverted to use `isCampaign` and `campaignStoriesCompleted` to match the updated GameState interface.
    const tokensToRemove = gameState.isCampaign ? gameState.campaignStoriesCompleted * 2 : 0;
    const totalTokens = Math.max(0, 20 - tokensToRemove);
    
    const warningBg = isDark ? 'bg-amber-900/30' : 'bg-amber-50';
    const warningBorder = isDark ? 'border-amber-700/50' : 'border-amber-200';

    return (
        <div className="space-y-6">
            {tokensToRemove > 0 && (
                // FIX: Updated to `campaignStoriesCompleted` and changed title to "Campaign Rule".
                <SpecialRuleBlock source="setupCard" title="Campaign Rule: Time Catches Up" content={["Removing ", { type: 'strong', content: `${tokensToRemove} tokens` }, " from the timer for your ", { type: 'strong', content: `${gameState.campaignStoriesCompleted}` }, " completed stories."]} />
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

            {mode === 'standard' ? (
                <StandardTimerRules totalTokens={totalTokens} />
            ) : (
                <UnpredictableTimerRules 
                    unpredictableSelectedIndices={unpredictableSelectedIndices}
                    randomizeUnpredictable={randomizeUnpredictable}
                    totalTokens={totalTokens}
                    onToggleTimerMode={toggleTimerMode}
                />
            )}
        </div>
    );
};