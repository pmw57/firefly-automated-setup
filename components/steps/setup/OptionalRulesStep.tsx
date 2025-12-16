
import React from 'react';
import { GameState, DisgruntledDieOption } from '../../../types';
import { Button } from '../../Button';
import { useTheme } from '../../ThemeContext';

interface OptionalRulesStepProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBack: () => void;
  onNext: () => void;
}

export const OptionalRulesStep: React.FC<OptionalRulesStepProps> = ({ gameState, setGameState, onBack, onNext }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;

  const toggleSoloOption = (key: keyof typeof gameState.soloOptions) => {
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

  const setDisgruntledDie = (mode: DisgruntledDieOption) => {
      setGameState(prev => ({
          ...prev,
          optionalRules: {
              ...prev.optionalRules,
              disgruntledDie: mode
          }
      }));
  };

  const toggleGorrammit = () => {
      const current = gameState.optionalRules.disgruntledDie;
      if (current !== 'standard') {
          setDisgruntledDie('standard');
      } else {
          setDisgruntledDie('disgruntle');
      }
  };

  const isGorrammitActive = gameState.optionalRules.disgruntledDie !== 'standard';

  const toggleShipUpgrades = () => {
      setGameState(prev => ({
          ...prev,
          optionalRules: {
              ...prev.optionalRules,
              optionalShipUpgrades: !prev.optionalRules.optionalShipUpgrades
          }
      }));
  };

  const containerBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const optionBorder = isDark ? 'border-zinc-700' : 'border-gray-200';
  const optionHover = isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-gray-50';
  const textMain = isDark ? 'text-gray-200' : 'text-gray-900';
  const textSub = isDark ? 'text-gray-400' : 'text-gray-600';

  const Checkbox = ({ checked }: { checked: boolean }) => (
    <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${checked ? 'bg-green-600 border-green-700' : 'bg-white dark:bg-zinc-800 border-gray-300 dark:border-zinc-600'}`}>
        {checked && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
    </div>
  );

  const RadioGroup = ({ label, options, value, onChange }: { label?: string, options: {val: string, label: string, desc: string}[], value: string, onChange: (v: string) => void }) => (
      <div className="mb-6">
          {label && <h4 className={`font-bold mb-3 ${textMain}`}>{label}</h4>}
          <div className="space-y-2">
              {options.map((opt) => (
                  <label key={opt.val} className={`flex items-start p-3 rounded-lg border cursor-pointer transition-colors ${value === opt.val ? (isDark ? 'border-green-500 bg-green-900/20' : 'border-green-600 bg-green-50') : `${optionBorder} ${optionHover}`}`}>
                      <input 
                        type="radio" 
                        name={label || "radio-group"} 
                        value={opt.val} 
                        checked={value === opt.val} 
                        onChange={() => onChange(opt.val)} 
                        className="mt-1 mr-3 accent-green-600 w-4 h-4"
                      />
                      <div>
                          <span className={`block font-bold text-sm ${textMain}`}>{opt.label}</span>
                          <span className={`block text-xs ${textSub}`}>{opt.desc}</span>
                      </div>
                  </label>
              ))}
          </div>
      </div>
  );

  return (
    <div className={`bg-metal rounded-xl shadow-inner p-6 md:p-8 border ${containerBorder} relative overflow-hidden transition-all duration-300`}>
        <div className="space-y-8 mb-8">
            {has10th && (
                <section>
                    <h3 className={`font-bold uppercase tracking-wide text-xs mb-4 pb-1 border-b ${isDark ? 'border-zinc-700 text-amber-500' : 'border-gray-300 text-amber-800'}`}>10th Anniversary Rules</h3>
                    
                    <div onClick={toggleGorrammit} className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover} mb-4`}>
                        <div className="mt-1 mr-4 shrink-0"><Checkbox checked={isGorrammitActive} /></div>
                        <div>
                            <h3 className={`font-bold text-base ${textMain}`}>Gorrammit! (Disgruntled Die)</h3>
                            <p className={`text-xs mt-1 ${textSub}`}>Rolling a 1 on the die has severe consequences.</p>
                        </div>
                    </div>

                    {isGorrammitActive && (
                        <div className={`ml-8 pl-4 border-l-2 border-dashed mb-6 ${isDark ? 'border-zinc-700' : 'border-gray-300'}`}>
                             <RadioGroup 
                                value={gameState.optionalRules.disgruntledDie}
                                onChange={(val) => setDisgruntledDie(val as DisgruntledDieOption)}
                                options={[
                                    { val: 'disgruntle', label: 'Disgruntled Crew', desc: 'Rolling a 1 disgruntles a crew member involved in the test.' },
                                    { val: 'auto_fail', label: 'Automatic Failure', desc: 'Rolling a 1 is an automatic failure (Botch), regardless of skill.' },
                                    { val: 'success_at_cost', label: 'Success At Cost', desc: 'Rolling a 1 succeeds, but with a penalty (Kill Crew / Spend Part / Disgruntle).' },
                                ]}
                            />
                        </div>
                    )}

                    <div onClick={toggleShipUpgrades} className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}>
                        <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.optionalRules.optionalShipUpgrades} /></div>
                        <div>
                            <h3 className={`font-bold text-base ${textMain}`}>Optional Ship Upgrades</h3>
                            <p className={`text-xs mt-1 ${textSub}`}>Include the deck of Ship Upgrades (from 10th Anniversary Edition).</p>
                        </div>
                    </div>
                </section>
            )}

            {isSolo && (
                <section>
                    <h3 className={`font-bold uppercase tracking-wide text-xs mb-4 pb-1 border-b ${isDark ? 'border-zinc-700 text-amber-500' : 'border-gray-300 text-amber-800'}`}>Solo Rules</h3>
                    <div className="space-y-4">
                        <div onClick={() => toggleSoloOption('noSureThings')} className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}>
                            <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.soloOptions.noSureThings} /></div>
                            <div>
                                <h3 className={`font-bold text-base ${textMain}`}>No Sure Things In Life</h3>
                                <p className={`text-xs mt-1 ${textSub}`}>Remove 5 cards from every Supply/Contact deck during setup to simulate a lived-in 'Verse.</p>
                            </div>
                        </div>
                        <div onClick={toggleTimer} className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}>
                            <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.timerConfig.mode === 'unpredictable'} /></div>
                            <div>
                                <h3 className={`font-bold text-base ${textMain}`}>Unpredictable Timer</h3>
                                <p className={`text-xs mt-1 ${textSub}`}>Use numbered tokens in the discard stack. The game might end suddenly when a token matches a die roll.</p>
                            </div>
                        </div>
                        <div onClick={() => toggleSoloOption('shesTrouble')} className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}>
                            <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.soloOptions.shesTrouble} /></div>
                            <div>
                                <h3 className={`font-bold text-base ${textMain}`}>She's Trouble</h3>
                                <p className={`text-xs mt-1 ${textSub}`}>Whenever you begin a turn with a <strong>Deceptive Crew</strong> on your ship and deceptive crew cards in a discard pile, roll a die. On a 1, they become Disgruntled.</p>
                            </div>
                        </div>
                        <div onClick={() => toggleSoloOption('recipeForUnpleasantness')} className={`flex items-start p-4 rounded-lg border cursor-pointer transition-colors ${optionBorder} ${optionHover}`}>
                            <div className="mt-1 mr-4 shrink-0"><Checkbox checked={gameState.soloOptions.recipeForUnpleasantness} /></div>
                            <div>
                                <h3 className={`font-bold text-base ${textMain}`}>Recipe For Unpleasantness</h3>
                                <p className={`text-xs mt-1 ${textSub}`}>Start of turn: Roll a die against the number of Disgruntled crew. If equal/lower, add a Disgruntled token to a crew member.</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}
        </div>

        <div className="flex gap-4 mt-8 pt-6 border-t border-dashed border-gray-300 dark:border-zinc-700">
            <Button onClick={onBack} variant="secondary" className="w-1/3">
            ← Back
            </Button>
            <Button onClick={onNext} fullWidth className="w-2/3 text-lg py-4 border-b-4 border-[#450a0a]">
            Begin Setup Sequence
            </Button>
        </div>
    </div>
  );
};
