import React from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { DisgruntledDieOption } from '../types/index';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';
import { TenthRulesSection } from './setup/TenthRulesSection';
import { SoloRulesSection } from './setup/SoloRulesSection';

interface OptionalRulesSelectionProps {
  onStart: () => void;
  onBack: () => void;
}

export const OptionalRulesSelection: React.FC<OptionalRulesSelectionProps> = ({ onStart, onBack }) => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;

  const toggleSoloOption = (key: keyof typeof gameState.soloOptions) => {
    dispatch({ type: ActionType.TOGGLE_SOLO_OPTION, payload: key });
  };

  const toggleTimer = () => {
    dispatch({ type: ActionType.TOGGLE_TIMER_MODE });
  };

  const setDisgruntledDie = (mode: DisgruntledDieOption) => {
    dispatch({ type: ActionType.SET_DISGRUNTLED_DIE, payload: mode });
  };

  const toggleGorrammit = () => {
      const current = gameState.optionalRules.disgruntledDie;
      if (current !== 'standard') {
          setDisgruntledDie('standard');
      } else {
          setDisgruntledDie('disgruntle');
      }
  };

  const toggleShipUpgrades = () => {
    dispatch({ type: ActionType.TOGGLE_SHIP_UPGRADES });
  };

  const toggleConflictResolution = () => {
    dispatch({ type: ActionType.TOGGLE_CONFLICT_RESOLUTION });
  };

  const toggleHighVolumeSupply = () => {
    dispatch({ type: ActionType.TOGGLE_HIGH_VOLUME_SUPPLY });
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

  const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-green-600 border-green-700' : 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600'}`}>
        {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
  );

  return (
    <div className={`${containerBg} rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
       <div className={`flex justify-between items-center mb-6 border-b ${containerBorder} pb-2`}>
           <h2 className={`text-2xl font-bold font-western ${headerColor}`}>Optional Rules</h2>
           <span className={`text-xs font-bold ${badgeClass} border px-2 py-1 rounded`}>Part 3 of 3</span>
        </div>

        <div className="space-y-8 mb-8">
            {has10th && (
                <TenthRulesSection 
                    optionalRules={gameState.optionalRules}
                    onToggleGorrammit={toggleGorrammit}
                    onSetDisgruntledDie={setDisgruntledDie}
                    onToggleShipUpgrades={toggleShipUpgrades}
                />
            )}

            {isSolo && (
                <SoloRulesSection 
                    soloOptions={gameState.soloOptions}
                    timerConfig={gameState.timerConfig}
                    onToggleOption={toggleSoloOption}
                    onToggleTimer={toggleTimer}
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
                    onClick={toggleHighVolumeSupply} 
                    onKeyDown={(e) => handleKeyDown(e, toggleHighVolumeSupply)}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.optionalRules.highVolumeSupply} /></div>
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
                    onClick={toggleConflictResolution} 
                    onKeyDown={(e) => handleKeyDown(e, toggleConflictResolution)}
                    className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} focus:outline-none focus:ring-2 focus:ring-green-500`}
                >
                    <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.optionalRules.resolveConflictsManually} /></div>
                    <div>
                        <h3 className={`font-bold text-base ${textMain}`}>Manual Conflict Resolution</h3>
                        <p className={`text-xs italic ${isDark ? 'text-amber-500/80' : 'text-firefly-brown'} opacity-90 -mt-0.5 mb-2`}>"The Darkerspire Maneouver"</p>
                        <p className={`text-sm leading-relaxed ${textSub}`}>When Setup and Story Cards conflict, choose which rule to follow. If disabled, Story Cards always have priority.</p>
                    </div>
                </div>
               </div>
            </section>
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-dashed border-gray-300 dark:border-zinc-700">
            <Button onClick={onBack} variant="secondary" className="w-1/3">
            ← Back
            </Button>
            <Button onClick={onStart} fullWidth className="w-2/3 text-lg py-4 border-b-4 border-[#450a0a]">
            Begin Setup Sequence
            </Button>
        </div>
    </div>
  );
};