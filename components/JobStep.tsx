import React, { useMemo } from 'react';
import { Step } from '../types';
import { getJobSetupDetails } from '../utils/selectors/setup';
import { getActiveStoryCard } from '../utils/selectors/story';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { STEP_IDS } from '../data/ids';

interface JobStepProps {
  step: Step;
}

export const JobStep = ({ step }: JobStepProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { overrides = {} } = step;
  const activeStoryCard = getActiveStoryCard(gameState);
  // FIX: step.data does not have an 'id' property. The step's ID is on the step object itself.
  const stepId = step.id;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { isCampaign } = gameState;
  
  const { 
    contacts, 
    messages, 
    showStandardContactList, 
    isSingleContactChoice,
    cardsToDraw,
    totalJobCards,
  } = useMemo(() => 
    getJobSetupDetails(gameState, overrides),
    [gameState, overrides]
  );
  
  const isSelectedStory = !!gameState.selectedStoryCard;
  const isRimDeckBuild = stepId.includes(STEP_IDS.D_RIM_JOBS);

  const activeChallenges = useMemo(() => 
    activeStoryCard?.challengeOptions?.filter(
      opt => gameState.challengeOptions[opt.id]
    ) || [], 
  [activeStoryCard?.challengeOptions, gameState.challengeOptions]);

  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const pillBg = isDark ? 'bg-zinc-800' : 'bg-gray-100';
  const pillText = isDark ? 'text-gray-300' : 'text-gray-900';
  const pillBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
  const dividerBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const noteText = isDark ? 'text-gray-400' : 'text-gray-700';

  return (
    <div className="space-y-4">
      {isSelectedStory && isCampaign && (
        <SpecialRuleBlock source="story" title="Campaign Rules: Jobs & Contacts" content={[
          { type: 'paragraph', content: ["For each Contact you were Solid with at the end of the last game, remove 2 of your completed Jobs from play."] },
          { type: 'paragraph', content: ["Keep any remaining completed Jobs; you begin the game ", { type: 'strong', content: "Solid with those Contacts" }, "."] }
        ]} />
      )}

      {isRimDeckBuild && (
        <SpecialRuleBlock source="setupCard" title="Rim Space Jobs" content={[
          { type: 'paragraph', content: [{ type: 'strong', content: "Rebuild the Contact Decks" }, " using ", { type: 'strong', content: "only" }, " cards from the Blue Sun and Kalidasa expansions."] }
        ]} />
      )}

      {messages.map((msg, idx) => {
          if (msg.source === 'story' && !isSelectedStory) return null;
          return <SpecialRuleBlock key={idx} source={msg.source} title={msg.title} content={msg.content} />;
      })}

      {showStandardContactList && !isRimDeckBuild && (
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300`}>
          {isSingleContactChoice ? (
            <>
              <p className={`mb-4 font-bold ${textColor} text-lg`}>Choose 1 Contact from the available list:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {contacts.map(contact => (
                  <span key={contact} className={`px-3 py-1 ${pillBg} ${pillText} rounded-full text-sm border ${pillBorder} shadow-sm font-bold`}>
                    {contact}
                  </span>
                ))}
              </div>
              <p className={`text-lg font-bold ${isDark ? 'text-amber-400' : 'text-amber-800'} mb-2`}>
                Draw {cardsToDraw || 3} Job Cards from your chosen contact.
              </p>
            </>
          ) : (
            <>
              <p className={`mb-4 font-bold ${textColor} text-lg`}>Draw 1 Job Card from each:</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {contacts.map(contact => (
                  <span key={contact} className={`px-3 py-1 ${pillBg} ${pillText} rounded-full text-sm border ${pillBorder} shadow-sm font-bold`}>
                    {contact}
                  </span>
                ))}
              </div>
            </>
          )}
          <p className={`text-sm ${noteText} border-t ${dividerBorder} pt-3 mt-2 italic`}>
            Discard any unwanted jobs. {totalJobCards > 3 && !isSingleContactChoice && <span>Keep a hand of <strong>up to three</strong> Job Cards.</span>}
          </p>
        </div>
      )}

      {isSelectedStory && activeChallenges.length > 0 && !messages.some(m => m.title === 'Challenge Active') && (
        <SpecialRuleBlock source="warning" title="Story Directives (Challenges)" content={[
          { type: 'list', items: activeChallenges.map(opt => [opt.label]) },
          { type: 'paragraph', content: ["These restrictions apply throughout the game."] }
        ]} />
      )}
    </div>
  );
};