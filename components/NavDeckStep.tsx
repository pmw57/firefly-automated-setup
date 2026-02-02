
import React, { useMemo, useCallback } from 'react';
import { SpecialRule } from '../types';
import { OverrideNotificationBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
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

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const panelBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-white/60 backdrop-blur-sm';
  const panelBorder = isDark ? 'border-zinc-800' : 'border-gray-200';
  const panelText = isDark ? 'text-gray-300' : 'text-gray-800';
  
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

      <div className={cls(panelBg, "p-6 rounded-lg border shadow-sm overflow-hidden transition-colors duration-300 space-y-4", panelBorder)}>
        {isDisabled ? (
            <div className={cls("text-center italic", isDark ? "text-zinc-500" : "text-gray-500")}>
               <h4 className="font-bold text-lg mb-2 not-italic">Nav Decks Disabled</h4>
               <p>Nav Decks are not used in this scenario.</p>
            </div>
        ) : (
            <>
                <div className={cls(panelText, "space-y-2")}>
                  <p>Shuffle the {decksToShuffle} Nav Decks separately.</p>
                  
                  {showStandardRules && (
                    <p>
                      <span className={cls("font-bold border-b border-dotted", isDark ? 'border-zinc-500' : 'border-gray-400')}>
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
                  <div className={cls("mt-4 pt-4 border-t", isDark ? 'border-zinc-700' : 'border-stone-200')}>
                    <h4 className="font-bold text-lg text-sky-800 dark:text-sky-300">Clearer Skies Rule</h4>
                    <p className={cls("text-sm mt-1", panelText)}>
                      When initiating a <strong className="font-semibold">Full Burn</strong>, roll a die. The result is how many sectors you may move before you start drawing Nav Cards.
                    </p>
                    <p className="text-xs mt-2 italic text-gray-500 dark:text-gray-400">
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
