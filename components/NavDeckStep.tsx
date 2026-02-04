
import React, { useMemo, useCallback } from 'react';
import { SpecialRule } from '../types';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useGameState } from '../hooks/useGameState';
import { useNavDeckDetails } from '../hooks/useNavDeckDetails';
import { cls } from '../utils/style';
import { StepComponentProps } from './StepContent';
import { getCampaignNotesForStep } from '../utils/selectors/story';

export const NavDeckStep = ({ step }: StepComponentProps): React.ReactElement => {
  const { state: gameState } = useGameState();
  const overrides = useMemo(() => step.overrides || {}, [step.overrides]);
  
  const { 
    forceReshuffle,
    clearerSkies, 
    showStandardRules, 
    isHighPlayerCount,
    infoRules,
    overrideRules,
    hasRimDecks,
    isDisabled,
  } = useNavDeckDetails(overrides);

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

      // Sort logic for overrides: Expansion -> Setup -> Story
      const order: Record<SpecialRule['source'], number> = {
        expansion: 1, setupCard: 2, story: 3, warning: 0, info: 0,
      };
      
      let sorted = combined.sort((a, b) => (order[a.source] || 99) - (order[b.source] || 99));

      if (gameState.setupMode === 'quick') {
        sorted = sorted.filter(r => r.source !== 'story');
      }
      return sorted;
  }, [gameState.setupMode, campaignNotes]);
  
  const displayInfo = useMemo(() => formatRules(infoRules), [infoRules, formatRules]);
  const displayOverrides = useMemo(() => formatRules(overrideRules, true), [overrideRules, formatRules]);
  
  const forcedReshuffleInstruction = `Place the "RESHUFFLE" cards in their Nav Decks.${hasRimDecks ? " This applies to all active decks (including Rim Space)." : ""}`;

  let standardReshuffleInstruction = '';
  if (showStandardRules) {
    if (isHighPlayerCount) {
      standardReshuffleInstruction = 'Place the "RESHUFFLE" card in the Discard Pile of each Nav Deck.';
    } else {
      standardReshuffleInstruction = 'Shuffle the "RESHUFFLE" cards directly into each Nav Deck.';
    }
  }

  const decksToShuffle = hasRimDecks ? "Alliance, Border, and Rim Space" : "Alliance and Border";

  return (
    <div className="space-y-4">
      {displayInfo.map((rule, i) => (
          <OverrideNotificationBlock key={`info-${i}`} {...rule} />
      ))}

      <div className={cls("bg-surface-card/60 backdrop-blur-sm p-6 rounded-lg border shadow-sm overflow-hidden transition-colors duration-300 space-y-4 border-border-separator")}>
        {isDisabled ? (
            <div className="text-center italic text-content-subtle">
               <h4 className="font-bold text-lg mb-2 not-italic">Nav Decks Disabled</h4>
               <p>Nav Decks are not used in this scenario.</p>
            </div>
        ) : (
            <>
                <div className="space-y-2 text-content-primary">
                  <p>Shuffle the {decksToShuffle} Nav Decks separately.</p>
                  
                  {showStandardRules && (
                    <p>
                      <span className="font-bold border-b border-dotted border-border-subtle">
                        For {gameState.playerCount} player{gameState.playerCount > 1 ? 's' : ''}:
                      </span>
                      {' '}
                      {standardReshuffleInstruction}
                    </p>
                  )}
                  
                  {forceReshuffle && (
                    <p className="font-bold">
                      {forcedReshuffleInstruction}
                    </p>
                  )}
                </div>
                
                {clearerSkies && (
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    <h4 className="font-bold text-lg text-content-info">Clearer Skies Rule</h4>
                    <p className="text-sm mt-1 text-content-primary">
                      When initiating a <strong className="font-semibold">Full Burn</strong>, roll a die. The result is how many sectors you may move before you start drawing Nav Cards.
                    </p>
                    <p className="text-xs mt-2 italic text-content-subtle">
                      Note: You may not move farther than your Drive Core's range, regardless of the die roll.
                    </p>
                  </div>
                )}
            </>
        )}
      </div>

      {displayOverrides.map((rule, i) => (
          <OverrideNotificationBlock key={`override-${i}`} {...rule} />
      ))}
    </div>
  );
};
