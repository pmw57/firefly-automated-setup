import React, { useState, useMemo, useEffect } from 'react';
import { DisgruntledDieOption } from '../types/index';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
// FIX: Import `useGameDispatch` to correctly dispatch actions to the game state reducer.
import { useGameDispatch } from '../hooks/useGameDispatch';
import { TenthRulesSection } from './setup/TenthRulesSection';
import { SoloRulesSection } from './setup/SoloRulesSection';
import { calculateSetupFlow } from '../utils/flow';
// FIX: Import `ActionType` to resolve reference errors in dispatch calls.
import { ActionType } from '../state/actions';

interface OptionalRulesSelectionProps {
}

const ratingLabels = [
    "0 stars: Dev/Not Ready",
    "1 star: Draft/Prototype",
    "2 stars: Experimental",
    "3 stars: Stable/Playtested",
    "4 stars: Highly Recommended",
    "5 stars: Essential"
];

const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-green-600 border-green-700' : 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600'}`}>
        {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
);

export const OptionalRulesSelection: React.FC<OptionalRulesSelectionProps> = () => {
  // FIX: Destructure only the relevant state properties from `useGameState`.
  const { state: gameState } = useGameState();
  // FIX: Get the dispatch function and action creators from `useGameDispatch`.
  const {
    initializeOptionalRules,
    toggleSoloOption,
    toggleTimerMode,
    setDisgruntledDie,
    toggleShipUpgrades,
    toggleConflictResolution,
    toggleHighVolumeSupply,
    dispatch, // For raw dispatch
  } = useGameDispatch();
  const { theme } = useTheme();
  const [showRatingFilters, setShowRatingFilters] = useState(false);
  const isDark = theme === 'dark';
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;

  const totalParts = useMemo(() => calculateSetupFlow(gameState).filter(s => s.type === 'setup').length, [gameState]);

  useEffect(() => {
    // On the first visit to this page, if the rules haven't been initialized
    // (we check one of them being undefined), dispatch an action to set them
    // to their defaults. This prevents them from being active in 'quick' mode
    // if this page is never visited.
    if (gameState.optionalRules.highVolumeSupply === undefined) {
      initializeOptionalRules();
    }
  }, [initializeOptionalRules, gameState.optionalRules.highVolumeSupply]);

  const handleToggleSoloOption = (key: keyof typeof gameState.soloOptions) => {
    toggleSoloOption(key);
  };

  const handleToggleTimer = () => {
    toggleTimerMode();
  };

  const handleSetDisgruntledDie = (mode: DisgruntledDieOption) => {
    setDisgruntledDie(mode);
  };

  const toggleGorrammit = () => {
      const current = gameState.optionalRules.disgruntledDie;
      // An "on" state is anything that is not 'standard' and not undefined.
      const isOn = current && current !== 'standard';
      if (isOn) {
          handleSetDisgruntledDie('standard'); // Turn it off
      } else {
          handleSetDisgruntledDie('disgruntle'); // Turn it on
      }
  };

  const handleToggleShipUpgrades = () => {
    toggleShipUpgrades();
  };

  const handleToggleConflictResolution = () => {
    toggleConflictResolution();
  };

  const handleToggleHighVolumeSupply = () => {
    toggleHighVolumeSupply();
  };
  
  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        action();
    }
  };

  const containerBg = isDark ? 'bg-black/60 backdrop-blur-sm' : 'bg-[#faf8ef]/80 backdrop-blur-sm';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const badgeClass = isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800' : 'bg-[#e6ddc5] text-[#7f1d1d] border-[#d6cbb0]';
  
  const houseRuleHeaderBorder = isDark ? 'border-zinc-700' : 'border-gray-300';
  const houseRuleHeaderText = isDark ? 'text-blue-400' : 'text-blue-800';
  const optionBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
  const optionHover = isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50';
  const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600';

  // If rules are not initialized yet, render nothing to avoid flicker
  if (gameState.optionalRules.highVolumeSupply === undefined) {
    return null;
  }

  return (
    <div className={`${containerBg} rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
       <div className={`flex justify-between items-center mb-6 border-b ${containerBorder} pb-2`}>
           <h2 className={`text-2xl font-bold font-western ${headerColor}`}>Options</h2>
           <span className={`text-xs font-bold ${badgeClass} border px-2 py-1 rounded`}>Part {totalParts} of {totalParts}</span>
        </div>

        <div className="space-y-8 mb-8">
            {has10th && (
                <TenthRulesSection 
                    optionalRules={gameState.optionalRules}
                    onToggleGorrammit={toggleGorrammit}
                    onSetDisgruntledDie={handleSetDisgruntledDie}
                    onToggleShipUpgrades={handleToggleShipUpgrades}
                />
            )}

            {isSolo && has10th && (
                <SoloRulesSection 
                    soloOptions={gameState.soloOptions}
                    timerConfig={gameState.timerConfig}
                    onToggleOption={handleToggleSoloOption}
                    onToggleTimer={handleToggleTimer}
                />
            )}

            {/* House Rules Section */}
            <section>
              <h4 className={`font-bold uppercase tracking-wide text-xs mb-4 pb-1 border-b ${houseRuleHeaderBorder} ${houseRuleHeaderText}`}>
                House Rules
              </h4>
               <div className="space-y-4">
                 <div 
                    role="checkbox"
                    aria-checked={gameState.optionalRules.highVolumeSupply}
                    tabIndex={0}
                    onClick={handleToggleHighVolumeSupply} 
                    onKeyDown={(e) => handleKeyDown(e, handleToggleHighVolumeSupply)}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={!!gameState.optionalRules.highVolumeSupply} /></div>
                    <div>
                        <h3 className={`font-bold text-base ${textMain}`}>High Volume Supply</h3>
                        <p className={`text-xs italic ${isDark ? 'text-amber-500/80' : 'text-firefly-brown'} opacity-90 -mt-0.5 mb-2`}>"Every port's got a surplus."</p>
                        <p className={`text-sm leading-relaxed ${textSub}`}>When 3+ large supply expansions are active, increase the base "Priming the Pump" discard count from 3 to 4 to ensure better deck turnover.</p>
                    </div>
                </div>

                 <div 
                    role="checkbox"
                    aria-checked={gameState.optionalRules.resolveConflictsManually}
                    tabIndex={0}
                    onClick={handleToggleConflictResolution} 
                    onKeyDown={(e) => handleKeyDown(e, handleToggleConflictResolution)}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={!!gameState.optionalRules.resolveConflictsManually} /></div>
                    <div>
                        <h3 className={`font-bold text-base ${textMain}`}>Manual Conflict Resolution</h3>
                        <p className={`text-xs italic ${isDark ? 'text-amber-500/80' : 'text-firefly-brown'} opacity-90 -mt-0.5 mb-2`}>"The Darkerspire Maneouver"</p>
                        <p className={`text-sm leading-relaxed ${textSub}`}>When Setup and Story Cards conflict, choose which rule to follow. If disabled, Story Cards always have priority.</p>
                    </div>
                </div>
               </div>
            </section>
            
            {gameState.expansions.community && (
                <section>
                  <h4 className={`font-bold uppercase tracking-wide text-xs mb-4 pb-1 border-b ${houseRuleHeaderBorder} ${houseRuleHeaderText}`}>
                    Community Content
                  </h4>
                  <div className="space-y-4">
                    <div
                        role="checkbox"
                        aria-checked={showRatingFilters}
                        tabIndex={0}
                        onClick={() => setShowRatingFilters(!showRatingFilters)}
                        onKeyDown={(e) => handleKeyDown(e, () => setShowRatingFilters(!showRatingFilters))}
                        className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                    >
                        <div className="mr-4 shrink-0"><Checkbox checked={showRatingFilters} /></div>
                        <div>
                            <h3 className={`font-bold text-base ${textMain}`}>Filter by Rating</h3>
                            <p className={`text-sm leading-relaxed ${textSub}`}>Show options to filter community stories by their rating.</p>
                        </div>
                    </div>
                    
                    {showRatingFilters && (
                        <div className="pl-4 ml-5 border-l-2 border-dashed border-gray-300 dark:border-zinc-700 animate-fade-in">
                            <p className={`text-sm leading-relaxed ${textSub} mb-4 pt-4`}>Select which ratings to include. Unrated stories are always shown.</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {[...ratingLabels].reverse().map((label, index) => {
                                    const rating = 5 - index;
                                    return (
                                        <div
                                            key={rating}
                                            role="checkbox"
                                            aria-checked={gameState.storyRatingFilters[rating]}
                                            tabIndex={0}
                                            onClick={() => dispatch({ type: ActionType.TOGGLE_STORY_RATING_FILTER, payload: rating })}
                                            onKeyDown={(e) => handleKeyDown(e, () => dispatch({ type: ActionType.TOGGLE_STORY_RATING_FILTER, payload: rating }))}
                                            className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                                        >
                                            <div className="mr-3 shrink-0"><Checkbox checked={gameState.storyRatingFilters[rating]} /></div>
                                            <span className={`text-sm ${textMain}`}>{label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                  </div>
                </section>
            )}
        </div>
    </div>
  );
};