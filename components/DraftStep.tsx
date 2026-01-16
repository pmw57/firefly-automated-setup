import React, { useEffect, useMemo, useCallback } from 'react';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils/draft';
import { useDraftDetails } from '../hooks/useDraftDetails';
import { Button } from './Button';
import { DiceControls } from './DiceControls';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';
import { getCampaignNotesForStep } from '../utils/selectors/story';
import { SpecialRule, StructuredContent } from '../types';
import { getResolvedRules, hasRuleFlag } from '../utils/selectors/rules';
import { PageReference } from './PageReference';
import { StructuredContentRenderer } from './StructuredContentRenderer';

// A recursive renderer for StructuredContent
const renderStructuredContent = (content: StructuredContent): React.ReactNode => {
  return content.map((part, index) => {
    if (typeof part === 'string') {
      return <React.Fragment key={index}>{part}</React.Fragment>;
    }

    switch (part.type) {
      case 'strong':
      case 'action':
        return <strong key={index}>{part.content}</strong>;
      case 'br':
        return <br key={index} />;
      case 'list':
        return (
          <ul key={index} className="list-disc list-inside space-y-1">
            {part.items.map((item, i) => <li key={i}>{renderStructuredContent(item)}</li>)}
          </ul>
        );
      default:
        return null;
    }
  });
};

