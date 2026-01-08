import React, { useMemo } from 'react';
import { StoryCardDef, AddSpecialRule, RuleSourceType, SpecialRule, ChallengeOption } from '../../types';
import { OverrideNotificationBlock } from '../SpecialRuleBlock';
import { useTheme } from '../ThemeContext';
import { InlineExpansionIcon } from '../InlineExpansionIcon';
import { ExpansionIcon } from '../ExpansionIcon';
import { useGameState } from '../../hooks/useGameState';
import { useGameDispatch } from '../../hooks/useGameDispatch';
import { hasRuleFlag, getResolvedRules } from '../../utils/selectors/rules';
import { getSoloTimerAdjustmentText } from '../../utils/selectors/story';

interface StoryDossierProps {
  activeStoryCard: StoryCardDef;
}

// FIX: Added a helper function to safely map the broader RuleSourceType
// to the narrower source type expected by SpecialRuleBlock. This resolves the
// TypeScript error by explicitly handling 'challenge', 'optionalRule', and 'combinableSetupCard' cases.
const mapRuleSourceToBlockSource = (source: RuleSourceType): SpecialRule['source'] => {
  if (source === 'challenge') {
    return 'warning';
  }
  if (source === 'optionalRule') {
    return 'info';
  }
  if (source === 'combinableSetupCard') {
    return 'setupCard';
  }
  return source;
};

