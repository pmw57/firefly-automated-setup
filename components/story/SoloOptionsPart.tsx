import React from 'react';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { StoryCardDef, AdvancedRuleDef } from '../../types/index';
import { useTheme } from '../ThemeContext';
import { useGameState } from '../../hooks/useGameState';
import { InlineExpansionIcon } from '../InlineExpansionIcon';
import { ExpansionIcon } from '../ExpansionIcon';
import { ActionType } from '../../state/actions';

interface SoloOptionsPartProps {
  activeStoryCard: StoryCardDef;
  availableAdvancedRules: AdvancedRuleDef[];
}

export const SoloOptionsPart: React.FC<SoloOptionsPartProps> = ({
  activeStoryCard,
  availableAdvancedRules
}) => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleChallengeOption = (id: string) => {
    dispatch({ type: ActionType.TOGGLE_CHALLENGE_OPTION, payload: id });
  };

  const bodyBg = isDark ? 'bg-zinc-900/50' : 'bg-paper-texture';
  const mainTitleColor = isDark ? 'text-gray-100' : 'text-[#292524]';
  const bgIconBg = isDark ? 'bg-zinc-800' : 'bg-[#e5e5e5]';
  const bgIconBorder = isDark ? 'border-zinc-700' : 'border-[#d4d4d4]';

  return (
    <div className={`p-6 ${bodyBg} transition-colors`}>
      {/* Summary of Selected Story */}
      <div className={`mb-6 flex items-center p-3 rounded border ${isDark ? 'bg-zinc-800/50 border-zinc-700' : 'bg-amber-50 border-amber-200'}`}>
        {activeStoryCard.requiredExpansion ? (
          <InlineExpansionIcon type={activeStoryCard.requiredExpansion} className="w-8 h-8 mr-3" />
        ) : (
          <div className={`w-8 h-8 mr-3 rounded border overflow-hidden ${bgIconBg} ${bgIconBorder}`}>
            <ExpansionIcon id="base" />
          </div>
        )}
        <div>
          <div className={`text-xs uppercase font-bold tracking-wide opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Selected Story</div>
          <div className={`font-bold font-western ${mainTitleColor}`}>{activeStoryCard.title}</div>
        </div>
      </div>

      {/* Challenge Options ("Further Adventures") */}
      {activeStoryCard.challengeOptions && activeStoryCard.challengeOptions.length > 0 && (
        <div className={`mb-6`}>
          <div className={`flex items-center gap-2 mb-2`}>
            <span className="text-xl">🚀</span>
            <h5 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Further Adventures (Optional Challenges)
            </h5>
          </div>
          <div className={`border rounded-lg ${isDark ? 'border-zinc-700 bg-zinc-800/40' : 'border-gray-300 bg-white/50'}`}>
            {activeStoryCard.challengeOptions.map((option) => {
              const isChecked = !!gameState.challengeOptions[option.id];
              return (
                <label 
                  key={option.id}
                  className={`flex items-start p-3 border-b last:border-b-0 cursor-pointer hover:bg-black/5 transition-colors ${isDark ? 'border-zinc-700 hover:bg-white/5' : 'border-gray-200'}`}
                >
                  <div className="relative flex items-center mt-0.5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={isChecked}
                      onChange={() => toggleChallengeOption(option.id)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className={`font-medium ${isChecked ? (isDark ? 'text-green-300' : 'text-green-800') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>
                      {option.label}
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
      
      {/* Advanced Rules (10th Anniversary Solo) */}
      {availableAdvancedRules.length > 0 && (
        <div className={`mb-6`}>
          <div className={`flex items-center gap-2 mb-2`}>
            <span className="text-xl">⚡</span>
            <h5 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Advanced Rules (From Other Stories)
            </h5>
          </div>
          <div className={`border rounded-lg ${isDark ? 'border-zinc-700 bg-zinc-800/40' : 'border-gray-300 bg-white/50'}`}>
            <div className={`p-3 border-b ${isDark ? 'border-zinc-700' : 'border-gray-200'} text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
              You may enable Advanced Rules from other story cards to increase difficulty or variety.
            </div>
            {availableAdvancedRules.map((rule) => {
              const isChecked = !!gameState.challengeOptions[rule.id];
              return (
                <label 
                  key={rule.id}
                  className={`flex items-start p-3 border-b last:border-b-0 cursor-pointer hover:bg-black/5 transition-colors ${isDark ? 'border-zinc-700 hover:bg-white/5' : 'border-gray-200'}`}
                >
                  <div className="relative flex items-center mt-0.5">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      checked={isChecked}
                      onChange={() => toggleChallengeOption(rule.id)}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className={`font-medium block ${isChecked ? (isDark ? 'text-purple-300' : 'text-purple-800') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>
                      {rule.title}
                    </span>
                    {rule.description && (
                      <span className={`text-xs block mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {rule.description}
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      )}
      
      {(!activeStoryCard.challengeOptions || activeStoryCard.challengeOptions.length === 0) && availableAdvancedRules.length === 0 && (
        <div className={`p-8 text-center italic ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
          No optional rules available for this story/configuration.
        </div>
      )}
    </div>
  );
};