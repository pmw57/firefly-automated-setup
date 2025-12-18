import React, { useState, useEffect } from 'react';
import { Step, DraftState } from '../types';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils/draft';
import { Button } from './Button';
import { DiceControls } from './DiceControls';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { STORY_CARDS } from '../data/storyCards';
import { STEP_IDS, CHALLENGE_IDS, STORY_TITLES } from '../data/ids';
import { hasFlag } from '../utils/data';
import { cls } from '../utils/style';

interface DraftStepProps {
  step: Step;
}

// Sub-component for Draft Order
const DraftOrderPanel = ({ 
    draftOrder, 
    isSolo, 
    isHavenDraft, 
    isBrowncoatDraft,
    stepBadgeClass 
}: { 
    draftOrder: string[]; 
    isSolo: boolean; 
    isHavenDraft: boolean; 
    isBrowncoatDraft: boolean;
    stepBadgeClass: string; 
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const panelBg = isDark ? 'bg-zinc-900/80' : 'bg-white';
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
    stepBadgeClass
}: {
    placementOrder: string[];
    isSolo: boolean;
    isHavenDraft: boolean;
    isBrowncoatDraft: boolean;
    specialStartSector: string | null;
    stepBadgeClass: string;
}) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    const panelBg = isDark ? 'bg-zinc-900/80' : 'bg-white';
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

