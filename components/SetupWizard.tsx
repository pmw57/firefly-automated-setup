
import React, { useState, useEffect } from 'react';
import { GameState, Step } from '../types';
import { SETUP_CARDS, STORY_CARDS, EXPANSIONS_METADATA } from '../constants';
import { getDefaultGameState, calculateSetupFlow } from '../utils';
import { InitialForm } from './InitialForm';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { useTheme } from './ThemeContext';

const STORAGE_KEY = 'firefly_setup_v2';

interface PersistedState {
  gameState: GameState;
  currentStepIndex: number;
  isStarted: boolean;
}

// Extracted Summary Component for the final step
const FinalSummary: React.FC<{ gameState: GameState }> = ({ gameState }) => {
    const { theme } = useTheme();
    const isDark = theme === 'dark';
    
    const activeStory = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);
    const activeExpansions = EXPANSIONS_METADATA.filter(e => gameState.expansions[e.id]).map(e => e.label);
    
    // Determine Display Name
    let displaySetupName = gameState.setupCardName;
    if (gameState.setupCardId === 'FlyingSolo' && gameState.secondarySetupId) {
        const secondary = SETUP_CARDS.find(s => s.id === gameState.secondarySetupId);
        if (secondary) displaySetupName = `Flying Solo + ${secondary.label}`;
    }

    // Timer Summary
    let timerSummary = null;
    const isSoloTimerActive = gameState.gameMode === 'solo' && 
                              !activeStory?.setupConfig?.disableSoloTimer &&
                              (gameState.setupCardId === 'FlyingSolo' || activeStory?.setupConfig?.soloGameTimer);
    
    if (isSoloTimerActive) {
        if (gameState.timerConfig.mode === 'standard') {
            timerSummary = "Standard (20 Turns)";
        } else {
            const extraTokens = gameState.timerConfig.unpredictableSelectedIndices.length > 4;
            const randomized = gameState.timerConfig.randomizeUnpredictable;
            timerSummary = `Unpredictable${extraTokens ? ' (Extra Tokens)' : ''}${randomized ? ' (Randomized)' : ''}`;
        }
    } else if (activeStory?.setupConfig?.disableSoloTimer) {
        timerSummary = "Disabled (Story Override)";
    }

    // Optional Rules
    const activeOptionalRules: string[] = [];
    if (gameState.soloOptions?.noSureThings) activeOptionalRules.push("No Sure Things");
    if (gameState.soloOptions?.shesTrouble) activeOptionalRules.push("She's Trouble");
    if (gameState.soloOptions?.recipeForUnpleasantness) activeOptionalRules.push("Recipe For Unpleasantness");
    if (gameState.optionalRules?.optionalShipUpgrades) activeOptionalRules.push("Ship Upgrades");
    
    // Disgruntled Die
    const disgruntledDieMode = gameState.optionalRules?.disgruntledDie || 'standard';
    const disgruntledLabels: Record<string, string> = {
        standard: "Standard (Just a 1)",
        disgruntle: "Disgruntled Crew",
        auto_fail: "Automatic Failure",
        success_at_cost: "Success At Cost"
    };

    // Calculate Active Challenges & Advanced Rules
    const activeStoryChallenges = activeStory?.challengeOptions?.filter(o => gameState.challengeOptions[o.id]) || [];
    const activeAdvancedRules = STORY_CARDS
        .filter(c => c.advancedRule && gameState.challengeOptions[c.advancedRule.id])
        .map(c => c.advancedRule!);

    // Styles
    const summaryBg = isDark ? 'bg-black/20' : 'bg-amber-50/50';
    const summaryBorder = isDark ? 'border-white/10' : 'border-amber-900/10';
    const labelClass = `text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-amber-800/60'} mb-1`;
    const valueClass = `font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`;

    return (
        <div className={`text-left max-w-lg mx-auto mb-8 p-6 rounded-lg border ${summaryBg} ${summaryBorder}`}>
            <h3 className={`font-western text-xl border-b pb-2 mb-4 ${isDark ? 'text-gray-400 border-white/10' : 'text-amber-900 border-amber-900/20'}`}>
                Flight Manifest
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                 <div>
                    <div className={labelClass}>Setup Scenario</div>
                    <div className={valueClass}>{displaySetupName}</div>
                 </div>

                 <div>
                    <div className={labelClass}>Mission</div>
                    <div className={valueClass}>{gameState.selectedStoryCard}</div>
                 </div>

                 {gameState.selectedGoal && (
                     <div className="sm:col-span-2">
                        <div className={labelClass}>Active Goal</div>
                        <div className={`${valueClass} text-amber-700 dark:text-amber-400`}>{gameState.selectedGoal}</div>
                     </div>
                 )}

                 {/* Challenges */}
                 {activeStoryChallenges.length > 0 && (
                     <div className="sm:col-span-2">
                        <div className={labelClass}>Directives & Challenges</div>
                        <ul className={`list-disc ml-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                            {activeStoryChallenges.map(o => (
                                <li key={o.id}>{o.label}</li>
                            ))}
                        </ul>
                     </div>
                 )}

                 {/* Advanced Rules */}
                 {activeAdvancedRules.length > 0 && (
                     <div className="sm:col-span-2">
                        <div className={labelClass}>Advanced Rules</div>
                        <ul className={`list-disc ml-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                            {activeAdvancedRules.map(o => (
                                <li key={o.id}>
                                    <strong>{o.title}</strong>
                                </li>
                            ))}
                        </ul>
                     </div>
                 )}

                 <div>
                    <div className={labelClass}>Captain(s)</div>
                    <div className={valueClass}>{gameState.playerCount}</div>
                    <div className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {gameState.playerNames.join(', ')}
                    </div>
                 </div>

                 {(isSoloTimerActive || timerSummary) && (
                     <div>
                        <div className={labelClass}>Solo Timer</div>
                        <div className={valueClass}>{timerSummary}</div>
                     </div>
                 )}

                 {disgruntledDieMode !== 'standard' && (
                     <div>
                         <div className={labelClass}>Disgruntled Die</div>
                         <div className={valueClass}>{disgruntledLabels[disgruntledDieMode]}</div>
                     </div>
                 )}

                 {activeOptionalRules.length > 0 && (
                     <div className="sm:col-span-2">
                         <div className={labelClass}>Optional Rules</div>
                         <div className={valueClass}>{activeOptionalRules.join(', ')}</div>
                     </div>
                 )}
                 
                 <div className="sm:col-span-2">
                    <div className={labelClass}>Active Expansions</div>
                    <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        {activeExpansions.join(', ')}
                    </div>
                 </div>
            </div>
        </div>
    );
};

