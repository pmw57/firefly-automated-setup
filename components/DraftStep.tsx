import React, { useEffect, useMemo, useCallback } from 'react';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils/draft';
import { getDraftDetails } from '../utils/draftRules';
import { Button } from './Button';
import { DiceControls } from './DiceControls';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';
import { getCampaignNotesForStep } from '../utils/selectors/story';
import { ActionType } from '../state/actions';
import { SpecialRule } from '../types';
import { getResolvedRules, hasRuleFlag } from '../utils/selectors/rules';

// Sub-component for Draft Order
const DraftOrderPanel = ({ 
    draftOrder, 
    isSolo, 
    isHavenDraft, 
    isBrowncoatDraft,
    stepBadgeClass,
}: { 
    draftOrder: string[]; 
    isSolo: boolean; 
    isHavenDraft: boolean; 
    isBrowncoatDraft: boolean;
    stepBadgeClass: string; 
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

    const description = isSolo
        ? (isHavenDraft ? "Choose a Leader & Ship." : "Choose a Leader & Ship.")
        : isHavenDraft
        ? "The player with the highest die roll chooses a Leader & Ship first. Pass to Left."
        : isBrowncoatDraft
        ? "Winner selects Leader OR buys Ship. Pass to Left."
        : "Winner selects Leader & Ship. Pass to Left.";

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
              <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 1</div>
              <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                  {isHavenDraft ? 'Select Leader & Ship' : 'Select Ship & Leader'}
              </h4>
              
              <p className={cls("text-xs mb-3 italic", panelSubColor)}>
                {description}
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
    isGoingLegit,
    specialStartSector,
    startOutsideAllianceSpace,
    excludeNewCanaanPlacement,
    stepBadgeClass,
}: {
    placementOrder: string[];
    isSolo: boolean;
    isHavenDraft: boolean;
    isBrowncoatDraft: boolean;
    isGoingLegit: boolean;
    specialStartSector: string | null;
    startOutsideAllianceSpace: boolean;
    excludeNewCanaanPlacement: boolean;
    stepBadgeClass: string;
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
    const specialPlacementSub = isDark ? 'text-amber-400' : 'text-amber-700';

    let description: string;
    let placementTitle = isHavenDraft ? 'Haven Placement' : 'Placement';
    let content: React.ReactNode;

    const restrictionTextColor = isDark ? 'text-yellow-400' : 'text-yellow-700';

    if (specialStartSector) {
        placementTitle = 'Special Placement';
        content = (
            <div className={cls("p-4 rounded text-center border", specialPlacementBg)}>
                <p className={cls("font-bold mb-1", specialPlacementTitle)}>{placementTitle}</p>
                <p className={cls("text-sm", specialPlacementText)}>All ships start at <strong>{specialStartSector}</strong>.</p>
                <p className={cls("text-xs italic mt-1", specialPlacementSub)}>(Do not place in separate sectors)</p>
            </div>
        );
    } else if (isGoingLegit) {
        placementTitle = 'A Port of Operation';
        const descriptionColor = isDark ? 'text-green-300' : 'text-green-800';
        content = (
            <>
                <p className={cls("text-xs mb-3 italic", isDark ? 'text-gray-400' : 'text-gray-500')}>
                    The last player to choose a Leader places first. Remaining players in reverse order.
                </p>
                <ul className="space-y-2">
                    {placementOrder.map((player, i) => (
                    <li key={i} className={cls("flex items-center p-2 rounded border", itemBg)}>
                        <span className={`w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm`}>{i + 1}</span>
                        <span className={cls("text-sm font-medium", itemText)}>{player}</span>
                        {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isDark ? 'text-green-400' : 'text-green-600')}>Placement 1</span>}
                    </li>
                    ))}
                </ul>
                <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-gray-200')}>
                     <p className={cls("text-sm", descriptionColor)}>
                        While choosing starting positions, mark your Blue Sun Haven in a non-Contact and non-Supply planetary sector.
                    </p>
                </div>
            </>
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

                {startOutsideAllianceSpace && (
                    <p className={cls("text-xs mb-3 font-bold", restrictionTextColor)}>
                        ⚠️ Restriction: Starting locations may not be within Alliance Space.
                    </p>
                )}
                {excludeNewCanaanPlacement && (
                    <p className={cls("text-xs mb-3 font-bold", restrictionTextColor)}>
                        ⚠️ Restriction: New Canaan may not be chosen as a starting location.
                    </p>
                )}
                
                <ul className="space-y-2">
                    {placementOrder.map((player, i) => (
                    <li key={i} className={cls("flex items-center p-2 rounded border", itemBg)}>
                        <span className={`w-6 h-6 rounded-full ${isHavenDraft ? 'bg-green-600' : 'bg-amber-500'} text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm`}>{i + 1}</span>
                        <span className={cls("text-sm font-medium", itemText)}>{player}</span>
                        {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isHavenDraft ? (isDark ? 'text-green-400' : 'text-green-600') : (isDark ? 'text-amber-400' : 'text-amber-600'))}>Placement 1</span>}
                    </li>
                    ))}
                </ul>
            </>
        );
    }

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
            <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 2</div>
            <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                {placementTitle}
            </h4>
            {content}
        </div>
    );
};