export const DraftStep = ({ step }: DraftStepProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.playerCount === 1;

  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { optionalRules } = gameState;
  const { optionalShipUpgrades, resolveConflictsManually } = optionalRules;

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

  const isHavenDraft = step.id.includes(STEP_IDS.D_HAVEN_DRAFT);
  const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
  const isHeroesAndMisfits = activeStoryCard.title === STORY_TITLES.HEROES_AND_MISFITS;
  const isRacingAPaleHorse = activeStoryCard.title === STORY_TITLES.RACING_A_PALE_HORSE;
  const isPersephoneStart = activeStoryCard.setupConfig?.shipPlacementMode === 'persephone' && !isHeroesCustomSetup;
  const isLondiniumStart = hasFlag(activeStoryCard.setupConfig, 'startAtLondinium');
  const startOutsideAllianceSpace = hasFlag(activeStoryCard.setupConfig, 'startOutsideAllianceSpace');
  const startAtSector = activeStoryCard.setupConfig?.startAtSector;
  const allianceSpaceOffLimits = hasFlag(activeStoryCard.setupConfig, 'allianceSpaceOffLimits');
  const addBorderHavens = hasFlag(activeStoryCard.setupConfig, 'addBorderSpaceHavens');
  const isBrowncoatDraft = !!overrides.browncoatDraftMode;
  const isWantedLeaderMode = !!overrides.wantedLeaderMode;
  
  // Conditionally show warning for Browncoat + Heroes & Misfits interaction
  // based on the final starting credits calculated in the previous step.
  // The Serenity costs $4800; if starting capitol is less than that, you end up with $0.
  const showBrowncoatHeroesWarning = isBrowncoatDraft && isHeroesAndMisfits && gameState.finalStartingCredits != null && gameState.finalStartingCredits < 4800;

  let specialStartSector: string | null = null;
  if (startAtSector) specialStartSector = startAtSector;
  else if (isPersephoneStart) specialStartSector = 'Persephone';
  else if (isLondiniumStart) specialStartSector = 'Londinium';

  let resolvedHavenDraft = isHavenDraft;
  let conflictMessage: React.ReactNode = null;
  
  if (isHavenDraft && specialStartSector) {
    if (resolveConflictsManually) {
      // Manual selection is not stored globally yet, need to implement that.
      // For now, assume a default or let's just create a placeholder UI.
      // THIS NEEDS A REAL FIX
      conflictMessage = "Conflict: Haven placement vs. Fixed start. Manual selection needed.";
    } else {
      // Default to story priority
      resolvedHavenDraft = false;
      conflictMessage = <><strong>Story Priority:</strong> Ships start at <strong>{specialStartSector}</strong>, overriding Haven placement rules.</>;
    }
  }


  const introText = isDark ? 'text-gray-400' : 'text-gray-600';
  const stepBadgeBlueBg = isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
  const stepBadgeAmberBg = isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';

  return (
    <>
      {!isSolo && <p className={cls("mb-4 italic", introText)}>Determine who drafts first using a D6. Ties are resolved automatically.</p>}
      
      {conflictMessage && (
        <SpecialRuleBlock source="info" title="Conflict Resolved">
          {conflictMessage}
        </SpecialRuleBlock>
      )}

      {isWantedLeaderMode && (
        <SpecialRuleBlock source="setupCard" title="The Heat Is On">
          Choose Ships & Leaders normally, but <strong>each Leader begins play with a Wanted token</strong>.
        </SpecialRuleBlock>
      )}

      {!draftState ? (
        <Button onClick={handleDetermineOrder} variant="secondary" fullWidth className="mb-4">
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
          
          {showBrowncoatHeroesWarning && (
            <SpecialRuleBlock source="warning" title="Story & Setup Card Interaction">
              <p className="mb-2">
                The <strong>"{activeStoryCard.title}"</strong> story provides a specific starting Ship & Crew, which overrides the standard "buy" phase of <strong>"The Browncoat Way"</strong>.
              </p>
              <div className={cls("text-sm p-3 rounded border", isDark ? 'bg-red-950/40 border-red-900/50' : 'bg-red-100 border-red-200')}>
                <p className="mb-2">
                  Your starting Capitol is reduced by the cost of your assigned ship (e.g., Serenity costs $4,800), but not below $0.
                </p>
                <p className="font-bold">
                  This will likely leave you with $0, unable to purchase Fuel or Parts during the Browncoat Market phase.
                </p>
              </div>
            </SpecialRuleBlock>
          )}

          {isHeroesCustomSetup && (
             <SpecialRuleBlock source="warning" title="Heroes & Misfits: Further Adventures">
                <strong>Custom Setup Active:</strong> Ignore standard crew/ship/location requirements.
                <br/>
                Pick your Leader, Ship, and Supply Planet. Start with $2000 and a full compliment of your favourite crew.
             </SpecialRuleBlock>
          )}

          {optionalShipUpgrades && (
             <SpecialRuleBlock source="expansion" title="Optional Ship Upgrades">
                 <p className="mb-2">The following ships have <strong>Optional Ship Upgrade</strong> cards available. If you choose one of these ships, take its corresponding upgrade card.</p>
                 <ul className="list-disc ml-5 grid grid-cols-2 gap-x-4 text-sm font-medium mb-3">
                     <li><strong style={{ color: 'OliveDrab' }}>Bonanza</strong></li>
                     <li><strong style={{ color: 'RoyalBlue' }}>Bonnie Mae</strong></li>
                     <li><strong style={{ color: 'DimGrey' }}>Interceptor</strong></li>
                     <li><strong style={{ color: 'DarkOrange' }}>Serenity</strong></li>
                     <li><strong style={{ color: 'DarkRed' }}>Walden</strong></li>
                     <li><strong style={{ color: 'DarkGoldenrod' }}>Yun Qi</strong></li>
                 </ul>
                 <div className={cls("text-xs p-2 rounded border", isDark ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800')}>
                    <strong>Walden & Interceptor:</strong> These upgrades are double-sided. Choose your side during setup—you cannot switch later.
                 </div>
             </SpecialRuleBlock>
          )}

          {isRacingAPaleHorse && (
             <SpecialRuleBlock source="story" title="Story Setup: Haven">
                <strong>Place your Haven at Deadwood (Blue Sun).</strong>
                <br/>If you end your turn at your Haven, remove Disgruntled from all Crew.
             </SpecialRuleBlock>
          )}
          
          {addBorderHavens && (
            <SpecialRuleBlock source="story" title={activeStoryCard.title}>
              <strong>Choose Havens:</strong> Each player chooses a Haven token. Havens <strong>must be in Border Space</strong>.
            </SpecialRuleBlock>
          )}

          {startOutsideAllianceSpace && (
            <SpecialRuleBlock source="warning" title="Placement Restriction">
               Players' starting locations <strong>may not be within Alliance Space</strong>.
            </SpecialRuleBlock>
          )}
          
          {allianceSpaceOffLimits && (
            <SpecialRuleBlock source="warning" title="Restricted Airspace">
               <strong>Alliance Space is Off Limits</strong> until Goal 3.
            </SpecialRuleBlock>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DraftOrderPanel 
                draftOrder={draftState.draftOrder}
                isSolo={isSolo}
                isHavenDraft={resolvedHavenDraft}
                isBrowncoatDraft={isBrowncoatDraft}
                stepBadgeClass={stepBadgeBlueBg}
            />

            <PlacementOrderPanel 
                placementOrder={draftState.placementOrder}
                isSolo={isSolo}
                isHavenDraft={resolvedHavenDraft}
                isBrowncoatDraft={isBrowncoatDraft}
                specialStartSector={specialStartSector}
                stepBadgeClass={stepBadgeAmberBg}
            />
          </div>
          
          {isBrowncoatDraft && (
             <SpecialRuleBlock source="setupCard" title="Browncoat Market">
                <strong>Market Phase:</strong> Once all players have purchased a ship and chosen a leader, everyone may buy fuel ($100) and parts ($300).
                <br/><span className="text-xs italic opacity-75">Reminder: Free starting fuel/parts are disabled in this mode.</span>
             </SpecialRuleBlock>
          )}

          {isHavenDraft && (
            <SpecialRuleBlock source="setupCard" title="Home Sweet Haven: Placement Rules">
                 <ul className="list-disc ml-5 mt-1 space-y-1 text-sm">
                     <li>Each Haven must be placed in an unoccupied <strong>Planetary Sector adjacent to a Supply Planet</strong>.</li>
                     <li>Havens may not be placed in a Sector with a <strong>Contact</strong>.</li>
                     <li>Remaining players place their Havens in <strong>reverse order</strong>.</li>
                     <li><strong>Players' ships start at their Havens.</strong></li>
                 </ul>
            </SpecialRuleBlock>
          )}

        </div>
      )}
    </>
  );
};