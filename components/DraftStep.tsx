

import React, { useState, useEffect, useMemo } from 'react';
import { DraftState, StructuredContent, StructuredContentPart } from '../types';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils/draft';
import { getDraftDetails } from '../utils/draftRules';
import { Button } from './Button';
import { DiceControls } from './DiceControls';
import { SpecialRuleBlock, SpecialRuleBlockProps } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';
import { getCampaignNotesForStep } from '../utils/selectors/story';

// Helper to recursively flatten structured content to a searchable string for categorization
const getTextContent = (content: StructuredContent | StructuredContentPart | undefined): string => {
    if (typeof content === 'string') {
        return content;
    }
    if (Array.isArray(content)) {
        return content.map(part => getTextContent(part)).join('');
    }
    if (!content) return '';

    switch(content.type) {
        case 'strong':
        case 'action':
        case 'paragraph':
        case 'warning-box':
            // FIX: Type assertion to handle the recursive nature of StructuredContentPart
            return getTextContent(content.content as StructuredContent | StructuredContentPart);
        case 'list':
        case 'numbered-list':
            return content.items.map(item => getTextContent(item)).join(' ');
        case 'sub-list':
            return content.items.map(item => item.ship).join(' ');
        case 'br':
            return ' ';
        default:
            return '';
    }
};

// Sub-component for Draft Order
const DraftOrderPanel = ({ 
    draftOrder, 
    isSolo, 
    isHavenDraft, 
    isBrowncoatDraft,
    stepBadgeClass,
    infoBlocks
}: { 
    draftOrder: string[]; 
    isSolo: boolean; 
    isHavenDraft: boolean; 
    isBrowncoatDraft: boolean;
    stepBadgeClass: string; 
    infoBlocks: React.ReactNode[];
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    const panelSubColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const itemBg = isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100';
    const itemText = isDark ? 'text-gray-200' : 'text-gray-800';

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
              <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 1</div>
              <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                  {isHavenDraft ? 'Select Leader & Ship' : 'Select Ship & Leader'}
              </h4>
              
              {infoBlocks.length > 0 && (
                <div className="space-y-2 mb-3">
                    {infoBlocks}
                </div>
              )}

              <p className={cls("text-xs mb-3 italic", panelSubColor)}>
                {isSolo 
                    ? (isHavenDraft ? "Choose a Leader & Ship." : "Choose a Leader & Ship.")
                    : isHavenDraft 
                    ? "The player with the highest die roll chooses a Leader & Ship first. Pass to Left.": isBrowncoatDraft ? "Winner selects Leader OR buys Ship. Pass to Left." : "Winner selects Leader & Ship. Pass to Left."}
              </p>
              <ul className="space-y-2">
                {draftOrder.map((player, i) => (
                  <li key={i} className={cls("flex items-center p-2 rounded border", itemBg)}>
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                    <span className={cls("text-sm font-medium", itemText)}>{player}</span>
                    {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isDark ? 'text-blue-400' : 'text-blue-600')}>Pick 1</span>}
                  </li>
                ))}
              </ul>
        </div>
    );
};

// Sub-component for Placement Order
const PlacementOrderPanel = ({
    placementOrder,
    isSolo,
    isHavenDraft,
    isBrowncoatDraft,
    specialStartSector,
    stepBadgeClass,
    infoBlocks
}: {
    placementOrder: string[];
    isSolo: boolean;
    isHavenDraft: boolean;
    isBrowncoatDraft: boolean;
    specialStartSector: string | null;
    stepBadgeClass: string;
    infoBlocks: React.ReactNode[];
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    const panelSubColor = isDark ? 'text-gray-400' : 'text-gray-500';
    const itemBg = isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100';
    const itemText = isDark ? 'text-gray-200' : 'text-gray-800';
    
    const specialPlacementBg = isDark ? 'bg-amber-950/40 border-amber-800' : 'bg-amber-50 border-amber-200';
    const specialPlacementTitle = isDark ? 'text-amber-100' : 'text-amber-900';
    const specialPlacementText = isDark ? 'text-amber-300' : 'text-amber-800';
    const specialPlacementSub = isDark ? 'text-amber-400' : 'text-amber-700';

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
            <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 2</div>
            <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                {isHavenDraft ? 'Haven Placement' : 'Placement'}
            </h4>

            {infoBlocks.length > 0 && (
                <div className="space-y-2 mb-3">
                    {infoBlocks}
                </div>
            )}
            
            {isHavenDraft ? (
                <>
                <p className={cls("text-xs mb-3 italic", isDark ? 'text-green-300' : 'text-green-800')}>
                    {isSolo ? "Place Haven in a valid sector." : "The last player to choose a Leader places their Haven first. Remaining players in reverse order."}
                </p>
                <ul className="space-y-2">
                    {placementOrder.map((player, i) => (
                    <li key={i} className={cls("flex items-center p-2 rounded border", itemBg)}>
                        <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                        <span className={cls("text-sm font-medium", itemText)}>{player}</span>
                        {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isDark ? 'text-green-400' : 'text-green-600')}>Placement 1</span>}
                    </li>
                    ))}
                </ul>
                </>
            ) : specialStartSector ? (
                <div className={cls("p-4 rounded text-center border", specialPlacementBg)}>
                    <p className={cls("font-bold mb-1", specialPlacementTitle)}>Special Placement</p>
                    <p className={cls("text-sm", specialPlacementText)}>All ships start at <strong>{specialStartSector}</strong>.</p>
                    <p className={cls("text-xs italic mt-1", specialPlacementSub)}>(Do not place in separate sectors)</p>
                </div>
            ) : (
                <>
                <p className={cls("text-xs mb-3 italic", panelSubColor)}>
                    {isSolo 
                        ? (isBrowncoatDraft ? "Buy Fuel ($100) and place ship." : "Place Ship in Sector.")
                        : isBrowncoatDraft 
                        ? "Pass back to Right. Make remaining choice. Buy Fuel ($100)."
                        : "Pass to Right (Anti-Clockwise). Place Ship in Sector."
                    }
                </p>
                <ul className="space-y-2">
                    {placementOrder.map((player, i) => (
                    <li key={i} className={cls("flex items-center p-2 rounded border", itemBg)}>
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                        <span className={cls("text-sm font-medium", itemText)}>{player}</span>
                        {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isDark ? 'text-amber-400' : 'text-amber-600')}>Placement 1</span>}
                    </li>
                    ))}
                </ul>
                </>
            )}
        </div>
    );
};