const SetupWizard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getDefaultGameState());
  const [flow, setFlow] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 
  const [isStarted, setIsStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [initialFormStep, setInitialFormStep] = useState<number>(1);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Build the flow based on selection using utils logic
  const buildFlow = () => {
    const newFlow = calculateSetupFlow(gameState);
    setFlow(newFlow);
    setIsStarted(true);
    setCurrentStepIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load state from local storage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed: PersistedState = JSON.parse(saved);
          if (!parsed.gameState.gameEdition) throw new Error("Legacy state");
          
          // Deep merge with default state to ensure new fields (like soloOptions) are present
          const defaults = getDefaultGameState();
          const loadedState = parsed.gameState;
          
          const mergedState: GameState = {
              ...defaults,
              ...loadedState,
              // Safely merge nested objects that might be missing in older saved states
              timerConfig: { ...defaults.timerConfig, ...(loadedState.timerConfig || {}) },
              soloOptions: { ...defaults.soloOptions, ...(loadedState.soloOptions || {}) },
              optionalRules: { ...defaults.optionalRules, ...(loadedState.optionalRules || {}) },
              expansions: { ...defaults.expansions, ...(loadedState.expansions || {}) },
              challengeOptions: { ...defaults.challengeOptions, ...(loadedState.challengeOptions || {}) }
          };

          setGameState(mergedState);
          
          if (parsed.isStarted) {
            const newFlow = calculateSetupFlow(mergedState);
            setFlow(newFlow);
            setCurrentStepIndex(parsed.currentStepIndex);
            setIsStarted(true);
          }
        } catch (e) {
          console.warn("State reset due to version update or error", e);
        }
      }
      setIsInitialized(true);
    }, 1200); 

    return () => clearTimeout(timer);
  }, []);

  // Save state to local storage
  useEffect(() => {
    if (!isInitialized) return;
    const dataToSave: PersistedState = { gameState, currentStepIndex, isStarted };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [gameState, currentStepIndex, isStarted, isInitialized]);

  const handleNext = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, flow.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      setIsStarted(false);
      setFlow([]);
      setInitialFormStep(2); // Return to setup selection
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const performReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(getDefaultGameState());
    setFlow([]);
    setCurrentStepIndex(0);
    setIsStarted(false);
    setShowConfirmReset(false);
    setInitialFormStep(1);
    setResetKey(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-900 mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-700 font-western tracking-wider animate-pulse">Initializing Cortex...</h2>
      </div>
    );
  }

  if (!isStarted) {
    return <InitialForm key={resetKey} gameState={gameState} setGameState={setGameState} onStart={buildFlow} initialStep={initialFormStep} />;
  }

  const currentStep = flow[currentStepIndex];
  if (!currentStep) {
    performReset();
    return null;
  }
  
  const isFinal = currentStep.type === 'final';

  // Theme constants for Header
  const stickyHeaderBg = isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-[#faf8ef]/95 border-[#d6cbb0]';
  const displaySetupName = gameState.setupCardId === 'FlyingSolo' && gameState.secondarySetupId
      ? `Flying Solo + ${SETUP_CARDS.find(s => s.id === gameState.secondarySetupId)?.label}`
      : gameState.setupCardName;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sticky Header */}
      <div className={`${stickyHeaderBg} backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm border flex justify-between items-center transition-all duration-300 sticky top-0 z-30`}>
        <div className="flex flex-col">
           <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-gray-400' : 'text-[#78350f]'}`}>Active Game</span>
           <div className={`flex flex-wrap items-center gap-x-2 font-bold text-sm md:text-base leading-tight ${isDark ? 'text-green-400' : 'text-[#7f1d1d]'}`}>
              <span className={isDark ? 'text-blue-300' : 'text-[#451a03]'}>{displaySetupName}</span>
              {gameState.selectedStoryCard && (
                <>
                  <span className={`${isDark ? 'text-gray-600' : 'text-[#a8a29e]'} hidden sm:inline`}>•</span>
                  <span className={`${isDark ? 'text-amber-200' : 'text-[#b45309]'} block sm:inline`}>{gameState.selectedStoryCard}</span>
                </>
              )}
           </div>
           {gameState.gameMode !== 'multiplayer' && (
              <span className={`text-[10px] uppercase font-bold mt-1 ${isDark ? 'text-purple-400' : 'text-purple-800'}`}>
                 {gameState.setupCardId === 'FlyingSolo' ? 'Solo (Expanded)' : 'Solo (Classic)'}
              </span>
           )}
        </div>
        <button 
          type="button"
          onClick={() => showConfirmReset ? performReset() : (setShowConfirmReset(true), setTimeout(() => setShowConfirmReset(false), 3000))}
          className={`
            text-xs font-bold underline focus:outline-none focus:ring-2 rounded px-2 py-1 transition-colors duration-200 ml-4 shrink-0
            ${showConfirmReset ? 'bg-red-600 text-white hover:bg-red-700 ring-red-500 shadow-md no-underline' : (isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-[#7f1d1d] hover:text-[#991b1b] hover:bg-red-50 focus:ring-[#d4af37]')}
          `}
        >
          {showConfirmReset ? "Confirm Restart?" : "Restart"}
        </button>
      </div>

      <ProgressBar current={currentStepIndex + 1} total={flow.length} />

      {isFinal ? (
        <div className={`${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#faf8ef] border-[#d6cbb0]'} rounded-xl shadow-xl p-8 text-center border-t-8 ${isDark ? 'border-t-green-800' : 'border-t-[#7f1d1d]'} animate-fade-in-up border-x border-b transition-colors duration-300`}>
          <div className="text-6xl mb-4">🚀</div>
          <h2 className={`text-3xl font-bold font-western mb-4 ${isDark ? 'text-gray-100' : 'text-[#292524]'}`}>You are ready to fly!</h2>
          <p className={`mb-8 text-lg ${isDark ? 'text-gray-300' : 'text-[#57534e]'}`}>Setup is complete. Good luck, Captain.</p>
          
          <FinalSummary gameState={gameState} />

          <div className="flex justify-center gap-4">
            <Button onClick={handlePrev} variant="secondary">Back</Button>
            <Button onClick={performReset}>Start New Game Setup</Button>
          </div>
        </div>
      ) : (
        <StepContent 
          step={currentStep} 
          stepIndex={currentStepIndex + 1}
          gameState={gameState}
          setGameState={setGameState}
          onNext={handleNext} 
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default SetupWizard;
