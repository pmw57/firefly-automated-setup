import React from 'react';
import { DisgruntledDieOption } from '../types';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';
import { TenthRulesSection } from './setup/TenthRulesSection';
import { SoloRulesSection } from './setup/SoloRulesSection';

interface OptionalRulesSelectionProps {
  onBack: () => void;
  onStart: () => void;
}

export const OptionalRulesSelection: React.FC<OptionalRulesSelectionProps> = ({ onBack, onStart }) => {
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

  const containerBg = isDark ? 'bg-black/60' : 'bg-[#faf8ef]/95';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const badgeClass = isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800' : 'bg-[#e6ddc5] text-[#7f1d1d] border-[#d6cbb0]';

  return (
    <div className={`${containerBg} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
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
