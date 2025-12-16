import React from 'react';
import { StoryCardDef } from '../../types';
import { SpecialRuleBlock } from '../SpecialRuleBlock';
import { useTheme } from '../ThemeContext';
import { InlineExpansionIcon } from '../InlineExpansionIcon';
import { ExpansionIcon } from '../ExpansionIcon';
import { useGameState } from '../../hooks/useGameState';
import { ActionType } from '../../state/actions';

interface StoryDossierProps {
  activeStoryCard: StoryCardDef;
}

const SOLO_TIMER_ADJUSTMENTS: Record<string, string> = {
  "Desperadoes": "Declare Last Call before discarding your last token to win the game.",
  "\"Respectable\" Persons Of Business": "Declare Last Call before discarding your last token to win the game.",
  "A Rare Specimen Indeed": "Send Out Invites before discarding your last token to win the game."
};

export const StoryDossier: React.FC<StoryDossierProps> = ({ activeStoryCard }) => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const handleGoalSelect = (goalTitle: string) => {
    dispatch({ type: ActionType.SET_GOAL, payload: goalTitle });
  };

  const setupNote = activeStoryCard.setupConfig?.shipPlacementMode === 'persephone' 
      ? "⚠️ Change of setup: Players now begin at Persephone." 
      : activeStoryCard.setupConfig?.startAtLondinium
      ? "⚠️ Change of setup: Players now begin at Londinium."
      : null;

  const mainTitleColor = isDark ? 'text-gray-100' : 'text-[#292524]';
  const italicTextColor = isDark ? 'text-gray-300' : 'text-[#57534e]';
  const bodyBg = isDark ? 'bg-zinc-900/50' : 'bg-transparent';
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

      {/* Detailed Setup Description Block */}
      {activeStoryCard.setupDescription && (
        <SpecialRuleBlock source="story" title="Story Override">
          {activeStoryCard.setupDescription}
        </SpecialRuleBlock>
      )}

      {/* Solo Adjustments */}
      {gameState.gameMode === 'solo' && SOLO_TIMER_ADJUSTMENTS[activeStoryCard.title] && (
        <SpecialRuleBlock source="expansion" title="Solo Adjustment">
          {SOLO_TIMER_ADJUSTMENTS[activeStoryCard.title]}
        </SpecialRuleBlock>
      )}

      {/* Solo Mode Information Block */}
      {gameState.setupCardId === 'FlyingSolo' && (
        <SpecialRuleBlock source="expansion" title="10th AE Solo Rules">
          <p>You may play any Story Card in Expanded Solo Mode. Automated NPC movement and Variable Timer rules apply.</p>
        </SpecialRuleBlock>
      )}

      {setupNote && !activeStoryCard.setupDescription && (
        <SpecialRuleBlock source="warning" title="Location Override">
          {setupNote}
        </SpecialRuleBlock>
      )}

      {gameState.setupCardId === 'TheRimsTheThing' && (
        <SpecialRuleBlock source="setupCard" title="Setup Card Override">
          <strong>The Rim's The Thing:</strong> Remember that only <strong>Border Space</strong> Nav Decks are used in this setup card. Choose a mission achievable with limited navigation options.
        </SpecialRuleBlock>
      )}

      {activeStoryCard.sourceUrl && (
        <div className={`mt-4 pt-2 border-t border-dashed ${isDark ? 'border-zinc-700' : 'border-gray-300'}`}>
          <a 
            href={activeStoryCard.sourceUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`inline-flex items-center text-xs font-bold uppercase tracking-wider underline hover:opacity-80 transition-opacity ${isDark ? 'text-blue-400' : 'text-blue-800'}`}
          >
            <span>View Community Source</span>
            <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          </a>
        </div>
      )}
    </div>
  );
};
