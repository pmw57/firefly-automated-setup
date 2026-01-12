import React from 'react';
import { useMissionSelection } from '../../hooks/useMissionSelection';
import { useGameState } from '../../hooks/useGameState';
import { useGameDispatch } from '../../hooks/useGameDispatch';
import { Button } from '../Button';
import { PageReference } from '../PageReference';
import { useTheme } from '../ThemeContext';
import { InlineExpansionIcon } from '../InlineExpansionIcon';
import { ExpansionIcon } from '../ExpansionIcon';
import { cls } from '../../utils/style';

interface AdvancedRulesConfigurationPartProps {
  onNext: () => void;
  onBack: () => void;
  isNavigating: boolean;
}

export const AdvancedRulesConfigurationPart: React.FC<AdvancedRulesConfigurationPartProps> = ({ onNext, onBack, isNavigating }) => {
  const { activeStoryCard, allPotentialAdvancedRules } = useMissionSelection();
  const { state: gameState } = useGameState();
  const { toggleChallengeOption } = useGameDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  if (!activeStoryCard) return null;

  const handleToggleChallengeOption = (id: string) => {
    toggleChallengeOption(id);
  };

  const disabledRuleId = activeStoryCard.advancedRule?.id;

  const containerBg = 'bg-[#faf8ef]/80 dark:bg-zinc-900/70 backdrop-blur-md';
  const containerBorder = 'border-[#d6cbb0] dark:border-zinc-800';
  const headerBarBg = 'bg-[#5e1916] dark:bg-black/40';
  const headerBarBorder = 'border-[#450a0a] dark:border-zinc-800';
  const headerColor = 'text-[#fef3c7] dark:text-amber-500';
  const badgeBg = 'bg-[#991b1b] dark:bg-zinc-800';
  const badgeText = 'text-[#fef3c7] dark:text-gray-400';
  const badgeBorder = 'border border-[#450a0a] dark:border-0';
  const navBorderTop = 'border-[#d6cbb0] dark:border-zinc-800';
  const footerBg = isDark ? 'bg-zinc-950/90' : 'bg-[#faf8ef]/95';
  const footerBorder = isDark ? 'border-zinc-800' : 'border-firefly-parchment-border';
  
  const bodyBg = isDark ? 'bg-zinc-900/50' : 'bg-paper-texture';
  const mainTitleColor = isDark ? 'text-gray-100' : 'text-[#292524]';
  const bgIconBg = isDark ? 'bg-zinc-800' : 'bg-[#e5e5e5]';
  const bgIconBorder = isDark ? 'border-zinc-700' : 'border-[#d4d4d4]';

  return (
    <div className="space-y-6 animate-fade-in pb-24 xl:pb-0">
      <div className={`${containerBg} rounded-lg shadow-md border ${containerBorder} overflow-hidden transition-colors duration-300`}>
        <div className={`${headerBarBg} p-4 flex justify-between items-center border-b ${headerBarBorder} transition-colors duration-300`}>
          <div className="flex items-baseline gap-2">
            <h3 className={`font-bold text-lg font-western tracking-wider ${headerColor}`}>
              Advanced Rules
            </h3>
            <PageReference page={53} manual="10th AE" />
          </div>
          <span className={`text-xs uppercase tracking-widest ${badgeBg} ${badgeBorder} ${badgeText} px-2 py-1 rounded font-bold`}>Part 2 of 2</span>
        </div>
        
        <div className={`p-6 ${bodyBg} transition-colors`}>
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
          
          {allPotentialAdvancedRules.length > 0 && (
            <div>
              <div className={`flex items-center gap-2 mb-2`}>
                <span className="text-xl">⚡</span>
                <h5 className={`font-bold uppercase tracking-wide text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Advanced Rules (From Solo Story Cards)
                </h5>
              </div>
              <div className={`border rounded-lg ${isDark ? 'border-zinc-700 bg-zinc-800/40' : 'border-gray-300 bg-white/50'}`}>
                <div className={`p-3 border-b ${isDark ? 'border-zinc-700' : 'border-gray-200'} text-xs italic ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                  You may enable Advanced Rules from other solo story cards to increase difficulty or variety.
                </div>
                {allPotentialAdvancedRules.map((rule) => {
                  const isChecked = !!gameState.challengeOptions[rule.id];
                  const isDisabled = rule.id === disabledRuleId;
                  
                  return (
                    <label 
                      key={rule.id}
                      className={cls(
                        "flex items-start p-3 border-b last:border-b-0 transition-colors", 
                        isDark ? 'border-zinc-700' : 'border-gray-200',
                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-black/5 dark:hover:bg-white/5'
                      )}
                    >
                      <div className="relative flex items-center mt-0.5">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          checked={isChecked}
                          disabled={isDisabled}
                          onChange={() => !isDisabled && handleToggleChallengeOption(rule.id)}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <span className={`font-medium ${isChecked ? (isDark ? 'text-purple-300' : 'text-purple-800') : (isDark ? 'text-gray-300' : 'text-gray-700')}`}>
                          {rule.title}
                        </span>
                        {rule.description && !isDisabled && (
                          <p className={`text-xs italic mt-1 ${isDark ? 'text-gray-500' : 'text-gray-600'}`}>
                            {rule.description}
                          </p>
                        )}
                        {isDisabled && (
                          <p className="text-xs italic mt-1 text-amber-600 dark:text-amber-500">
                            (Unavailable: This rule is on the back of the selected Story Card)
                          </p>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Desktop Nav */}
      <div className={`hidden xl:flex mt-8 justify-between clear-both pt-6 border-t ${navBorderTop}`}>
        <Button onClick={onBack} variant="secondary" className="shadow-sm" disabled={isNavigating}>
          ← Back
        </Button>
        <Button 
          onClick={onNext} 
          className="shadow-lg hover:translate-y-[-2px] transition-transform"
          disabled={isNavigating}
        >
          Next Step →
        </Button>
      </div>

      {/* Sticky Mobile Nav */}
      <div className={cls(
        "fixed bottom-0 left-0 right-0 p-4 border-t z-[60] flex xl:hidden justify-between gap-4 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-colors duration-300",
        footerBg, footerBorder
      )}>
        <Button 
          onClick={onBack} 
          variant="secondary"
          disabled={isNavigating}
          className="flex-1 text-xs uppercase tracking-wider !py-3"
        >
          ← Back
        </Button>
        <Button 
          onClick={onNext} 
          disabled={isNavigating}
          className="flex-[2] text-xs uppercase tracking-[0.1em] !py-3"
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
};
