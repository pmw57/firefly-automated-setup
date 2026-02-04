
import React, { useMemo } from 'react';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useGameState } from '../hooks/useGameState';
import { useJobSetupDetails } from '../hooks/useJobSetupDetails';
import { getCampaignNotesForStep } from '../utils/selectors/story';
import { StepComponentProps } from './StepContent';
import { SpecialRule, StructuredContent, StructuredContentPart } from '../types';
import { StructuredContentRenderer } from './StructuredContentRenderer';

export const JobStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { playerCount, setupMode } = gameState;
  const { overrides = {} } = step;
  
  const { 
    contactList,
    infoMessages,
    overrideMessages,
    caperDraw,
    mainContent,
    mainContentPosition,
    primeInstruction,
  } = useJobSetupDetails(overrides);

  const processedMainContent = useMemo(() => {
    if (!mainContent) {
      return undefined;
    }

    const process = (content: StructuredContent): StructuredContent => {
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
            return part;
        }
      });
    };

    return process(mainContent);
  }, [mainContent, playerCount]);

  const formatRules = (rules: SpecialRule[], addNotes = false) => {
      const combined = [...rules];
      if (addNotes) {
          const campaignNotes = getCampaignNotesForStep(gameState, step.id);
          const notesAsRules: SpecialRule[] = campaignNotes.map(note => ({
            source: 'story',
            title: 'Campaign Setup Note',
            content: note.content
          }));
          combined.push(...notesAsRules);
      }

      const order: Record<SpecialRule['source'], number> = {
          expansion: 1, setupCard: 2, story: 3, warning: 0, info: 0,
      };

      let sorted = combined.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));

      if (setupMode === 'quick') {
        sorted = sorted.filter(b => b.source !== 'story');
      }
      return sorted;
  };

  const displayInfo = formatRules(infoMessages);
  const displayOverrides = formatRules(overrideMessages, true);
  
  const infoBefore = displayInfo.filter(r => r.position !== 'after');
  const infoAfter = displayInfo.filter(r => r.position === 'after');

  const overridesBefore = displayOverrides.filter(r => r.position === 'before');
  const overridesAfter = displayOverrides.filter(r => r.position !== 'before');
  
  const ContactListBlock = contactList ? (
      <div className="bg-surface-card/60 backdrop-blur-sm rounded-lg border border-border-separator shadow-sm transition-colors duration-300 overflow-hidden">
          <div className="p-4 md:p-6">
              <h4 className="font-bold text-lg mb-3 pb-2 border-b text-content-primary border-border-subtle">
                {contactList.title}
              </h4>
              <p className="text-sm mb-4 text-content-secondary">
                {contactList.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {contactList.contacts.map(contact => (
                  <div key={contact} className="text-center font-western p-3 rounded border font-bold bg-surface-subtle border-border-subtle text-content-accent">
                  {contact}
                  </div>
              ))}
              </div>

              {contactList.isOverridden && (
              <p className="text-xs mt-4 italic text-content-subtle">
                  Note: The list of available contacts has been modified by the current setup.
              </p>
              )}
          </div>
      </div>
  ) : null;
  
  const CaperMessageBlock = (caperDraw && caperDraw > 0) ? (
    <div className="bg-surface-card/60 backdrop-blur-sm rounded-lg border border-border-separator shadow-sm p-6 text-center text-content-secondary">
        <p className="font-semibold">Draw {caperDraw} Caper{caperDraw > 1 ? 's' : ''}</p>
    </div>
  ) : null;

  const PrimeContactsBlock = primeInstruction ? (
    <div className="bg-surface-card/60 backdrop-blur-sm rounded-lg border border-border-separator shadow-sm p-4 md:p-6 text-content-secondary">
      <h4 className="font-bold text-lg mb-3 pb-2 border-b text-content-primary border-border-subtle">
        Prime Contact Decks
      </h4>
      <StructuredContentRenderer content={primeInstruction} />
    </div>
  ) : null;

  const MainContentBlock = processedMainContent ? (
    <div className="bg-surface-card/60 backdrop-blur-sm rounded-lg border border-border-separator shadow-sm p-4 md:p-6 text-content-secondary">
      <StructuredContentRenderer content={processedMainContent} />
    </div>
  ) : null;

  return (
    <div className="space-y-6">
      {/* Top Section: Info & Pre-Overrides */}
      {infoBefore.map((block, i) => <OverrideNotificationBlock key={`info-before-${i}`} {...block} />)}
      {overridesBefore.map((block, i) => <OverrideNotificationBlock key={`override-before-${i}`} {...block} />)}

      {/* Main Content Area */}
      {mainContentPosition === 'after' ? (
        <>
          {ContactListBlock}
          {CaperMessageBlock}
          {PrimeContactsBlock}
          {MainContentBlock}
        </>
      ) : (
        <>
          {MainContentBlock}
          {ContactListBlock}
          {CaperMessageBlock}
          {PrimeContactsBlock}
        </>
      )}

      {/* Bottom Section: Post-Info & Standard Overrides */}
      {infoAfter.map((block, i) => <OverrideNotificationBlock key={`info-after-${i}`} {...block} />)}
      {overridesAfter.map((block, i) => <OverrideNotificationBlock key={`override-after-${i}`} {...block} />)}
    </div>
  );
};
