
import React, { useEffect, useMemo, useCallback } from 'react';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils/draft';
import { useDraftDetails } from '../hooks/useDraftDetails';
import { Button } from './Button';
import { DiceControls } from './DiceControls';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useGameState } from '../hooks/useGameState';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';
import { getCampaignNotesForStep } from '../utils/selectors/story';
import { SpecialRule } from '../types';
import { StructuredContentRenderer } from './StructuredContentRenderer';

// Helper for inline instructions
const DraftInstructionList = ({ rules, textColor }: { rules: SpecialRule[], textColor: string }) => {
    if (!rules || rules.length === 0) return null;
    return (
        <div className="space-y-2 mb-3">
            {rules.map((rule, i) => (
                <p key={i} className={cls("text-sm", textColor)}>
                    <StructuredContentRenderer content={rule.content} />
                </p>
            ))}
        </div>
    );
};

// Sub-component for Draft Order
const DraftOrderPanel = ({ 
    draftOrder, 
    isSolo, 
    stepBadgeClass,
    playerBadges,
    beforeRules,
    afterRules,
    title,
    description
}: { 
    draftOrder: string[]; 
    isSolo: boolean; 
    stepBadgeClass: string; 
    playerBadges: Record<number, string>;
    beforeRules: SpecialRule[];
    afterRules: SpecialRule[];
    title: string;
    description: string;
}) => {
    // Semantic Tokens
    const panelBg = 'bg-surface-card/60 backdrop-blur-sm';
    const panelBorder = 'border-border-separator';
    const panelHeaderColor = 'text-content-primary';
    const panelHeaderBorder = 'border-border-subtle';
    const panelSubColor = 'text-content-secondary';
    
    const itemBg = 'bg-surface-subtle border-border-subtle';
    const itemText = 'text-content-primary';
    const restrictionTextColor = 'text-content-warning';

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
              <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 1</div>
              <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                  {title}
              </h4>
              
              <p className={cls("text-xs mb-3 italic", panelSubColor)}>
                {description}
              </p>
              
              <DraftInstructionList rules={beforeRules} textColor={restrictionTextColor} />

              <ul className="space-y-2">
                {draftOrder.map((player, i) => {
                  const badge = playerBadges[i];
                  // Default for player 1 in standard multi is "1st Pick" unless overridden or solo
                  const defaultBadge = !isSolo && i === 0 && Object.keys(playerBadges).length === 0 ? '1st Pick' : null;
                  const displayBadge = badge || defaultBadge;

                  return (
                    <li key={i} className={cls("flex items-center p-2 rounded border", itemBg)}>
                      <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                      <span className={cls("text-sm font-medium", itemText)}>
                          {player}
                      </span>
                      {displayBadge && (
                        <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400")}>
                          {displayBadge}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {afterRules.length > 0 && (
                <div className={cls("mt-4 pt-4 border-t", panelHeaderBorder)}>
                     <DraftInstructionList rules={afterRules} textColor={restrictionTextColor} />
                </div>
              )}
        </div>
    );
};

// Sub-component for Placement Order
const PlacementOrderPanel = ({
    placementOrder,
    isSolo,
    isHavenDraft,
    specialStartSector,
    stepBadgeClass,
    beforeRules,
    afterRules,
    title,
    description
}: {
    placementOrder: string[];
    isSolo: boolean;
    isHavenDraft: boolean;
    specialStartSector: string | null;
    stepBadgeClass: string;
    beforeRules: SpecialRule[];
    afterRules: SpecialRule[];
    title: string;
    description: string;
}) => {
    // Semantic Tokens
    const panelBg = 'bg-surface-card/60 backdrop-blur-sm';
    const panelBorder = 'border-border-separator';
    const panelHeaderColor = 'text-content-primary';
    const panelHeaderBorder = 'border-border-subtle';
    const itemBg = 'bg-surface-subtle border-border-subtle';
    const itemText = 'text-content-primary';
    
    // Special states still need specific colors (Amber for Special/Override)
    const specialPlacementBg = 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800';
    const specialPlacementTitle = 'text-amber-900 dark:text-amber-100';
    const specialPlacementText = 'text-amber-800 dark:text-amber-300';
    const restrictionTextColor = 'text-content-warning';

    let content: React.ReactNode;

    if (specialStartSector) {
        // When specialStartSector is set, we suppress the standard list.
        content = (
            <div className={cls("p-4 rounded text-center border", specialPlacementBg)}>
                <p className={cls("font-bold mb-2", specialPlacementTitle)}>Fixed Starting Sector</p>
                <DraftInstructionList rules={beforeRules} textColor={specialPlacementText} />
                <DraftInstructionList rules={afterRules} textColor={specialPlacementText} />
            </div>
        );
    } else {
        const descriptionColor = isHavenDraft 
            ? 'text-green-700 dark:text-green-300'
            : 'text-content-secondary';

        content = (
            <>
                <p className={cls("text-xs mb-3 italic", descriptionColor)}>
                    {description}
                </p>

                <DraftInstructionList rules={beforeRules} textColor={restrictionTextColor} />
                
                <ul className="space-y-2">
                    {placementOrder.map((player, i) => (
                    <li key={i} className={cls("flex items-center p-2 rounded border", itemBg)}>
                        <span className={`w-6 h-6 rounded-full ${isHavenDraft ? 'bg-green-600' : 'bg-amber-500'} text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm`}>{i + 1}</span>
                        <span className={cls("text-sm font-medium", itemText)}>{player}</span>
                        {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isHavenDraft ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400')}>Places First</span>}
                    </li>
                    ))}
                </ul>
                
                {afterRules.length > 0 && (
                    <div className={cls("mt-4 pt-4 border-t", panelHeaderBorder)}>
                         <DraftInstructionList rules={afterRules} textColor={restrictionTextColor} />
                    </div>
                )}
            </>
        );
    }

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
            <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 2</div>
            <div className={cls("flex justify-between items-baseline mb-2 border-b pb-1", panelHeaderBorder)}>
                <h4 className={cls("font-bold", panelHeaderColor)}>
                    {title}
                </h4>
            </div>
            {content}
        </div>
    );
};

interface CustomDraftPanelProps {
  rule: SpecialRule;
  stepBadgeClass: string;
}

const CustomDraftPanel: React.FC<CustomDraftPanelProps> = ({ rule, stepBadgeClass }) => {
    // Semantic Tokens
    const panelBg = 'bg-surface-card/60 backdrop-blur-sm';
    const panelBorder = 'border-border-separator';
    const panelHeaderColor = 'text-content-primary';
    const panelHeaderBorder = 'border-border-subtle';
    const textColor = 'text-content-primary';
    
    const isWide = rule.flags?.includes('col-span-2');

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder, isWide && 'md:col-span-2')}>
            {rule.badge && <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>{rule.badge}</div>}
            <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                {rule.title}
            </h4>
            <div className={cls("text-sm", textColor)}>
                <StructuredContentRenderer content={rule.content} />
            </div>
        </div>
    );
};

export const DraftStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const { setDraftConfig } = useGameDispatch();
  const { state: draftState, isManual: isManualEntry } = gameState.draft;
  
  const isSolo = gameState.playerCount === 1;
  const isQuickMode = gameState.setupMode === 'quick';
  
  const {
      infoRules,
      overrideRules,
      draftPanelsBefore,
      draftPanelsAfter,
      draftShipsBefore,
      draftShipsAfter,
      draftPlacementBefore,
      draftPlacementAfter,
      isHavenDraft,
      specialStartSector,
      playerBadges,
      // Consuming text strings from hook
      selectShipTitle,
      selectShipDescription,
      placementTitle,
      placementDescription,
  } = useDraftDetails(step);

  const campaignNotes = useMemo(
    () => getCampaignNotesForStep(gameState, step.id), 
    [gameState, step.id]
  );
  
  const formatRules = useCallback((rules: SpecialRule[], addNotes = false) => {
    let combined = [...rules];
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

    if (isQuickMode) {
      sorted = sorted.filter(r => r.source !== 'story');
    }
    return sorted;
  }, [campaignNotes, isQuickMode]);
  
  const displayInfo = useMemo(() => formatRules(infoRules), [infoRules, formatRules]);
  const displayOverrides = useMemo(() => formatRules(overrideRules, true), [overrideRules, formatRules]);

  const handleDetermineOrder = useCallback(() => {
    setDraftConfig({ state: runAutomatedDraft(gameState.playerNames.slice(0, gameState.playerCount)), isManual: false });
  }, [setDraftConfig, gameState.playerNames, gameState.playerCount]);

  useEffect(() => {
    if (isSolo && !draftState) {
        setDraftConfig({ state: getInitialSoloDraftState(gameState.playerNames[0]), isManual: false });
    } else if (!isSolo && !draftState && isQuickMode) {
        handleDetermineOrder();
    }
  }, [isSolo, gameState.playerNames, gameState.playerCount, draftState, isQuickMode, handleDetermineOrder, setDraftConfig]);


  const handleRollChange = (index: number, newValue: string) => {
    if (!draftState) return;
    const val = parseInt(newValue) || 0;
    const newRolls = [...draftState.rolls];
    newRolls[index] = { ...newRolls[index], roll: val };
    const newState = calculateDraftOutcome(newRolls, gameState.playerCount);
    setDraftConfig({ state: newState, isManual: true });
  };

  const handleSetWinner = (index: number) => {
    if (!draftState) return;
    const newState = calculateDraftOutcome(draftState.rolls, gameState.playerCount, index);
    setDraftConfig({ state: newState, isManual: true });
  };

  const introText = 'text-content-secondary';
  
  // Phase Badges - Kept colorful but compatible with dark mode
  const stepBadgeBlueBg = 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
  const stepBadgeAmberBg = 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-200';
  const stepBadgePurpleBg = 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';

  return (
    <div className="space-y-6">
      {displayInfo.map((rule, i) => (
          <OverrideNotificationBlock key={`info-${i}`} {...rule} />
      ))}
      
      {!draftState && !isSolo && (
         <div className="text-center py-6">
             <p className={cls("mb-4", introText)}>
                Roll dice to determine who picks first.
             </p>
             <Button onClick={handleDetermineOrder}>
                Roll & Determine Order
             </Button>
         </div>
      )}

      {draftState && (
        <>
            {!isSolo && (
                <div className="animate-fade-in">
                    <DiceControls 
                        draftState={draftState} 
                        onRollChange={handleRollChange} 
                        onSetWinner={handleSetWinner}
                        allowManualOverride={true}
                    />
                    {!isQuickMode && !isManualEntry && (
                         <div className="flex justify-center mb-6">
                            <button 
                                onClick={handleDetermineOrder}
                                className={cls("text-xs font-bold underline text-content-info hover:text-blue-600 transition-colors")}
                            >
                                Re-roll
                            </button>
                         </div>
                    )}
                </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up">
                {/* Custom panels injected by story/setup rules BEFORE standard panels */}
                {draftPanelsBefore.map((rule, i) => (
                     <CustomDraftPanel key={`panel-before-${i}`} rule={rule} stepBadgeClass={stepBadgePurpleBg} />
                ))}

                <DraftOrderPanel 
                    draftOrder={draftState.draftOrder}
                    isSolo={isSolo}
                    stepBadgeClass={stepBadgeBlueBg}
                    playerBadges={playerBadges}
                    beforeRules={draftShipsBefore}
                    afterRules={draftShipsAfter}
                    title={selectShipTitle}
                    description={selectShipDescription}
                />
                
                <PlacementOrderPanel 
                    placementOrder={draftState.placementOrder}
                    isSolo={isSolo}
                    isHavenDraft={isHavenDraft}
                    specialStartSector={specialStartSector}
                    stepBadgeClass={stepBadgeAmberBg}
                    beforeRules={draftPlacementBefore}
                    afterRules={draftPlacementAfter}
                    title={placementTitle}
                    description={placementDescription}
                />

                {/* Custom panels injected by story/setup rules AFTER standard panels */}
                {draftPanelsAfter.map((rule, i) => (
                     <CustomDraftPanel key={`panel-after-${i}`} rule={rule} stepBadgeClass={stepBadgePurpleBg} />
                ))}
            </div>
        </>
      )}

      {displayOverrides.map((rule, i) => (
          <OverrideNotificationBlock key={`override-${i}`} {...rule} />
      ))}
    </div>
  );
};
