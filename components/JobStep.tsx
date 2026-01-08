import React, { useMemo } from 'react';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { useJobSetupDetails } from '../hooks/useJobSetupDetails';
import { getActiveStoryCard, getCampaignNotesForStep } from '../utils/selectors/story';
import { STEP_IDS } from '../data/ids';
import { StepComponentProps } from './StepContent';
import { ChallengeOption, SpecialRule } from '../types';
import { cls } from '../utils/style';

export const JobStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { overrides = {} } = step;
  const activeStoryCard = getActiveStoryCard(gameState);
  const stepId = step.id;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { 
    contacts, 
    messages, 
    showStandardContactList, 
    isSingleContactChoice,
    cardsToDraw,
    caperDrawCount,
    isContactListOverridden,
  } = useJobSetupDetails(overrides);
  
  const isSelectedStory = gameState.selectedStoryCardIndex !== null;
  const isRimDeckBuild = stepId.includes(STEP_IDS.D_RIM_JOBS);

  const activeChallenges = useMemo(() => 
    activeStoryCard?.challengeOptions?.filter(
      (opt: ChallengeOption) => gameState.challengeOptions[opt.id]
    ) || [], 
  [activeStoryCard?.challengeOptions, gameState.challengeOptions]);

  const sortedInfoBlocks = useMemo(() => {
    const blocks: SpecialRule[] = [];

    const campaignNotes = getCampaignNotesForStep(gameState, step.id);
    blocks.push(...campaignNotes.map(note => ({
      source: 'story' as const,
      title: 'Campaign Setup Note',
      content: note.content
    })));

    if (isRimDeckBuild) {
        blocks.push({ source: 'setupCard', title: 'Rim Space Jobs', content: [
          { type: 'paragraph', content: [{ type: 'strong', content: "Rebuild the Contact Decks" }, " using ", { type: 'strong', content: "only" }, " cards from the Blue Sun and Kalidasa expansions."] }
        ]});
    }

    // Filter out Caper Bonus as it's handled by a dedicated component.
    blocks.push(...messages.filter(msg => 
      !(msg.source === 'story' && !isSelectedStory) && 
      msg.title !== 'Caper Bonus'
    ));
    
    if (isSelectedStory && activeChallenges.length > 0 && !messages.some(m => m.title === 'Challenge Active')) {
        activeChallenges.forEach(challenge => {
            blocks.push({
                source: 'warning',
                title: 'Challenge Active',
                content: [{ type: 'strong', content: challenge.label }]
            });
        });
    }

    const order: Record<SpecialRule['source'], number> = {
        expansion: 1, setupCard: 2, story: 3, warning: 3, info: 4,
    };

    return blocks.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));
  }, [messages, gameState, step.id, isRimDeckBuild, isSelectedStory, activeChallenges]);
  
  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const sectionHeaderColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const sectionHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const contactColor = isDark ? 'text-amber-400' : 'text-firefly-brown';

  return (
    <div className="space-y-6">
      {sortedInfoBlocks.map((block, i) => <SpecialRuleBlock key={`info-${i}`} {...block} />)}

      {caperDrawCount && (
        <SpecialRuleBlock 
            source="story" 
            title="Caper Bonus" 
            content={[`Draw ${caperDrawCount} Caper Card${caperDrawCount > 1 ? 's' : ''}.`]} 
        />
      )}

      {showStandardContactList && (
        <div className={cls(cardBg, "rounded-lg border", cardBorder, "shadow-sm transition-colors duration-300 overflow-hidden")}>
          <div className="p-4 md:p-6">
            <h4 className={cls("font-bold text-lg mb-3 pb-2 border-b", sectionHeaderColor, sectionHeaderBorder)}>Starting Job Draw</h4>
            <p className={cls("text-sm mb-4", textColor)}>
              {isSingleContactChoice
                ? `Choose ONE contact deck below.`
                : `Draw one Job Card from each Contact Deck listed below.`
              }
              {` You may keep up to ${cardsToDraw} Job Cards.`}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {contacts.map(contact => (
                <div key={contact} className={cls("text-center font-western p-3 rounded border font-bold", isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-200', contactColor)}>
                  {contact}
                </div>
              ))}
            </div>

            {isContactListOverridden && (
              <p className={cls("text-xs mt-4 italic", isDark ? 'text-gray-500' : 'text-gray-600')}>
                Note: The list of available contacts has been modified by the current setup.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};