import React, { useMemo } from 'react';
import { OverrideNotificationBlock } from '../../SpecialRuleBlock';
import { useGameState } from '../../../hooks/useGameState';
import { useGameDispatch } from '../../../hooks/useGameDispatch';
import { hasRuleFlag, getResolvedRules } from '../../../utils/selectors/rules';
import { getActiveStoryCard } from '../../../utils/selectors/story';
import { UnpredictableTimerRules } from './timer/UnpredictableTimerRules';
import { SpecialRule } from '../../../types';

export const GameLengthTokensStep: React.FC = () => {
    const { state: gameState } = useGameState();
    const { toggleTimerMode, toggleUnpredictableToken } = useGameDispatch();
    const activeStoryCard = getActiveStoryCard(gameState);
    const allRules = useMemo(() => getResolvedRules(gameState), [gameState]);

    const specialRulesFromEngine = useMemo(() => {
        const rules: SpecialRule[] = [];
        allRules.forEach(rule => {
            if (rule.type === 'addSpecialRule' && rule.category === 'soloTimer') {
                if (['story', 'setupCard', 'expansion', 'warning', 'info'].includes(rule.source)) {
                    rules.push({
                        source: rule.source as SpecialRule['source'],
                        ...rule.rule
                    });
                }
            }
        });
        return rules;
    }, [allRules]);

    const replacesTimerSetup = useMemo(() => 
        hasRuleFlag(allRules, 'replacesSoloTimerSetup'), 
    [allRules]);

    const { shesTrouble, recipeForUnpleasantness } = gameState.soloOptions || {};
    const tokensToRemove = gameState.isCampaign ? gameState.campaignStoriesCompleted * 2 : 0;

    const allInfoBlocks = useMemo(() => {
      if (gameState.setupMode === 'quick') {
        return [];
      }
      const blocks: SpecialRule[] = [...specialRulesFromEngine];
  
      if (tokensToRemove > 0) {
        blocks.push({
          source: 'setupCard',
          title: 'Campaign Rule: Time Catches Up',
          content: [{ type: 'paragraph', content: [`Removing ${tokensToRemove} tokens from the timer for your ${gameState.campaignStoriesCompleted} completed stories.`] }]
        });
      }
  
      if (shesTrouble) {
        blocks.push({ 
            source: 'info', 
            title: "Active Optional Rule: She's Trouble", 
            content: [
              { type: 'paragraph', content: ["Whenever you begin a turn with a Deceptive Crew on your ship and deceptive crew cards in a discard pile, roll a die. If you roll a 1, disgruntle your deceptive crew."] },
              { type: 'paragraph', content: [{ type: 'strong', content: "Note:" }, " If a deceptive crew is part of your crew and you hire another, you may remove one from play."] }
            ] 
        });
      }
      if (recipeForUnpleasantness) {
        blocks.push({ 
            source: 'info', 
            title: "Active Optional Rule: Recipe For Unpleasantness", 
            content: [{ type: 'paragraph', content: ["Whenever you begin a turn with 1 or more disgruntled crew (including your leader), roll a die. If you roll equal to or lower than the number of disgruntled crew on your ship, add a disgruntled token to the crew of your choice. Crew who jump ship or are fired as a result are removed from play."] }] 
        });
      }
      
      const order: Record<SpecialRule['source'], number> = {
        expansion: 1, setupCard: 2, story: 3, warning: 3, info: 4,
      };
      
      return blocks
        .sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99))
        .map((rule, i) => <OverrideNotificationBlock key={`rule-${i}`} {...rule} />);

    }, [specialRulesFromEngine, tokensToRemove, gameState.campaignStoriesCompleted, shesTrouble, recipeForUnpleasantness, gameState.setupMode]);
    
    if (!activeStoryCard) return null;

    if (hasRuleFlag(allRules, 'disableSoloTimer')) {
        return (
            <div className="space-y-6">
                {allInfoBlocks}
            </div>
        );
    }
    
    const totalTokens = Math.max(0, 20 - tokensToRemove);

    return (
        <div className="space-y-6">
            {allInfoBlocks}
            
            {!replacesTimerSetup && (
                <UnpredictableTimerRules 
                    timerConfig={gameState.timerConfig}
                    totalTokens={totalTokens}
                    onToggleTimerMode={toggleTimerMode}
                    onToggleUnpredictableToken={toggleUnpredictableToken}
                />
            )}
        </div>
    );
};