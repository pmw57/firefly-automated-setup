
import React from 'react';
import { GameState } from '../types';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

interface SoloRulesSelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBack: () => void;
  onStart: () => void;
}

export const SoloRulesSelection: React.FC<SoloRulesSelectionProps> = ({ gameState, setGameState, onBack, onStart }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const toggleOption = (key: keyof typeof gameState.soloOptions) => {
    setGameState(prev => ({
      ...prev,
      soloOptions: {
        ...prev.soloOptions,
        [key]: !prev.soloOptions[key]
      }
    }));
  };

  const toggleTimer = () => {
    setGameState(prev => ({
      ...prev,
      timerConfig: {
        ...prev.timerConfig,
        mode: prev.timerConfig.mode === 'standard' ? 'unpredictable' : 'standard'
      }
    }));
  };

  const containerBg = isDark ? 'bg-black/60' : 'bg-[#faf8ef]/95';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const badgeClass = isDark ? 'bg-indigo-900/40 text-indigo-300 border-indigo-800' : 'bg-[#e6ddc5] text-[#7f1d1d] border-[#d6cbb0]';
  
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
    <div className={`${containerBg} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
       <div className={`flex justify-between items-center mb-6 border-b ${containerBorder} pb-2`}>
           <h2 className={`text-2xl font-bold font-western ${headerColor}`}>Optional Rules</h2>
           <span className={`text-xs font-bold ${badgeClass} border px-2 py-1 rounded`}>Part 3 of 3</span>
        </div>

        <div className="space-y-4 mb-8">
            <p className={`text-sm ${textSub} mb-4`}>
                Customize your solo experience with these optional rules.
            </p>

            {/* No Sure Things */}
            <div 
                onClick={() => toggleOption('noSureThings')}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}
            >
                <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.soloOptions.noSureThings} /></div>
                <div>
                    <h3 className={`font-bold text-base ${textMain}`}>No Sure Things In Life</h3>
                    <p className={`text-xs mt-1 ${textSub}`}>
                        Remove 5 cards from every Supply/Contact deck during setup to simulate a lived-in 'Verse.
                    </p>
                </div>
            </div>

            {/* Unpredictable Timer */}
            <div 
                onClick={toggleTimer}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}
            >
                <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.timerConfig.mode === 'unpredictable'} /></div>
                <div>
                    <h3 className={`font-bold text-base ${textMain}`}>Unpredictable Timer</h3>
                    <p className={`text-xs mt-1 ${textSub}`}>
                        Use numbered tokens in the discard stack. The game might end suddenly when a token matches a die roll.
                    </p>
                </div>
            </div>

            {/* She's Trouble */}
            <div 
                onClick={() => toggleOption('shesTrouble')}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}
            >
                <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.soloOptions.shesTrouble} /></div>
                <div>
                    <h3 className={`font-bold text-base ${textMain}`}>She's Trouble</h3>
                    <p className={`text-xs mt-1 ${textSub}`}>
                        Whenever you begin a turn with a <strong>Deceptive Crew</strong> on your ship and deceptive crew cards in a discard pile, roll a die. On a 1, they become Disgruntled.
                    </p>
                </div>
            </div>

            {/* Recipe For Unpleasantness */}
            <div 
                onClick={() => toggleOption('recipeForUnpleasantness')}
                className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}
            >
                <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.soloOptions.recipeForUnpleasantness} /></div>
                <div>
                    <h3 className={`font-bold text-base ${textMain}`}>Recipe For Unpleasantness</h3>
                    <p className={`text-xs mt-1 ${textSub}`}>
                         Start of turn: Roll a die against the number of Disgruntled crew. If equal/lower, add a Disgruntled token to a crew member.
                    </p>
                </div>
            </div>
        </div>

        <div className="flex gap-4">
            <Button onClick={onBack} variant="secondary" className="w-1/3">
            ← Back
            </Button>
            <Button onClick={onStart} fullWidth className="w-2/3 text-xl py-4 border-b-4 border-[#450a0a]">
            Launch Setup Sequence
            </Button>
        </div>
    </div>
  );
};
