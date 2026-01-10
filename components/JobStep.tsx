import React, { useMemo } from 'react';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { useJobSetupDetails } from '../hooks/useJobSetupDetails';
import { getCampaignNotesForStep } from '../utils/selectors/story';
import { StepComponentProps } from './StepContent';
import { SpecialRule, StructuredContent, StructuredContentPart } from '../types';
import { cls } from '../utils/style';
import { StructuredContentRenderer } from './StructuredContentRenderer';

export const JobStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { playerCount } = gameState;
  const { overrides = {} } = step;
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const { 
    contacts, 
    messages, 
    showStandardContactList, 
    isSingleContactChoice,
    cardsToDraw = 0,
    caperDrawCount,
    isContactListOverridden,
    jobDrawMode,
    mainContent,
    mainContentPosition,
    showNoJobsMessage: showNoJobsMessageFromData,
  } = useJobSetupDetails(overrides);

  const processedMainContent = useMemo(() => {
    if (!mainContent) {
      return undefined;
    }

    const process = (content: StructuredContent): StructuredContent => {
      // FIX: Replaced chained `if` statements with a `switch` on `part.type` for robust type narrowing.
      // This resolves a TypeScript error where the compiler couldn't correctly infer the type of `part.content`,
      // leading to a type mismatch when recursively processing nested content.
      return content.flatMap((part: StructuredContentPart): StructuredContentPart | StructuredContentPart[] => {
        if (typeof part === 'string') {
          return part;
        }

        switch (part.type) {
          case 'placeholder':
            if (part.id === 'wind-takes-us-draw-count') {
              return playerCount <= 3
                ? 'Draw 4 Job Cards each.'
                : 'Draw 3 Job Cards each.';
            }
            return part;

          case 'paragraph':
          case 'warning-box':
            return { ...part, content: process(part.content) };

          case 'list':
          case 'numbered-list':
            return { ...part, items: part.items.map(item => process(item)) };

          default:
            // For types like 'strong', 'action', 'br', 'sub-list' which don't have
            // nested StructuredContent that can contain placeholders, we can return them as-is.
            return part;
        }
      });
    };

    return process(mainContent);
  }, [mainContent, playerCount]);

  const sortedInfoBlocks = useMemo(() => {
    const blocks: SpecialRule[] = [];

    const campaignNotes = getCampaignNotesForStep(gameState, step.id);
    blocks.push(...campaignNotes.map(note => ({
      source: 'story' as const,
      title: 'Campaign Setup Note',
      content: note.content
    })));

    blocks.push(...messages);
    
    const order: Record<SpecialRule['source'], number> = {
        expansion: 1, setupCard: 2, story: 3, warning: 3, info: 4,
    };

    return blocks.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));
  }, [messages, gameState, step.id]);
  
  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const sectionHeaderColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const sectionHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
  const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
  const contactColor = isDark ? 'text-amber-400' : 'text-firefly-brown';

  // Determine the correct phrasing for keeping jobs.
  const actualDrawCount = isSingleContactChoice ? 1 : contacts.length;
  const keepText = cardsToDraw >= actualDrawCount && actualDrawCount > 0
    ? 'any of the Job Cards drawn.'
    : `up to ${cardsToDraw} Job Cards.`;

  const isSharedHand = jobDrawMode === 'shared_hand';
  const showNoJobsMessage = (!showStandardContactList && (jobDrawMode === 'no_jobs')) || showNoJobsMessageFromData;

  const StandardContentBlock = (
    <>
      {showStandardContactList && (
          <div className={cls(cardBg, "rounded-lg border", cardBorder, "shadow-sm transition-colors duration-300 overflow-hidden")}>
          <div className="p-4 md:p-6">
              <h4 className={cls("font-bold text-lg mb-3 pb-2 border-b", sectionHeaderColor, sectionHeaderBorder)}>
                {isSharedHand ? 'Shared Hand Draw' : 'Starting Job Draw'}
              </h4>
              <p className={cls("text-sm mb-4", textColor)}>
                {isSharedHand ? (
                    "Place one Job Card from each Contact Deck listed below face up on top of their Contact's deck."
                ) : (
                    <>
                        {isSingleContactChoice
                            ? `Choose ONE contact deck below.`
                            : `Draw one Job Card from each Contact Deck listed below.`
                        }
                        {` You may keep ${keepText}`}
                    </>
                )}
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
      {showNoJobsMessage && (
        <div className={cls(cardBg, "rounded-lg border", cardBorder, "shadow-sm p-6 text-center", textColor)}>
          <p className="font-semibold">No Starting Jobs are dealt for this setup.</p>
        </div>
      )}
    </>
  );
  
  const CaperMessageBlock = (jobDrawMode === 'caper_start' && caperDrawCount && caperDrawCount > 0) ? (
    <div className={cls(cardBg, "rounded-lg border", cardBorder, "shadow-sm p-6 text-center", textColor)}>
        <p className="font-semibold">Draw {caperDrawCount} Caper{caperDrawCount > 1 ? 's' : ''}</p>
    </div>
  ) : null;

  // FIX: Define `MainContentBlock` to render `processedMainContent`. `MainContentBlock` was used but not defined, causing a reference error. This change defines it as a JSX element that renders the processed structured content for the step, using styles consistent with other content blocks in the component.
  const MainContentBlock = processedMainContent ? (
    <div className={cls(cardBg, "rounded-lg border", cardBorder, "shadow-sm p-4 md:p-6", textColor)}>
      <StructuredContentRenderer content={processedMainContent} />
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      {sortedInfoBlocks.map((block, i) => <OverrideNotificationBlock key={`info-${i}`} {...block} />)}

      {mainContentPosition === 'after' ? (
        <>
          {StandardContentBlock}
          {CaperMessageBlock}
          {MainContentBlock}
        </>
      ) : (
        <>
          {MainContentBlock}
          {StandardContentBlock}
          {CaperMessageBlock}
        </>
      )}
    </div>
  );
};