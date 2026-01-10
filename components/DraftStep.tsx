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

// Sub-component for Draft Order
const DraftOrderPanel = ({ 
    draftOrder, 
    isSolo, 
    isHavenDraft, 
    isBrowncoatDraft,
    isWantedLeaderMode,
    stepBadgeClass,
}: { 
    draftOrder: string[]; 
    isSolo: boolean; 
    isHavenDraft: boolean; 
    isBrowncoatDraft: boolean;
    isWantedLeaderMode?: boolean;
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
    const restrictionTextColor = isDark ? 'text-yellow-400' : 'text-yellow-700';

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
                    <span className={cls("text-sm font-medium", itemText)}>
                        {player}
                    </span>
                    {!isSolo && i === 0 && <span className={cls("ml-auto text-[10px] font-bold uppercase tracking-wider", isDark ? 'text-blue-400' : 'text-blue-600')}>Pick 1</span>}
                  </li>
                ))}
              </ul>

              {isWantedLeaderMode && (
                <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-gray-200')}>
                    <p className={cls("text-xs font-bold", restrictionTextColor)}>
                        ⚠️ Restriction: Each Leader begins play with a <strong>Warrant</strong> token.
                    </p>
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
    placementRegionRestriction,
    startOutsideAllianceSpace,
    excludeNewCanaanPlacement,
    mustBeInBorderSpace,
    stepBadgeClass,
    placementPanelExtras,
}: {
    placementOrder: string[];
    isSolo: boolean;
    isHavenDraft: boolean;
    havenPlacementRules?: SpecialRule | null;
    isBrowncoatDraft: boolean;
    specialStartSector: string | null;
    placementRegionRestriction: string | null;
    startOutsideAllianceSpace: boolean;
    excludeNewCanaanPlacement: boolean;
    mustBeInBorderSpace: boolean;
    stepBadgeClass: string;
    placementPanelExtras: SpecialRule[];
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

                {startOutsideAllianceSpace && (
                    <p className={cls("text-sm mb-3 font-bold text-center", restrictionTextColor)}>
                        ⚠️ Not within Alliance Space
                    </p>
                )}
                {excludeNewCanaanPlacement && (
                    <p className={cls("text-xs mb-3 font-bold", restrictionTextColor)}>
                        ⚠️ Restriction: New Canaan may not be chosen as a starting location.
                    </p>
                )}
                {mustBeInBorderSpace && (
                    <p className={cls("text-xs mb-3 font-bold", restrictionTextColor)}>
                        ⚠️ Restriction: Havens must be placed in Border Space.
                    </p>
                )}
                {placementRegionRestriction && (
                    <p className={cls("text-xs mb-3 font-bold", restrictionTextColor)}>
                        ⚠️ Restriction: All ships must start in the <strong>{placementRegionRestriction}</strong>.
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

                {isHavenDraft && havenPlacementRules && (
                    <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-gray-200')}>
                         <h5 className={cls("font-bold uppercase tracking-wide text-xs mb-1", isDark ? 'text-gray-300' : 'text-gray-700')}>{havenPlacementRules.title || 'Haven Placement Rules'}:</h5>
                         <div className={cls("space-y-1 text-xs", isDark ? 'text-gray-400' : 'text-gray-600')}>
                             {renderStructuredContent(havenPlacementRules.content)}
                         </div>
                    </div>
                )}
                
                {placementPanelExtras && placementPanelExtras.length > 0 && (
                  <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-gray-200')}>
                    {placementPanelExtras.map((extra, i) => (
                      <p key={i} className={cls("text-xs font-bold", restrictionTextColor)}>
                        <StructuredContentRenderer content={extra.content} />
                      </p>
                    ))}
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

const BrowncoatMarketPanel = () => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';

    const panelBg = isDark ? 'bg-zinc-900/50 backdrop-blur-sm' : 'bg-white/70 backdrop-blur-sm';
    const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
    const stepBadgeClass = isDark ? 'bg-lime-900/50 text-lime-200' : 'bg-lime-100 text-lime-800';
    const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
    const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
    const textColor = isDark ? 'text-gray-300' : 'text-gray-700';
    const priceColor = isDark ? 'text-lime-400' : 'text-lime-700';

    return (
        <div className={cls(panelBg, "p-4 rounded-lg border relative overflow-hidden shadow-sm transition-colors duration-300", panelBorder)}>
            <div className={cls("absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl", stepBadgeClass)}>Phase 3</div>
            <h4 className={cls("font-bold mb-2 border-b pb-1", panelHeaderColor, panelHeaderBorder)}>
                Browncoat Market
            </h4>
            <p className={cls("text-sm", textColor)}>
                Once all players have purchased a ship and chosen a leader, everyone may buy supplies.
            </p>
            <ul className={cls("text-sm mt-2 font-bold", priceColor)}>
                <li>Fuel: $100</li>
                <li>Parts: $300</li>
            </ul>
            <p className={cls("text-xs mt-3 italic", isDark ? 'text-gray-500' : 'text-gray-600')}>
                (Reminder: Free starting fuel/parts are disabled in this mode.)
            </p>
        </div>
    );
};

// FIX: Changed component typing to React.FC<CustomDraftPanelProps> to correctly handle
// the 'key' prop when this component is used within a .map() loop, resolving a TypeScript error.
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
      draftPanels,
      placementPanelExtras,
      isHavenDraft,
      isBrowncoatDraft,
      isWantedLeaderMode,
      specialStartSector,
      placementRegionRestriction,
      startOutsideAllianceSpace,
      excludeNewCanaanPlacement,
      havenPlacementRules,
  } = useDraftDetails(step);

  const campaignNotes = useMemo(
    () => getCampaignNotesForStep(gameState, step.id), 
    [gameState, step.id]
  );
  
  const mustBeInBorderSpace = useMemo(() => 
    specialRules.some(rule => rule.flags?.includes('havensInBorderSpace')),
    [specialRules]
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
      .map((rule, i) => <OverrideNotificationBlock key={`rule-${i}`} {...rule} />);
  }, [campaignNotes, specialRules, gameState.setupMode]);

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
            <DraftOrderPanel 
                draftOrder={draftState.draftOrder}
                isSolo={isSolo}
                isHavenDraft={isHavenDraft}
                isBrowncoatDraft={isBrowncoatDraft}
                isWantedLeaderMode={isWantedLeaderMode}
                stepBadgeClass={stepBadgeBlueBg}
            />
            
            <PlacementOrderPanel 
                placementOrder={draftState.placementOrder}
                isSolo={isSolo}
                isHavenDraft={isHavenDraft}
                havenPlacementRules={havenPlacementRules}
                isBrowncoatDraft={isBrowncoatDraft}
                specialStartSector={specialStartSector}
                placementRegionRestriction={placementRegionRestriction}
                startOutsideAllianceSpace={!!startOutsideAllianceSpace}
                excludeNewCanaanPlacement={!!excludeNewCanaanPlacement}
                mustBeInBorderSpace={mustBeInBorderSpace}
                stepBadgeClass={stepBadgeAmberBg}
                placementPanelExtras={placementPanelExtras}
            />
            
            {draftPanels.map((panel, i) => (
                <CustomDraftPanel key={`panel-${i}`} rule={panel} stepBadgeClass={stepBadgePurpleBg} />
            ))}
          </div>

          {isBrowncoatDraft && <BrowncoatMarketPanel />}

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