export const DraftStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState, dispatch } = useGameState();
  const { state: draftState, isManual: isManualEntry } = gameState.draft;
  
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.playerCount === 1;
  const isQuickMode = gameState.setupMode === 'quick';
  
  const allRules = useMemo(() => getResolvedRules(gameState), [gameState]);
  const isRuiningIt = useMemo(() => hasRuleFlag(allRules, 'isRuiningItForEveryone'), [allRules]);
  const isGoingLegit = useMemo(() => hasRuleFlag(allRules, 'isGoingLegit'), [allRules]);

  const {
      specialRules,
      isHavenDraft,
      isBrowncoatDraft,
      specialStartSector,
      startOutsideAllianceSpace,
      excludeNewCanaanPlacement,
  } = React.useMemo(() => getDraftDetails(gameState, step), [gameState, step]);
  
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
        warning: 3, // Treat warnings like story overrides
        info: 4,
      };
      return (order[a.source] || 99) - (order[b.source] || 99);
    });

    return sortedRules
      .filter(rule => gameState.setupMode === 'detailed' || rule.source !== 'expansion')
      .map((rule, i) => <SpecialRuleBlock key={`rule-${i}`} {...rule} />);
  }, [campaignNotes, specialRules, gameState.setupMode]);

  const handleDetermineOrder = useCallback(() => {
    dispatch({ type: ActionType.SET_DRAFT_CONFIG, payload: { state: runAutomatedDraft(gameState.playerNames), isManual: false } });
  }, [dispatch, gameState.playerNames]);

  useEffect(() => {
    if (isSolo && !draftState) {
        dispatch({ type: ActionType.SET_DRAFT_CONFIG, payload: { state: getInitialSoloDraftState(gameState.playerNames[0]), isManual: false } });
    } else if (!isSolo && !draftState && isQuickMode) {
        handleDetermineOrder();
    }
  }, [isSolo, gameState.playerNames, draftState, dispatch, isQuickMode, handleDetermineOrder]);

  const handleRollChange = (index: number, newValue: string) => {
    if (!draftState) return;
    const val = parseInt(newValue) || 0;
    const newRolls = [...draftState.rolls];
    newRolls[index] = { ...newRolls[index], roll: val };
    const newState = calculateDraftOutcome(newRolls, gameState.playerCount);
    dispatch({ type: ActionType.SET_DRAFT_CONFIG, payload: { state: newState, isManual: true } });
  };

  const handleSetWinner = (index: number) => {
    if (!draftState) return;
    const newState = calculateDraftOutcome(draftState.rolls, gameState.playerCount, index);
    dispatch({ type: ActionType.SET_DRAFT_CONFIG, payload: { state: newState, isManual: true } });
  };

  const introText = isDark ? 'text-gray-400' : 'text-gray-600';
  const stepBadgeBlueBg = isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
  const stepBadgeAmberBg = isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';

  return (
    <div className="space-y-6">
      {isRuiningIt ? (
        <div className={`p-4 rounded-lg border transition-colors ${isDark ? 'bg-zinc-900/50 border-zinc-700' : 'bg-white/70 border-gray-200'}`}>
          <h3 className={`text-lg font-bold font-western mb-3 pb-2 border-b ${isDark ? 'text-amber-400 border-amber-400/20' : 'text-amber-800 border-amber-800/20'}`}>
            Asymmetric Setup: Ruining It For Everyone
          </h3>
          <div className="space-y-4">
            {allInfoBlocks.map((block, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg ${isDark ? 'bg-zinc-800 text-amber-400' : 'bg-amber-100 text-amber-800'}`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  {block}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <>
          {allInfoBlocks.length > 0 && (
            <div className="space-y-4">
              {allInfoBlocks}
            </div>
          )}
          
          {!isSolo && !draftState && !isQuickMode && (
            <p className={cls("italic text-center", introText)}>Determine who drafts first using a D6. Ties are resolved automatically.</p>
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
                    allowManualOverride={isManualEntry && !isQuickMode}
                />
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DraftOrderPanel 
                    draftOrder={draftState.draftOrder}
                    isSolo={isSolo}
                    isHavenDraft={isHavenDraft}
                    isBrowncoatDraft={isBrowncoatDraft}
                    stepBadgeClass={stepBadgeBlueBg}
                />

                <PlacementOrderPanel 
                    placementOrder={draftState.placementOrder}
                    isSolo={isSolo}
                    isHavenDraft={isHavenDraft}
                    isBrowncoatDraft={isBrowncoatDraft}
                    isGoingLegit={isGoingLegit}
                    specialStartSector={specialStartSector}
                    startOutsideAllianceSpace={!!startOutsideAllianceSpace}
                    excludeNewCanaanPlacement={!!excludeNewCanaanPlacement}
                    stepBadgeClass={stepBadgeAmberBg}
                />
              </div>

              {isGoingLegit && (
                <SpecialRuleBlock
                  source="info"
                  title="For Sale Pile"
                  content={["Leave unused ships out of the box as a \"For Sale\" pile."]}
                  className="mt-6"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};
