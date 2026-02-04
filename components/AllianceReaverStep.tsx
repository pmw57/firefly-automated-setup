
import React, { useMemo, useCallback } from 'react';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useGameState } from '../hooks/useGameState';
import { useAllianceReaverDetails } from '../hooks/useAllianceReaverDetails';
import { StepComponentProps } from './StepContent';
import { SpecialRule, StructuredContentPart } from '../types';
import { cls } from '../utils/style';
import { getCampaignNotesForStep } from '../utils/selectors/story';

// Simple renderer for the override content to avoid duplicating the full OverrideNotificationBlock.
const renderContent = (content: StructuredContentPart[]): React.ReactNode => {
    return content.map((part, index) => {
      if (typeof part === 'string') {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }
      if (part.type === 'strong' || part.type === 'action') {
        return <strong key={index}>{part.content}</strong>;
      }
      if (part.type === 'br') {
        return <br key={index} />;
      }
      return null;
    });
};

export const AllianceReaverStep: React.FC<StepComponentProps> = ({ step }) => {
  const { state: gameState } = useGameState();
  const { setupMode } = gameState;

  const {
    infoRules,
    overrideRules,
    standardAlliancePlacement,
    standardReaverPlacement,
    allianceOverride,
    reaverOverride,
    isAllianceDisabled,
    isReaverDisabled,
    allianceTitle,
    reaverTitle
  } = useAllianceReaverDetails();

  const campaignNotes = useMemo(
      () => getCampaignNotesForStep(gameState, step.id),
      [gameState, step.id]
  );
  
  const formatRules = useCallback((rules: SpecialRule[], includeShipOverrides = false, addNotes = false) => {
      let combined = [...rules];

      // Add the ship-specific overrides to the list if requested.
      if (includeShipOverrides) {
          if (allianceOverride && !isAllianceDisabled) combined.push(allianceOverride);
          if (reaverOverride && !isReaverDisabled) combined.push(reaverOverride);
      }

      if (addNotes) {
          const notesAsRules: SpecialRule[] = campaignNotes.map(note => ({
              source: 'story',
              title: 'Campaign Setup Note',
              content: note.content
          }));
          combined = [...combined, ...notesAsRules];
      }
      
      const order: Record<SpecialRule['source'], number> = {
          expansion: 1, setupCard: 2, story: 3, warning: 0, info: 0,
      };
      
      let sorted = combined.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));

      if (setupMode === 'quick') {
        sorted = sorted.filter(r => r.source !== 'story');
      }

      return sorted;
  }, [setupMode, allianceOverride, reaverOverride, isAllianceDisabled, isReaverDisabled, campaignNotes]);
  
  const displayInfo = useMemo(() => formatRules(infoRules), [infoRules, formatRules]);
  const displayOverrides = useMemo(() => formatRules(overrideRules, true, true), [overrideRules, formatRules]);

  return (
    <div className="space-y-4">
      {displayInfo.map((rule, index) => (
          <OverrideNotificationBlock key={`info-${index}`} {...rule} />
      ))}

      <div className="bg-surface-card/60 backdrop-blur-sm p-4 rounded-lg border border-border-separator shadow-sm mt-4 transition-colors duration-300">
        <h3 className="text-lg font-bold text-content-primary mb-3 font-western tracking-wide border-b-2 border-border-subtle pb-1">Ship Placement</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Alliance Ship Panel */}
          <div className={cls('p-3 rounded border transition-colors', isAllianceDisabled ? 'bg-surface-subtle border-border-subtle' : 'bg-surface-info border-border-info')}>
            <strong className={cls('block text-sm uppercase mb-1', isAllianceDisabled ? 'text-content-subtle line-through' : 'text-content-info')}>
              {allianceTitle}
            </strong>
            <p className={cls('text-sm', isAllianceDisabled ? 'text-content-subtle italic' : 'text-content-info')}>
              {isAllianceDisabled 
                ? 'Not used in this scenario.' 
                : (allianceOverride ? renderContent(allianceOverride.content) : standardAlliancePlacement)
              }
            </p>
          </div>
          
          {/* Reaver Ship Panel */}
          <div className={cls('p-3 rounded border transition-colors', isReaverDisabled ? 'bg-surface-subtle border-border-subtle' : 'bg-surface-error border-border-error')}>
            <strong className={cls('block text-sm uppercase mb-1', isReaverDisabled ? 'text-content-subtle line-through' : 'text-content-error')}>
              {reaverTitle}
            </strong>
            <p className={cls('text-sm', isReaverDisabled ? 'text-content-subtle italic' : 'text-content-error')}>
              {isReaverDisabled 
                ? 'Not used in this scenario.'
                : (reaverOverride ? renderContent(reaverOverride.content) : standardReaverPlacement)
              }
            </p>
          </div>

        </div>
      </div>

      {displayOverrides.map((rule, index) => (
          <OverrideNotificationBlock key={`override-${index}`} {...rule} />
      ))}
    </div>
  );
};
