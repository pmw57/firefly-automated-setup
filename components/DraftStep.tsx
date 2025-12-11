import React, { useState } from 'react';
import { GameState, Step, DraftState, DiceResult } from '../types';
import { STORY_CARDS } from '../constants';
import { calculateDraftOutcome } from '../utils';
import { Button } from './Button';
import { DiceControls } from './DiceControls';
import { SpecialRuleBlock } from './SpecialRuleBlock';

interface DraftStepProps {
  step: Step;
  gameState: GameState;
}

export const DraftStep: React.FC<DraftStepProps> = ({ step, gameState }) => {
  const [draftState, setDraftState] = useState<DraftState | null>(null);
  const [isManualEntry, setIsManualEntry] = useState(false);

  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];

  const handleDetermineOrder = () => {
    // 1. Initial Roll for everyone (D6)
    // These are the values that will be displayed to the user
    const initialRolls: DiceResult[] = gameState.playerNames.map(name => ({
        player: name,
        roll: Math.floor(Math.random() * 6) + 1
    }));

    // 2. Automate Tie Breaking
    // We use a separate array to track effective rolls for logic determination.
    // This allows us to re-roll for ties without overwriting the visual 'initialRolls' that caused the tie.
    const logicRolls = initialRolls.map(r => r.roll);
    let candidates = initialRolls.map((_, i) => i); 
    let winnerIndex = -1;

    // Loop until we have a single winner
    while (winnerIndex === -1) {
        // Find max roll value among current candidates using the logic array
        let currentMax = -1;
        candidates.forEach(i => {
            if (logicRolls[i] > currentMax) currentMax = logicRolls[i];
        });

        // Filter candidates who matched the max roll
        const tiedCandidates = candidates.filter(i => logicRolls[i] === currentMax);

        if (tiedCandidates.length === 1) {
            // We have a winner
            winnerIndex = tiedCandidates[0];
        } else {
            // Multiple winners: Re-roll ONLY for the tied players (internal logic only)
            candidates = tiedCandidates;
            candidates.forEach(i => {
                logicRolls[i] = Math.floor(Math.random() * 6) + 1;
            });
            // Loop continues to check results of the re-roll
        }
    }

    // Pass the INITIAL display rolls to the state, but force the winner based on the logic result
    const newState = calculateDraftOutcome(initialRolls, gameState.playerCount, winnerIndex);
    setDraftState(newState);
    
    // Disable manual override buttons since the computer calculated the result
    setIsManualEntry(false);
  };

  const handleRollChange = (index: number, newValue: string) => {
    if (!draftState) return;
    const val = parseInt(newValue) || 0;
    const newRolls = [...draftState.rolls];
    newRolls[index] = { ...newRolls[index], roll: val };
    
    // When manually changing, we reset the override winner index (3rd param) so it recalculates based on input
    const newState = calculateDraftOutcome(newRolls, gameState.playerCount);
    setDraftState(newState);
    
    // Enable manual override buttons since the user is editing values
    setIsManualEntry(true);
  };

  const handleSetWinner = (index: number) => {
    if (!draftState) return;
    // Explicitly set the winner, overriding automatic calculation logic
    const newState = calculateDraftOutcome(draftState.rolls, gameState.playerCount, index);
    setDraftState(newState);
  };

  // Determine which mode we are in based on the Step ID
  const isHavenDraft = step.id.includes('D_HAVEN_DRAFT');
  
  // Logic from activeStoryCard
  const isPersephoneStart = activeStoryCard.setupConfig?.shipPlacementMode === 'persephone';
  const isLondiniumStart = activeStoryCard.setupConfig?.startAtLondinium;
  const startOutsideAlliance = activeStoryCard.setupConfig?.startOutsideAllianceSpace;
  const startAtSector = activeStoryCard.setupConfig?.startAtSector;
  const allianceSpaceOffLimits = activeStoryCard.setupConfig?.allianceSpaceOffLimits;
  const addBorderHavens = activeStoryCard.setupConfig?.addBorderSpaceHavens;

  // Logic from Overrides
  const isBrowncoatDraft = overrides.browncoatDraftMode;
  const isWantedLeaderMode = overrides.wantedLeaderMode;

  return (
    <>
      <p className="mb-4 text-gray-600 dark:text-gray-400 italic">Determine who drafts first using a D6. Ties are resolved automatically.</p>
      {!draftState ? (
        <Button onClick={handleDetermineOrder} variant="secondary" fullWidth className="mb-4">
           🎲 Roll for {isHavenDraft ? 'Haven Draft' : 'Command'}
        </Button>
      ) : (
        <div className="animate-fade-in space-y-6">
          <DiceControls 
            draftState={draftState} 
            onRollChange={handleRollChange} 
            onSetWinner={handleSetWinner}
            allowManualOverride={isManualEntry}
          />
          
          {/* RULES BLOCK AREA */}
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

          {/* DRAFT UI */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Draft Order */}
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-lg border border-gray-200 dark:border-slate-700 relative overflow-hidden shadow-sm transition-colors duration-300">
              <div className="absolute top-0 right-0 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 text-xs font-bold px-2 py-1 rounded-bl">Step 1</div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-slate-800 pb-1">Draft Phase</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                {isHavenDraft 
                   ? "Standard Order: Winner chooses Leader & Ship first."
                   : isBrowncoatDraft 
                   ? "Winner selects Leader OR buys Ship. Pass to Left."
                   : "Winner selects Leader & Ship. Pass to Left."}
              </p>
              <ul className="space-y-2">
                {draftState.draftOrder.map((player, i) => (
                  <li key={i} className="flex items-center bg-gray-50 dark:bg-slate-800 p-2 rounded border border-gray-100 dark:border-slate-700">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player}</span>
                    {i === 0 && <span className="ml-auto text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">First Pick</span>}
                  </li>
                ))}
              </ul>
            </div>

            {/* Placement Order */}
            <div className="bg-white dark:bg-slate-900/80 p-4 rounded-lg border border-gray-200 dark:border-slate-700 relative overflow-hidden shadow-sm transition-colors duration-300">
              <div className="absolute top-0 right-0 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 text-xs font-bold px-2 py-1 rounded-bl">Step 2</div>
              <h4 className="font-bold text-gray-900 dark:text-gray-100 mb-2 border-b border-gray-100 dark:border-slate-800 pb-1">
                 {isHavenDraft ? 'Haven Placement' : 'Placement Phase'}
              </h4>
              
              {isHavenDraft ? (
                 <>
                   <p className="text-xs text-green-800 dark:text-green-300 mb-3 italic">Reverse Order: Last player places Haven first.</p>
                   <ul className="space-y-2">
                      {draftState.placementOrder.map((player, i) => (
                        <li key={i} className="flex items-center bg-gray-50 dark:bg-slate-800 p-2 rounded border border-gray-100 dark:border-slate-700">
                          <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player}</span>
                        </li>
                      ))}
                    </ul>
                 </>
              ) : (isPersephoneStart || isLondiniumStart || startAtSector) ? (
                <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded text-center border border-amber-200 dark:border-amber-800">
                  <p className="font-bold text-amber-900 dark:text-amber-100 mb-1">Special Placement</p>
                  <p className="text-sm text-amber-800 dark:text-amber-300">All ships start at <strong>{startAtSector || (isPersephoneStart ? 'Persephone' : 'Londinium')}</strong>.</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 italic mt-1">(Do not place in separate sectors)</p>
                </div>
              ) : (
                <>
                   <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">
                    {isBrowncoatDraft 
                      ? "Pass back to Right. Make remaining choice. Buy Fuel ($100)."
                      : "Pass to Right (Anti-Clockwise). Place Ship in Sector."}
                  </p>
                  <ul className="space-y-2">
                    {draftState.placementOrder.map((player, i) => (
                      <li key={i} className="flex items-center bg-gray-50 dark:bg-slate-800 p-2 rounded border border-gray-100 dark:border-slate-700">
                        <span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-bold flex items-center justify-center mr-2 shadow-sm">{i + 1}</span>
                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{player}</span>
                        {i === 0 && <span className="ml-auto text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">First Place</span>}
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
                     <div className="mt-3 p-2 rounded text-red-800 dark:text-red-200 font-bold border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 text-sm">
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