export const StoryDossier: React.FC<StoryDossierProps> = ({ activeStoryCard }) => {
  const { state: gameState } = useGameState();
  const { setGoal, toggleChallengeOption } = useGameDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleGoalSelect = (goalTitle: string) => {
    setGoal(goalTitle);
  };

  const allRules = useMemo(() => getResolvedRules(gameState), [gameState]);

  const goalRules = useMemo(() => {
    return allRules.filter(
        (rule): rule is AddSpecialRule =>
            rule.type === 'addSpecialRule' && rule.category === 'goal'
    );
  }, [allRules]);

  const soloTimerAdjustment = useMemo(() => 
    getSoloTimerAdjustmentText(activeStoryCard), 
    [activeStoryCard]
  );

  const setupNote = activeStoryCard.rules?.find(r => r.type === 'setShipPlacement' && r.location === 'persephone') 
      ? "⚠️ Change of setup: Players now begin at Persephone." 
      : hasRuleFlag(activeStoryCard.rules || [], 'startAtLondinium')
      ? "⚠️ Change of setup: Players now begin at Londinium."
      : null;

  const mainTitleColor = isDark ? 'text-gray-100' : 'text-[#292524]';
  const italicTextColor = isDark ? 'text-gray-300' : 'text-[#57534e]';
  const bodyBg = isDark ? 'bg-zinc-900/50' : 'bg-paper-texture';
  const bgIconBg = isDark ? 'bg-zinc-800' : 'bg-[#e5e5e5]';
  const bgIconBorder = isDark ? 'border-zinc-700' : 'border-[#d4d4d4]';
  const quoteBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';

  return (
    <div className={`p-6 ${bodyBg} transition-colors`}>
      <div className="flex items-center mb-4">
        {activeStoryCard.requiredExpansion ? (
          <InlineExpansionIcon type={activeStoryCard.requiredExpansion} className="w-10 h-10 mr-3" />
        ) : (
          <div className={`w-10 h-10 mr-3 rounded border overflow-hidden ${bgIconBg} ${bgIconBorder}`}>
            <ExpansionIcon id="base" />
          </div>
        )}
        <h4 className={`text-2xl font-bold font-western ${mainTitleColor}`}>{activeStoryCard.title}</h4>
      </div>
      <p className={`${italicTextColor} italic font-serif text-lg leading-relaxed border-l-4 ${quoteBorder} pl-4 mb-4`}>"{activeStoryCard.intro}"</p>
      
      {goalRules
        // FIX: Changed 'advanced' to 'detailed' to match SetupMode type.
        .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
        .map((rule, index) => (
          <OverrideNotificationBlock
              key={`goal-rule-${index}`}
              source={mapRuleSourceToBlockSource(rule.source)}
              title={rule.rule.title}
              content={rule.rule.content}
          />
      ))}

      {/* Multi-Goal Display */}
      {activeStoryCard.goals && activeStoryCard.goals.length > 0 && (
        <div className={`mb-6`}>
          <div className={`flex items-center gap-2 mb-2`}>
            <span className="text-xl">🎯</span>
            <h5 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Select Victory Condition
            </h5>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {activeStoryCard.goals.map((goal, idx) => {
              const isSelected = gameState.selectedGoal === goal.title;
              const activeBorder = isDark ? 'border-green-500' : 'border-green-600';
              const activeBg = isDark ? 'bg-green-900/20' : 'bg-green-50';
              const inactiveBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
              const inactiveBg = isDark ? 'bg-zinc-800/40 hover:bg-zinc-800/80' : 'bg-white hover:bg-gray-50';
              
              return (
                <div 
                  key={idx} 
                  onClick={() => handleGoalSelect(goal.title)}
                  className={`
                    relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 flex items-start gap-4 shadow-sm hover:shadow-md
                    ${isSelected ? `${activeBorder} ${activeBg}` : `${inactiveBorder} ${inactiveBg}`}
                  `}
                  role="radio"
                  aria-checked={isSelected}
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && handleGoalSelect(goal.title)}
                >
                  <div className={`
                    w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5
                    ${isSelected ? 'border-green-500' : (isDark ? 'border-gray-500' : 'border-gray-400')}
                  `}>
                    {isSelected && <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-green-400' : 'bg-green-600'}`} />}
                  </div>
                  <div>
                    <div className={`font-bold text-sm mb-1 ${isSelected ? (isDark ? 'text-green-300' : 'text-green-900') : (isDark ? 'text-amber-400' : 'text-amber-800')}`}>{goal.title}</div>
                    <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{goal.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Challenge Options */}
      {activeStoryCard.challengeOptions && activeStoryCard.challengeOptions.length > 0 && (
        <div className={`mb-6`}>
          <div className={`flex items-center gap-2 mb-2`}>
            <span className="text-xl">🔧</span>
            <h5 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Story Options
            </h5>
          </div>
          <div className={`border rounded-lg ${isDark ? 'border-zinc-700 bg-zinc-800/40' : 'border-gray-300 bg-white/50'}`}>
            {activeStoryCard.challengeOptions.map((option: ChallengeOption) => {
              const isChecked = !!gameState.challengeOptions[option.id];

              let isDisabled = false;
              let disabledText: string | null = null;
              if (option.id === 'smugglers_blues_rim_variant') {
                isDisabled = !(gameState.expansions.blue && gameState.expansions.kalidasa);
                if (isDisabled) {
                  disabledText = '(Requires Blue Sun & Kalidasa expansions)';
                }
              }
              
              return (
                <label 
                  key={option.id}
                  className={`flex items-start p-3 border-b last:border-b-0 transition-colors ${isDark ? 'border-zinc-700' : 'border-gray-200'} ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5'}`}
                >
                  <div className="relative flex items-center mt-0.5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={isChecked}
                      disabled={isDisabled}
                      onChange={() => !isDisabled && toggleChallengeOption(option.id)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className={`font-medium ${isChecked ? (isDark ? 'text-green-300' : 'text-green-800') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>
                      {option.label}
                    </span>
                    {disabledText && <span className="text-xs text-red-400 block">{disabledText}</span>}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {/* Detailed Setup Description Block */}
      {activeStoryCard.setupDescription && (
        <OverrideNotificationBlock source="story" content={[activeStoryCard.setupDescription]} />
      )}

      {/* Solo Adjustments */}
      {gameState.gameMode === 'solo' && soloTimerAdjustment && (
        <OverrideNotificationBlock source="expansion" title="Solo Adjustment" content={[soloTimerAdjustment]} />
      )}

      {/* Solo Mode Information Block */}
      {gameState.setupCardId === 'FlyingSolo' && (
        <OverrideNotificationBlock source="expansion" title="10th AE Solo Rules" content={["You may play any Story Card in Expanded Solo Mode. The Variable Timer rules apply."]} />
      )}

      {setupNote && !activeStoryCard.setupDescription && (
        <OverrideNotificationBlock source="warning" title="Location Override" content={[setupNote]} />
      )}

      {activeStoryCard.sourceUrl && (
        <div className={`mt-4 pt-2 border-t border-dashed ${isDark ? 'border-zinc-700' : 'border-gray-300'} flex items-center justify-between gap-4`}>
          <a 
            href={activeStoryCard.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center text-xs font-bold uppercase tracking-wider underline hover:opacity-80 transition-opacity ${isDark ? 'text-blue-400' : 'text-blue-800'}`}
          >
            <span>View Source</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
          <a
            href="https://github.com/pmw57/firefly-automated-setup/issues/48"
            target="_blank"
            rel="noopener noreferrer"
            className={`text-[10px] font-semibold underline hover:opacity-80 transition-opacity ${isDark ? 'text-red-400' : 'text-red-700'}`}
            title="Report a broken or incorrect link"
          >
            Update Link
          </a>
        </div>
      )}
    </div>
  );
};