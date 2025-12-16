
import React, { useState, useEffect } from 'react';
import { Step, DraftState } from '../types';
import { STORY_CARDS } from '../data/storyCards';
import { calculateDraftOutcome, runAutomatedDraft, getInitialSoloDraftState } from '../utils';
import { Button } from './Button';
import { DiceControls } from './DiceControls';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { STEP_IDS, CHALLENGE_IDS, STORY_TITLES } from '../constants';

interface DraftStepProps {
  step: Step;
}

export const DraftStep = ({ step }: DraftStepProps): React.ReactElement => {
  const { gameState } = useGameState();
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.playerCount === 1;

  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { optionalShipUpgrades } = gameState.optionalRules || {};

  // Auto-resolve for solo player
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
  
  // Logic for Heroes & Misfits custom setup challenge
  const isHeroesCustomSetup = !!gameState.challengeOptions[CHALLENGE_IDS.HEROES_CUSTOM_SETUP];
  const isRacingPaleHorse = activeStoryCard.title === STORY_TITLES.RACING_A_PALE_HORSE;

  const isPersephoneStart = activeStoryCard.setupConfig?.shipPlacementMode === 'persephone' && !isHeroesCustomSetup;
  const isLondiniumStart = activeStoryCard.setupConfig?.startAtLondinium;
  const startOutsideAlliance = activeStoryCard.setupConfig?.startOutsideAllianceSpace;
  const startAtSector = activeStoryCard.setupConfig?.startAtSector;
  const allianceSpaceOffLimits = activeStoryCard.setupConfig?.allianceSpaceOffLimits;
  const addBorderHavens = activeStoryCard.setupConfig?.addBorderSpaceHavens;

  const isBrowncoatDraft = overrides.browncoatDraftMode;
  const isWantedLeaderMode = overrides.wantedLeaderMode;

  const introText = isDark ? 'text-gray-400' : 'text-gray-600';
  const panelBg = isDark ? 'bg-zinc-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
  const panelHeaderColor = isDark ? 'text-gray-100' : 'text-gray-900';
  const panelHeaderBorder = isDark ? 'border-zinc-800' : 'border-gray-100';
  const panelSubColor = isDark ? 'text-gray-400' : 'text-gray-500';
  
  const stepBadgeBlueBg = isDark ? 'bg-blue-900/50 text-blue-200' : 'bg-blue-100 text-blue-800';
  const stepBadgeAmberBg = isDark ? 'bg-amber-900/50 text-amber-200' : 'bg-amber-100 text-amber-800';

  const itemBg = isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-gray-50 border-gray-100';
  const itemText = isDark ? 'text-gray-200' : 'text-gray-800';

  const specialPlacementBg = isDark ? 'bg-amber-950/40 border-amber-800' : 'bg-amber-50 border-amber-200';
  const specialPlacementTitle = isDark ? 'text-amber-100' : 'text-amber-900';
  const specialPlacementText = isDark ? 'text-amber-300' : 'text-amber-800';
  const specialPlacementSub = isDark ? 'text-amber-400' : 'text-amber-700';

  const warningConflictBg = isDark ? 'bg-red-900/30 border-red-800 text-red-200' : 'bg-red-50 border-red-200 text-red-800';

  return (
    <>
      {!isSolo && <p className={`mb-4 italic ${introText}`}>Determine who drafts first using a D6. Ties are resolved automatically.</p>}
      
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
                 <div className={`text-xs p-2 rounded border ${isDark ? 'bg-amber-900/30 border-amber-800 text-amber-200' : 'bg-amber-50 border-amber-200 text-amber-800'}`}>
                    <strong>Walden & Interceptor:</strong> These upgrades are double-sided. Choose your side during setup—you cannot switch later.
                 </div>
             </SpecialRuleBlock>
          )}

          {isRacingPaleHorse && (
             <SpecialRuleBlock source="story" title="Story Setup: Haven">
                <strong>Place your Haven at Deadwood (Blue Sun).</strong>
                <br/>If you end your turn at your Haven, remove Disgruntled from all Crew.
             </SpecialRuleBlock>
          )}

          {isWantedLeaderMode && (
            <SpecialRuleBlock source="setupCard" title="The Heat Is On">
              Choose Ships & Leaders normally, but <strong>each Leader begins play with a Wanted token</strong>.
            </SpecialRuleBlock>
          )}
          
          {addBorderHavens && (
            <SpecialRuleBlock source="story" title={activeStoryCard.title}>
              <strong>Choose Havens:</strong> Each player chooses a Haven token. Havens <strong>must be in Border Space</strong>.
            </SpecialRuleBlock>
          )}

          {startOutsideAlliance && (
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
            {/* Draft Order */}
            <div className={`${panelBg} p-4 rounded-lg border ${panelBorder} relative overflow-hidden shadow-sm transition-colors duration-300`}>
              <div className={`absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl ${stepBadgeBlueBg}`}>Step 1</div>
              <h4 className={`font-bold mb-2 border-b pb-1 ${panelHeaderColor} ${panelHeaderBorder}`}>
                  {isHavenDraft ? 'Select Haven' : 'Select Ship & Leader'}
              </h4>
              <p className={`text-xs mb-3 italic ${panelSubColor}`}>
                {isSolo 
                    ? (isHavenDraft ? "Choose a Haven." : "Choose a Leader & Ship.")
                    : isHavenDraft 
                    ? "Standard Order: Winner chooses Leader & Ship first.": isBrowncoatDraft ? "Winner selects Leader OR buys Ship. Pass to Left." : "Winner selects Leader & Ship. Pass to Left."}
              </p>
              <ul className="space-y-2">
                {draftState.draftOrder.map((player, i) => (
                  <li key={i} className={`flex items-center p-2 rounded border ${itemBg}`}>
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                    <span className={`text-sm font-medium ${itemText}`}>{player}</span>
                    {!isSolo && i === 0 && <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>First Pick</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Placement Order */}
            <div className={`${panelBg} p-4 rounded-lg border ${panelBorder} relative overflow-hidden shadow-sm transition-colors duration-300`}>
              <div className={`absolute top-0 right-0 text-xs font-bold px-2 py-1 rounded-bl ${stepBadgeAmberBg}`}>Step 2</div>
              <h4 className={`font-bold mb-2 border-b pb-1 ${panelHeaderColor} ${panelHeaderBorder}`}>
                 {isHavenDraft ? 'Haven Placement' : 'Placement'}
              </h4>
              
              {isHavenDraft ? (
                 <>
                   <p className={`text-xs mb-3 italic ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                       {isSolo ? "Place Haven in a valid sector." : "Reverse Order: Last player places Haven first."}
                   </p>
                   <ul className="space-y-2">
                      {draftState.placementOrder.map((player, i) => (
                        <li key={i} className={`flex items-center p-2 rounded border ${itemBg}`}>
                          <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                          <span className={`text-sm font-medium ${itemText}`}>{player}</span>
                        </li>
                      ))}
                    </ul>
                 </>
              ) : (isPersephoneStart || isLondiniumStart || startAtSector) ? (
                <div className={`p-4 rounded text-center border ${specialPlacementBg}`}>
                  <p className={`font-bold mb-1 ${specialPlacementTitle}`}>Special Placement</p>
                  <p className={`text-sm ${specialPlacementText}`}>All ships start at <strong>{startAtSector || (isPersephoneStart ? 'Persephone' : 'Londinium')}</strong>.</p>
                  <p className={`text-xs italic mt-1 ${specialPlacementSub}`}>(Do not place in separate sectors)</p>
                </div>
              ) : (
                <>
                   <p className={`text-xs mb-3 italic ${panelSubColor}`}>
                    {isSolo 
                        ? (isBrowncoatDraft ? "Buy Fuel ($100) and place ship." : "Place Ship in Sector.")
                        : isBrowncoatDraft 
                        ? "Pass back to Right. Make remaining choice. Buy Fuel ($100)."
                        : "Pass to Right (Anti-Clockwise). Place Ship in Sector."
                    }
                  </p>
                  <ul className="space-y-2">
                    {draftState.placementOrder.map((player, i) => (
                      <li key={i} className={`flex items-center p-2 rounded border ${itemBg}`}>
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                        <span className={`text-sm font-medium ${itemText}`}>{player}</span>
                        {!isSolo && i === 0 && <span className={`ml-auto text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>First Place</span>}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>
          
          {isBrowncoatDraft && (
             <SpecialRuleBlock source="setupCard" title="Browncoat Market">
                <strong>Market Phase:</strong> Once all players have purchased a ship and chosen a leader, everyone may buy fuel ($100) and parts ($300).
                <br/><span className="text-xs italic opacity-75">Reminder: Free starting fuel/parts are disabled in this mode.</span>
             </SpecialRuleBlock>
          )}

          {isHavenDraft && (
            <SpecialRuleBlock source="setupCard" title="Placement Rules">
                 <ul className="list-disc ml-5 mt-1 space-y-1">
                     <li>Unoccupied Planetary Sector adjacent to a Supply Planet.</li>
                     <li>Cannot be placed in a Sector with a Contact.</li>
                     <li><strong>Important:</strong> Ships start at their Havens.</li>
                 </ul>
                 {/* Warning if Mad Verse is active */}
                 {activeStoryCard.setupConfig?.shipPlacementMode === 'persephone' && (
                     <div className={`mt-3 p-2 rounded font-bold border text-sm ${warningConflictBg}`}>
                         ⚠️ CONFLICT: Story Card override active. Ships must start at Persephone despite Haven rules!
                     </div>
                 )}
            </SpecialRuleBlock>
          )}

        </div>
      )}
    </>
  );
};
