import React, { useMemo } from 'react';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { getJobSetupDetails } from '../utils/jobs';
import { getActiveStoryCard, getCampaignNotesForStep } from '../utils/selectors/story';
import { STEP_IDS, SETUP_CARD_IDS } from '../data/ids';
import { StepComponentProps } from './StepContent';
import { ChallengeOption, SpecialRule } from '../types';

export const JobStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { overrides = {} } = step;
  const activeStoryCard = getActiveStoryCard(gameState);
  const stepId = step.id;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const campaignNotes = useMemo(
    () => getCampaignNotesForStep(gameState, step.id), 
    [gameState, step.id]
  );
  
  const { 
    contacts, 
    messages, 
    showStandardContactList, 
    isSingleContactChoice,
    cardsToDraw,
    totalJobCards,
    caperDrawCount,
  } = useMemo(() => 
    getJobSetupDetails(gameState, overrides),
    [gameState, overrides]
  );
  
  const isSelectedStory = gameState.selectedStoryCardIndex !== null;
  const isRimDeckBuild = stepId.includes(STEP_IDS.D_RIM_JOBS);
  const isSolitaireFirefly = gameState.setupCardId === SETUP_CARD_IDS.SOLITAIRE_FIREFLY;

  const activeChallenges = useMemo(() => 
    activeStoryCard?.challengeOptions?.filter(
      (opt: ChallengeOption) => gameState.challengeOptions[opt.id]
    ) || [], 
  [activeStoryCard?.challengeOptions, gameState.challengeOptions]);

  const sortedInfoBlocks = useMemo(() => {
    const blocks: SpecialRule[] = [];

    // Campaign notes (Story)
    blocks.push(...campaignNotes.map(note => ({
      source: 'story' as const,
      title: 'Campaign Setup Note',
      content: note.content
    })));

    // Specific Setup Overrides
    if (isSolitaireFirefly) {
      blocks.push({ source: 'story', title: 'Solitaire Firefly: Jobs & Contacts', content: [
          { type: 'paragraph', content: ["For each Contact you were Solid with at the end of the last game, remove 2 of your completed Jobs from play."] },
          { type: 'paragraph', content: ["Keep any remaining completed Jobs; you begin the game Solid with those Contacts."] }
        ]});
    }

    if (isRimDeckBuild) {
        blocks.push({ source: 'setupCard', title: 'Rim Space Jobs', content: [
          { type: 'paragraph', content: [{ type: 'strong', content: "Rebuild the Contact Decks" }, " using ", { type: 'strong', content: "only" }, " cards from the Blue Sun and Kalidasa expansions."] }
        ]});
    }

    // Messages from rule engine (mixed sources)
    blocks.push(...messages.filter(msg => !(msg.source === 'story' && !isSelectedStory)));
    
    // Active Challenges (Story/Warning)
    if (isSelectedStory && activeChallenges.length > 0 && !messages.some(m => m.title === 'Challenge Active')) {
        blocks.push({ source: 'warning', title: 'Story Directives (Challenges)', content: [
          { type: 'list', items: activeChallenges.map((opt: ChallengeOption) => [opt.label]) },
          { type: 'paragraph', content: ["These restrictions apply throughout the game."] }
        ]});
    }
    
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1, setupCard: 2, story: 3, warning: 3, info: 4,
    };
    
    return blocks
      .sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99))
      .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
      .map((rule, i) => <SpecialRuleBlock key={`rule-${i}`} {...rule} />);
  }, [campaignNotes, isSolitaireFirefly, isRimDeckBuild, messages, isSelectedStory, activeChallenges, gameState.setupMode]);


  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-700';
  const pillBg = isDark ? 'bg-zinc-800' : 'bg-gray-100';
  const pillText = isDark ? 'text-gray-300' : 'text-gray-900';
  const pillBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
  const dividerBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const noteText = isDark ? 'text-gray-400' : 'text-gray-700';

  const CaperDeck = ({ count }: { count: number }) => (
    <div className={`${cardBg} p-6 rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300 text-center`}>
        <div className="text-5xl mb-4" role="img" aria-label="Deck of cards icon">🗃️</div>
        <h4 className={`font-bold text-xl font-western mb-2 ${textColor}`}>Caper Deck</h4>
        <p className={`${noteText}`}>Each player draws {count} Caper Card{count > 1 ? 's' : ''}.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {sortedInfoBlocks}

      {showStandardContactList && !isRimDeckBuild && (
        <div className={`${cardBg} p-6 rounded-lg border ${cardBorder} shadow-sm transition-colors duration-300`}>
          {contacts.length > 0 ? (
            <>
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
            </>
          ) : (
            <p className={`text-lg font-bold ${textColor} text-center`}>
              No starting jobs are dealt.
            </p>
          )}
        </div>
      )}

      {caperDrawCount && caperDrawCount > 0 && <CaperDeck count={caperDrawCount} />}
    </div>
  );
};