export const DraftStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.playerCount === 1;
  
  const {
      specialRules,
      isHavenDraft,
      isBrowncoatDraft,
      specialStartSector,
  } = React.useMemo(() => getDraftDetails(gameState, step), [gameState, step]);
  
  const campaignNotes = useMemo(
    () => getCampaignNotesForStep(gameState, step.id), 
    [gameState, step.id]
  );

  const { draftPhaseInfo, placementPhaseInfo } = useMemo(() => {
    const draft: React.ReactNode[] = [];
    const placement: React.ReactNode[] = [];

    const allNotes = campaignNotes.map((note, i) => (
      <SpecialRuleBlock key={`campaign-${i}`} source="story" title="Campaign Setup Note" content={note.content} />
    ));

    const allRules = specialRules.map((rule, i) => <SpecialRuleBlock key={`special-${i}`} {...rule} />);

    [...allNotes, ...allRules].forEach(component => {
      const props = component.props as SpecialRuleBlockProps;
      const title = (props.title || '').toLowerCase();
      const content = getTextContent(props.content).toLowerCase();

      const placementTriggers = [
        'placement', 'haven', 'market', 'start at', 'sector', 'fuel', 'parts', 'outside alliance', 'off limits', 'conflict'
      ];
      
      const isPlacementRule = placementTriggers.some(trigger => title.includes(trigger) || content.includes(trigger));

      if (isPlacementRule) {
        placement.push(component);
      } else {
        draft.push(component);
      }
    });

    return { draftPhaseInfo: draft, placementPhaseInfo: placement };
  }, [campaignNotes, specialRules]);

  useEffect(() => {
    if (isSolo && !draftState) {
        setDraftState(getInitialSoloDraftState(gameState.playerNames[0]));
    }
  }, [isSolo, gameState.playerNames, draftState]);

  const handleDetermineOrder = () => {
    setDraftState(runAutomatedDraft(gameState.playerNames));
    setIsManualEntry(false);
  };

  const handleRollChange = (index: number, newValue: string) => {
    if (!draftState) return;
    const val = parseInt(newValue) || 0;
    const newRolls = [...draftState.rolls];
    newRolls[index] = { ...newRolls[index], roll: val };
    const newState = calculateDraftOutcome(newRolls, gameState.playerCount);
    setDraftState(newState);
    setIsManualEntry(true);
  };

  const handleSetWinner = (index: number) => {
    if (!draftState) return;
    const newState = calculateDraftOutcome(draftState.rolls, gameState.playerCount, index);
    setDraftState(newState);
  };

  const introText = isDark ? 'text-gray-400' : 'text-gray-600';
  const stepBadgeBlueBg = isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
  const stepBadgeAmberBg = isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';

  return (
    <>
      {!isSolo && <p className={cls("mb-4 italic", introText)}>Determine who drafts first using a D6. Ties are resolved automatically.</p>}
      
      {!draftState && (
        <div className="space-y-4">
            {draftPhaseInfo}
            {placementPhaseInfo}
        </div>
      )}

      {!draftState ? (
        <Button onClick={handleDetermineOrder} variant="secondary" fullWidth className="my-4">
           🎲 Roll for {isHavenDraft ? 'Haven Draft' : 'Command'}
        </Button>
      ) : (
        <div className="animate-fade-in space-y-6">
          {!isSolo && (
            <DiceControls 
                draftState={draftState} 
                onRollChange={handleRollChange} 
                onSetWinner={handleSetWinner}
                allowManualOverride={isManualEntry}
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DraftOrderPanel 
                draftOrder={draftState.draftOrder}
                isSolo={isSolo}
                isHavenDraft={isHavenDraft}
                isBrowncoatDraft={isBrowncoatDraft}
                stepBadgeClass={stepBadgeBlueBg}
                infoBlocks={draftPhaseInfo}
            />

            <PlacementOrderPanel 
                placementOrder={draftState.placementOrder}
                isSolo={isSolo}
                isHavenDraft={isHavenDraft}
                isBrowncoatDraft={isBrowncoatDraft}
                specialStartSector={specialStartSector}
                stepBadgeClass={stepBadgeAmberBg}
                infoBlocks={placementPhaseInfo}
            />
          </div>
        </div>
      )}
    </>
  );
};