// Helper for inline instructions
const DraftInstructionList = ({ rules, textColor }: { rules: SpecialRule[], textColor: string }) => {
    if (!rules || rules.length === 0) return null;
    return (
        <div className="space-y-2 mb-3">
            {rules.map((rule, i) => (
                <p key={i} className={cls("text-xs font-bold", textColor)}>
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
    isHavenDraft, 
    isBrowncoatDraft,
    stepBadgeClass,
    playerBadges,
    beforeRules,
    afterRules,
}: { 
    draftOrder: string[]; 
    isSolo: boolean; 
    isHavenDraft: boolean; 
    isBrowncoatDraft: boolean;
    stepBadgeClass: string; 
    playerBadges: Record<number, string>;
    beforeRules: SpecialRule[];
    afterRules: SpecialRule[];
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
    const restrictionTextColor = isDark ? 'text-yellow-400' : 'text-yellow-700';

    const description = isSolo
        ? "Choose a Leader & Ship."
        : isHavenDraft
        ? "The player with the highest die roll chooses a Leader & Ship first. Pass to Left."
        : isBrowncoatDraft
        ? "Winner buys Ship or selects Leader. Pass to Left."
        : "Winner selects Ship & Leader. Pass to Left.";

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
              <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 1</div>
              <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                  {'Select Ship & Leader'}
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
                        <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isDark ? 'text-blue-400' : 'text-blue-600')}>
                          {displayBadge}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>

              {afterRules.length > 0 && (
                <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-gray-200')}>
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
    havenPlacementRules,
    isBrowncoatDraft,
    specialStartSector,
    stepBadgeClass,
    beforeRules,
    afterRules,
}: {
    placementOrder: string[];
    isSolo: boolean;
    isHavenDraft: boolean;
    havenPlacementRules?: SpecialRule | null;
    isBrowncoatDraft: boolean;
    specialStartSector: string | null;
    stepBadgeClass: string;
    beforeRules: SpecialRule[];
    afterRules: SpecialRule[];
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    const itemBg = isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100';
    const itemText = isDark ? 'text-gray-200' : 'text-gray-800';
    
    const specialPlacementBg = isDark ? 'bg-amber-950/40 border-amber-800' : 'bg-amber-50 border-amber-200';
    const specialPlacementTitle = isDark ? 'text-amber-100' : 'text-amber-900';
    const specialPlacementText = isDark ? 'text-amber-300' : 'text-amber-800';

    let description: string;
    let placementTitle = isHavenDraft ? 'Haven Placement' : 'Placement';
    let content: React.ReactNode;

    const restrictionTextColor = isDark ? 'text-yellow-400' : 'text-yellow-700';

    if (specialStartSector) {
        placementTitle = 'Special Placement';
        content = (
            <div className={cls("p-4 rounded text-center border", specialPlacementBg)}>
                <p className={cls("font-bold mb-1", specialPlacementTitle)}>Fixed Starting Sector</p>
                <p className={cls("text-sm", specialPlacementText)}>All ships start in <strong>{specialStartSector}</strong>.</p>
            </div>
        );
    } else {
        if (isHavenDraft) {
            description = isSolo ? "Place Haven in a valid sector." : "The last player to choose a Leader places their Haven first. Remaining players in reverse order.";
        } else if (isBrowncoatDraft) {
            description = isSolo ? "Buy Fuel ($100) and place ship." : "Pass back to Right. Make remaining choice. Buy Fuel ($100).";
        } else {
            description = isSolo ? "Place Ship in Sector." : "Pass to Right (Anti-Clockwise). Place Ship in Sector.";
        }
        
        const descriptionColor = isHavenDraft 
            ? (isDark ? 'text-green-300' : 'text-green-800')
            : (isDark ? 'text-gray-400' : 'text-gray-500');

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
                        {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isHavenDraft ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-amber-400' : 'text-amber-600'))}>Places First</span>}
                    </li>
                    ))}
                </ul>
                
                {afterRules.length > 0 && (
                    <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-gray-200')}>
                         <DraftInstructionList rules={afterRules} textColor={restrictionTextColor} />
                    </div>
                )}

                {isHavenDraft && havenPlacementRules && (
                    <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-gray-200')}>
                         <h5 className={cls("font-bold uppercase tracking-wide text-xs mb-1", isDark ? 'text-gray-300' : 'text-gray-700')}>{havenPlacementRules.title || 'Haven Placement Rules'}:</h5>
                         <div className={cls("space-y-1 text-xs", isDark ? 'text-gray-400' : 'text-gray-600')}>
                             {renderStructuredContent(havenPlacementRules.content)}
                         </div>
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
                    {placementTitle}
                </h4>
                {isHavenDraft && havenPlacementRules?.page && (
                    <PageReference page={havenPlacementRules.page} manual={havenPlacementRules.manual} />
                )}
            </div>
            {content}
        </div>
    );
};

// By typing the component as React.FC, we ensure it correctly handles standard
// React props like 'key', which is necessary when rendering this component in a list.
interface CustomDraftPanelProps {
  rule: SpecialRule;
  stepBadgeClass: string;
}

const CustomDraftPanel: React.FC<CustomDraftPanelProps> = ({ rule, stepBadgeClass }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    
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
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.playerCount === 1;
  const isQuickMode = gameState.setupMode === 'quick';
  
  const allRules = useMemo(() => getResolvedRules(gameState), [gameState]);
  const isGoingLegit = useMemo(() => hasRuleFlag(allRules, 'isGoingLegit'), [allRules]);

  const {
      specialRules,
      draftPanelsBefore,
      draftPanelsAfter,
      draftShipsBefore,
      draftShipsAfter,
      draftPlacementBefore,
      draftPlacementAfter,
      isHavenDraft,
      isBrowncoatDraft,
      specialStartSector,
      havenPlacementRules,
      playerBadges,
  } = useDraftDetails(step);

  const campaignNotes = useMemo(
    () => getCampaignNotesForStep(gameState, step.id), 
    [gameState, step.id]
  );
  
  const allInfoBlocks = useMemo(() => {
    const notesAsRules: SpecialRule[] = campaignNotes.map(note => ({
      source: 'story',
      title: 'Campaign Setup Note',
      content: note.content
    }));
    
    const allRules: SpecialRule[] = [
        ...specialRules,
        ...notesAsRules
    ];

    const sortedRules = allRules.sort((a, b) => {
      const order: Record<SpecialRule['source'], number> = {
        expansion: 1,
        setupCard: 2,
        story: 3,
        warning: 3,
        info: 4,
      };
      return (order[a.source] || 99) - (order[b.source] || 99);
    });

    const filteredRules = isQuickMode ? sortedRules.filter(r => r.source !== 'story') : sortedRules;

    return filteredRules
      .map((rule, i) => <OverrideNotificationBlock key={`rule-${i}`} {...rule} />);
  }, [isQuickMode, campaignNotes, specialRules]);

  const handleDetermineOrder = useCallback(() => {
    setDraftConfig({ state: runAutomatedDraft(gameState.playerNames), isManual: false });
  }, [setDraftConfig, gameState.playerNames]);

  useEffect(() => {
    if (isSolo && !draftState) {
        setDraftConfig({ state: getInitialSoloDraftState(gameState.playerNames[0]), isManual: false });
    } else if (!isSolo && !draftState && isQuickMode) {
        handleDetermineOrder();
    }
  }, [isSolo, gameState.playerNames, draftState, isQuickMode, handleDetermineOrder, setDraftConfig]);


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

  const introText = isDark ? 'text-gray-400' : 'text-gray-600';
  const stepBadgeBlueBg = isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
  const stepBadgeAmberBg = isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';
  const stepBadgePurpleBg = isDark ? 'bg-purple-900/50 text-purple-200' : 'bg-purple-100 text-purple-800';

  return (
    <div className="space-y-6">
      {allInfoBlocks.length > 0 && (
        <div className="space-y-4">
          {allInfoBlocks}
        </div>
      )}
      
      {!isSolo && !draftState && !isQuickMode && (
        <p className={cls("italic text-center", introText)}>Determine who drafts first using a D6. Ties are resolved automatically.</p>
      )}

      {!draftState ? (
        <>
          {!isSolo && (
            <Button onClick={handleDetermineOrder} variant="secondary" fullWidth className="my-4">
               🎲 Roll for {isHavenDraft ? 'Haven Draft' : 'Command'}
            </Button>
          )}
        </>
      ) : (
        <div className="animate-fade-in space-y-6">
          {!isSolo && (
            <DiceControls 
                draftState={draftState} 
                onRollChange={handleRollChange} 
                onSetWinner={handleSetWinner}
                allowManualOverride={isManualEntry && !isQuickMode}
            />
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Dynamic Panels - Before */}
            {draftPanelsBefore.map((panel, i) => (
                <CustomDraftPanel key={`panel-before-${i}`} rule={panel} stepBadgeClass={stepBadgePurpleBg} />
            ))}

            {/* Standard Panels */}
            <DraftOrderPanel 
                draftOrder={draftState.draftOrder}
                isSolo={isSolo}
                isHavenDraft={isHavenDraft}
                isBrowncoatDraft={isBrowncoatDraft}
                stepBadgeClass={stepBadgeBlueBg}
                playerBadges={playerBadges}
                beforeRules={draftShipsBefore}
                afterRules={draftShipsAfter}
            />
            
            <PlacementOrderPanel 
                placementOrder={draftState.placementOrder}
                isSolo={isSolo}
                isHavenDraft={isHavenDraft}
                havenPlacementRules={havenPlacementRules}
                isBrowncoatDraft={isBrowncoatDraft}
                specialStartSector={specialStartSector}
                stepBadgeClass={stepBadgeAmberBg}
                beforeRules={draftPlacementBefore}
                afterRules={draftPlacementAfter}
            />
            
            {/* Dynamic Panels - After */}
            {draftPanelsAfter.map((panel, i) => (
                <CustomDraftPanel key={`panel-after-${i}`} rule={panel} stepBadgeClass={stepBadgePurpleBg} />
            ))}
            
          </div>

          {isGoingLegit && (
            <OverrideNotificationBlock
              source="info"
              title="For Sale Pile"
              content={["Leave unused ships out of the box as a \"For Sale\" pile."]}
              className="mt-6"
            />
          )}
        </div>
      )}
    </div>
  );
};