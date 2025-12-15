
import React from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS, SETUP_CARDS } from '../constants';
import { calculateStartingResources } from '../utils';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { JobStep } from './JobStep';
import { DraftStep } from './DraftStep';
import { useTheme } from './ThemeContext';
import { Button } from './Button';
import { ExpansionIcon } from './ExpansionIcon';

interface DynamicStepHandlerProps {
  step: Step;
  gameState: GameState;
  // We need setGameState to handle the Flying Solo secondary selection
  setGameState?: React.Dispatch<React.SetStateAction<GameState>>; 
}

export const DynamicStepHandler: React.FC<DynamicStepHandlerProps> = ({ step, gameState, setGameState }) => {
  const id = step.id;
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  if (id.includes('D_RIM_JOBS')) {
    return <JobStep step={step} gameState={gameState} />;
  }
  
  if (id.includes('D_HAVEN_DRAFT')) {
    return <DraftStep step={step} gameState={gameState} />;
  }

  const warningText = isDark ? 'text-red-400' : 'text-red-700';
  const panelBg = isDark ? 'bg-slate-900/80' : 'bg-white';
  const panelBorder = isDark ? 'border-slate-700' : 'border-gray-200';
  const textColor = isDark ? 'text-gray-200' : 'text-gray-800';
  const numberColor = isDark ? 'text-green-400' : 'text-green-800';
  const subText = isDark ? 'text-gray-400' : 'text-gray-500';
  const dangerTitle = isDark ? 'text-red-300' : 'text-red-800';
  const dangerBorder = isDark ? 'border-red-800' : 'border-red-200';

  if (id.includes('D_FLYING_SOLO_SETUP')) {
    if (!setGameState) return null;

    const availableSetups = SETUP_CARDS.filter(s => 
        s.id !== 'FlyingSolo' && 
        (!s.requiredExpansion || gameState.expansions[s.requiredExpansion])
    );

    const handleSelect = (setupId: string) => {
        setGameState(prev => ({
            ...prev,
            secondarySetupId: setupId
        }));
        // Scroll slightly to indicate progress or change
        window.scrollTo({ top: 100, behavior: 'smooth' });
    };

    return (
        <div className="space-y-4">
            <SpecialRuleBlock source="expansion" title="Paired Setup Card">
                In Expanded Solo Mode, you must pair the "Flying Solo" rules with a standard Setup Card to determine the initial board state, decks, and starting resources.
            </SpecialRuleBlock>
            
            <p className={`mb-4 font-bold ${textColor}`}>Choose your Board Setup:</p>
            
            <div className="grid grid-cols-1 gap-3">
                {availableSetups.map(s => {
                    const isSelected = gameState.secondarySetupId === s.id;
                    const bColor = isSelected ? (isDark ? 'border-green-500 bg-green-900/20' : 'border-green-600 bg-green-50') : (isDark ? 'border-zinc-700 bg-zinc-800' : 'border-gray-300 bg-white');
                    
                    return (
                        <button
                            key={s.id}
                            onClick={() => handleSelect(s.id)}
                            className={`flex items-center p-3 rounded-lg border-2 text-left transition-all ${bColor} hover:shadow-md focus:outline-none focus:z-10 focus:ring-2 focus:ring-green-500`}
                        >
                            <div className="w-10 h-10 mr-3 shrink-0">
                                {s.requiredExpansion ? (
                                    <ExpansionIcon id={s.requiredExpansion} />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 dark:bg-zinc-700 rounded flex items-center justify-center font-bold text-gray-500 dark:text-gray-400 text-xs">
                                        BG
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <h4 className={`font-bold ${isSelected ? 'text-green-600 dark:text-green-400' : textColor}`}>{s.label}</h4>
                                <p className={`text-xs ${subText} line-clamp-1`}>{s.description}</p>
                            </div>
                            {isSelected && <span className="text-green-500 text-xl font-bold ml-2">✓</span>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
  }

  if (id.includes('D_NO_SURE_THINGS')) {
    return (
        <SpecialRuleBlock source="setupCard" title="No Sure Things In Life">
            <p className="mb-2"><strong>Remove 5 cards from play</strong> for <em>each</em> Supply and Contact Deck.</p>
            <p className="text-sm opacity-80">These cards are kept face down and cannot be accessed in any way during the game.</p>
        </SpecialRuleBlock>
    );
  }

  if (id.includes('D_GAME_LENGTH_TOKENS')) {
      if (!setGameState) return null;

      // Handle Disable Flag
      if (activeStoryCard.setupConfig?.disableSoloTimer) {
           return (
               <SpecialRuleBlock source="story" title="Story Override">
                   <strong>No Timer:</strong> Do not use a Game Timer for this game.
               </SpecialRuleBlock>
           );
      }

      const hasPirates = gameState.expansions.pirates;
      
      const AVAILABLE_TOKENS = [1, 1, 2, 2, 3, 4]; // The complete pool
      const BASE_INDICES = [0, 2, 4, 5]; // Corresponds to 1, 2, 3, 4
      const ALL_INDICES = [0, 1, 2, 3, 4, 5]; // Corresponds to 1, 1, 2, 2, 3, 4
      
      const { mode, unpredictableSelectedIndices, randomizeUnpredictable } = gameState.timerConfig;

      // Determine if extra tokens are currently active based on length
      const isExtraTokensActive = unpredictableSelectedIndices.length > 4;

      const setMode = (m: 'standard' | 'unpredictable') => {
          setGameState(prev => ({
              ...prev,
              timerConfig: { ...prev.timerConfig, mode: m }
          }));
      };

      const toggleExtraTokens = () => {
          const newIndices = isExtraTokensActive ? BASE_INDICES : ALL_INDICES;
          setGameState(prev => ({
              ...prev,
              timerConfig: { ...prev.timerConfig, unpredictableSelectedIndices: newIndices }
          }));
      };

      const toggleRandomize = () => {
          setGameState(prev => ({
              ...prev,
              timerConfig: { ...prev.timerConfig, randomizeUnpredictable: !prev.timerConfig.randomizeUnpredictable }
          }));
      };

      // Construct the display stack for Unpredictable Mode
      const selectedTokens = unpredictableSelectedIndices.map(i => AVAILABLE_TOKENS[i]);
      const displayStack = [...selectedTokens];
      
      // Default rule: Reveal 1 first, then 2, etc. (Ascending order)
      // If NOT randomized, sort ascending.
      if (!randomizeUnpredictable) {
          displayStack.sort((a, b) => a - b);
      } else {
          // If randomized, we just show "Random Order" visually or shuffle for display (simulated)
          // For the UI, we just indicate they are shuffled.
      }

      const totalTokens = 20;
      const numNumbered = selectedTokens.length;
      const topDisgruntled = Math.max(0, totalTokens - 1 - numNumbered);

      return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
                <Button 
                    onClick={() => setMode('standard')} 
                    variant={mode === 'standard' ? 'primary' : 'secondary'}
                    className="flex-1 text-sm py-2"
                >
                    Standard Timer
                </Button>
                {hasPirates && (
                    <Button 
                        onClick={() => setMode('unpredictable')} 
                        variant={mode === 'unpredictable' ? 'primary' : 'secondary'}
                        className="flex-1 text-sm py-2"
                    >
                        Unpredictable Timer
                    </Button>
                )}
            </div>

            {mode === 'standard' && (
                <div className={`${panelBg} p-4 rounded-lg border ${panelBorder} shadow-sm animate-fade-in`}>
                    <h4 className={`font-bold mb-2 ${textColor}`}>Standard Solo Timer</h4>
                    <p className={subText}>Set aside <strong>20 Disgruntled Tokens</strong> to use as Game Length Tokens.</p>
                    <p className={`text-sm mt-2 opacity-80 border-t ${isDark ? 'border-zinc-700' : 'border-gray-200'} pt-2`}>
                        Discard one token at the start of every turn. When the last token is gone, you have one final turn.
                    </p>
                </div>
            )}

            {mode === 'unpredictable' && (
                <div className={`animate-fade-in space-y-4`}>
                    <SpecialRuleBlock source="expansion" title="Pirates & Bounty Hunters Rule">
                         <p>Replace the bottom Game Length Tokens with numbered Destination Tokens.</p>
                         <p className="mt-2 text-sm"><strong>The Mechanic:</strong> Whenever you discard a numbered Game Length Token, <strong>roll a die</strong>. If you roll <strong>equal to or lower</strong> than the number, discard all remaining Game Length Tokens. Take one final turn.</p>
                    </SpecialRuleBlock>

                    <div className={`${panelBg} p-4 rounded-lg border ${panelBorder}`}>
                        <h5 className={`font-bold text-sm uppercase tracking-wide mb-3 ${textColor}`}>Configure Stack</h5>
                        
                        <div className="space-y-3 mb-6">
                            <label className={`flex items-center cursor-pointer p-2 rounded border ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={isExtraTokensActive}
                                    onChange={toggleExtraTokens}
                                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <div className="ml-3">
                                    <span className={`block text-sm font-medium ${textColor}`}>Use Extra Numbered Tokens</span>
                                    <span className={`block text-xs ${subText}`}>Adds an extra "1" and "2" token to the stack (Harder).</span>
                                </div>
                            </label>

                            <label className={`flex items-center cursor-pointer p-2 rounded border ${isDark ? 'border-zinc-700 hover:bg-zinc-800' : 'border-gray-200 hover:bg-gray-50'}`}>
                                <input 
                                    type="checkbox" 
                                    checked={randomizeUnpredictable}
                                    onChange={toggleRandomize}
                                    className="w-4 h-4 text-amber-600 bg-gray-100 border-gray-300 rounded focus:ring-amber-500 dark:bg-gray-700 dark:border-gray-600"
                                />
                                <div className="ml-3">
                                    <span className={`block text-sm font-medium ${textColor}`}>Randomize Numbered Token Order</span>
                                    <span className={`block text-xs ${subText}`}>Tokens appear in random order instead of 1 to 4.</span>
                                </div>
                            </label>
                        </div>

                        <div className={`mt-4 p-4 rounded bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800`}>
                             <h6 className={`font-bold text-xs uppercase mb-2 ${isDark ? 'text-amber-400' : 'text-amber-800'}`}>Stack Construction (Top to Bottom)</h6>
                             <ol className={`list-decimal ml-5 text-sm space-y-1 ${isDark ? 'text-amber-100' : 'text-amber-900'}`}>
                                 <li>Stack <strong>{topDisgruntled}</strong> Disgruntled Tokens.</li>
                                 {randomizeUnpredictable ? (
                                     <li>Stack the <strong>{numNumbered} numbered tokens</strong> in <strong>RANDOM</strong> order.</li>
                                 ) : (
                                     displayStack.map((val, i) => (
                                         <li key={i}>Place <strong>Token #{val}</strong>.</li>
                                     ))
                                 )}
                                 <li>Place <strong>1 Disgruntled Token</strong> at the very bottom (Last Turn).</li>
                             </ol>
                        </div>
                    </div>
                </div>
            )}
        </div>
      );
  }

  if (id.includes('D_TIME_LIMIT')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Game Timer:</strong>
        <div className="space-y-3 mt-1">
          <p>Give a pile of <strong>20 Disgruntled Tokens</strong> to the player taking the first turn. These tokens will be used as Game Length Tokens.</p>
          <p>Each time that player takes a turn, discard one of the Disgruntled Tokens. When the final token is discarded, everyone gets one final turn, then the game is over.</p>
          <p className={`font-bold ${warningText}`}>If time runs out before the Story Card is completed, the player with the most credits wins.</p>
        </div>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_SHUTTLE')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Draft Shuttles from Supply:</strong>
        <ul className="list-decimal ml-5 space-y-2 mt-1">
          <li>Pull all <strong>Shuttles</strong> from the Supply Decks.</li>
          <li>Starting with the winner of the Ship Roll, each player takes <strong>1 Shuttle</strong> for free.</li>
          <li>Selection passes to the <strong>left</strong>.</li>
          <li>Place remaining Shuttles in their respective discard piles.</li>
        </ul>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_BC_CAPITOL')) {
    const { totalCredits, bonusCredits } = calculateStartingResources(activeStoryCard, overrides);
    return (
      <div className={`text-center p-8 rounded-lg border shadow-sm transition-colors duration-300 ${panelBg} ${panelBorder}`}>
        <p className={`text-lg mb-2 ${textColor}`}>Each player receives:</p>
        <div className={`text-5xl font-bold font-western my-4 ${numberColor}`}>${totalCredits}</div>
        {bonusCredits > 0 && <p className={`text-sm ${subText}`}>(Includes ${bonusCredits} Story Bonus)</p>}
      </div>
    );
  }

  if (id.includes('D_LOCAL_HEROES')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Local Heroes Bonuses:</strong>
        <ul className="list-disc ml-5 space-y-2 mt-1">
          <li><strong>Shore Leave:</strong> At your Haven, you may use a Buy Action to take Shore Leave for free. Remove all Disgruntled and Wanted tokens.</li>
          <li><strong>Home Field Advantage:</strong> When you proceed with Misbehaving in the same System as your Haven, take <strong>$100</strong>.</li>
        </ul>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_ALLIANCE_ALERT')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>Alliance Alert Cards:</strong>
        <div className="space-y-3 mt-1">
          <p>Begin the game with <strong>one random Alliance Alert Card</strong> in play.</p>
          <p className="text-sm italic">Each Alert has a rule that affects all players. When a Misbehave Card directs you to draw a new Alert Card, place the current Alert at the bottom of the Alert Deck.</p>
        </div>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_PRESSURES_HIGH')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>The Pressure's High:</strong>
        <div className="space-y-4 mt-1">
          <div>
            <strong className={`block mb-1 ${dangerTitle}`}>Alliance Alert</strong>
            <p>Begin the game with one random Alliance Alert Card in play.</p>
          </div>
          <div className={`border-t pt-3 ${dangerBorder}`}>
            <strong className={`block mb-1 ${dangerTitle}`}>Wanted Accumulation</strong>
            <ul className="list-disc ml-5 text-sm">
              <li>Wanted Crew and Leaders may accumulate Wanted tokens.</li>
              <li><strong>Roll Check:</strong> When making Alliance Wanted Crew rolls, you must roll higher than the number of current Wanted tokens for that Crew/Leader to avoid effects.</li>
            </ul>
          </div>
        </div>
      </SpecialRuleBlock>
    );
  }

  if (id.includes('D_STRIP_MINING')) {
    return (
      <SpecialRuleBlock source="setupCard" title="Setup Card Override">
        <strong>The Dinosaur Draft:</strong>
        <ol className="list-decimal ml-5 space-y-2 text-sm mt-1">
          <li>Choose 1 Supply Deck to be "Strip Mined".</li>
          <li>The winner of the Ship Roll claims the <strong>Dinosaur</strong>.</li>
          <li>Reveal <strong>{gameState.playerCount} cards</strong> from the top of the chosen deck.</li>
          <li>Starting at the Dinosaur and going left, draft one card for free.</li>
          <li>Pass the Dinosaur to the left. Repeat until all players have been the Dinosaur once.</li>
        </ol>
      </SpecialRuleBlock>
    );
  }

  return <div className="p-4 text-red-500">Content for {id} not found.</div>;
};
