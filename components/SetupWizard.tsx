
import React, { useState, useEffect } from 'react';
import { GameState, Step } from '../types';
import { SETUP_CARDS, SETUP_CONTENT, STORY_CARDS, EXPANSIONS_METADATA } from '../constants';
import { getDefaultGameState } from '../utils';
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

// Helper to rebuild flow from a game state
const calculateFlow = (state: GameState): Step[] => {
  const newFlow: Step[] = [];
  const activeStory = STORY_CARDS.find(c => c.title === state.selectedStoryCard);

  // Logic for Flying Solo Mode (Expanded Solo)
  if (state.setupCardId === 'FlyingSolo') {
    const flyingSoloDef = SETUP_CARDS.find(s => s.id === 'FlyingSolo');
    
    // Determine the base structure: Use Secondary Card if available, else Default Flying Solo
    const baseDef = state.secondarySetupId 
        ? SETUP_CARDS.find(s => s.id === state.secondarySetupId) 
        : flyingSoloDef;

    if (baseDef) {
        let noSureThingsInserted = false;
        
        baseDef.steps.forEach(setupStep => {
            const stepId = setupStep.id;
            
            // INSERTION: D_NO_SURE_THINGS
            // Should occur after Supplies (C5) and before Jobs (C6) or Prime (C_PRIME).
            if (!noSureThingsInserted && (stepId === 'C6' || stepId === 'C_PRIME')) {
                 const nstContent = SETUP_CONTENT['D_NO_SURE_THINGS'];
                 if (nstContent) {
                    newFlow.push({
                        type: 'dynamic',
                        id: 'D_NO_SURE_THINGS',
                        data: nstContent
                    });
                    noSureThingsInserted = true;
                 }
            }

            const content = SETUP_CONTENT[stepId];
            if (content) {
                // Merge Overrides
                const mergedOverrides = { ...setupStep.overrides };
                
                // Force Flying Solo Overrides on specific core steps
                if (stepId === 'C1') {
                    mergedOverrides.flyingSoloNavMode = true;
                }

                newFlow.push({
                    type: content.type,
                    id: content.id || content.elementId || stepId,
                    data: content,
                    overrides: mergedOverrides
                });
            }
        });

        // Fallback: If No Sure Things wasn't inserted
        if (!noSureThingsInserted) {
             const nstContent = SETUP_CONTENT['D_NO_SURE_THINGS'];
             if (nstContent) {
                newFlow.push({ type: 'dynamic', id: 'D_NO_SURE_THINGS', data: nstContent });
             }
        }

        // APPEND: Game Length Tokens (Always last in Flying Solo)
        // We add it even if disableSoloTimer is true, so we can show a specific "No Timer Used" message
        const gltContent = SETUP_CONTENT['D_GAME_LENGTH_TOKENS'];
        if (gltContent) {
            newFlow.push({
                type: 'dynamic',
                id: 'D_GAME_LENGTH_TOKENS',
                data: gltContent
            });
        }
    }
  } else {
      // Standard Flow for Ordinary Setup Cards (Multiplayer & Classic Solo)
      const setupDef = SETUP_CARDS.find(s => s.id === state.setupCardId) || SETUP_CARDS[0];
      setupDef.steps.forEach(setupStep => {
        const content = SETUP_CONTENT[setupStep.id];
        if (content) {
          newFlow.push({
            type: content.type,
            id: content.id || content.elementId || setupStep.id,
            data: content,
            overrides: setupStep.overrides
          });
        }
      });

      // Inject Game Length Tokens for Classic Solo (Awful Lonely)
      // Checks if the active story card requires a solo game timer
      if (state.gameMode === 'solo' && activeStory?.setupConfig?.soloGameTimer) {
           const gltContent = SETUP_CONTENT['D_GAME_LENGTH_TOKENS'];
           if (gltContent) {
               newFlow.push({
                   type: 'dynamic',
                   id: 'D_GAME_LENGTH_TOKENS',
                   data: gltContent
               });
           }
      }
  }

  newFlow.push({ type: 'final', id: 'final' });
  return newFlow;
};

const SetupWizard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getDefaultGameState());
  const [flow, setFlow] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 
  const [isStarted, setIsStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [initialFormStep, setInitialFormStep] = useState<number>(1);
  
  // UI State for Restart Confirmation
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Build the flow based on selection
  const buildFlow = () => {
    const newFlow = calculateFlow(gameState);
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
          // Check for legacy state format without edition
          if (!parsed.gameState.gameEdition) {
             throw new Error("Legacy state detected");
          }
          setGameState(parsed.gameState);
          
          if (parsed.isStarted) {
            const newFlow = calculateFlow(parsed.gameState);
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

    const dataToSave: PersistedState = {
      gameState,
      currentStepIndex,
      isStarted
    };
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
      setInitialFormStep(2); // Go back to Setup Card selection (Last step of init)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const performReset = () => {
    const defaultState = getDefaultGameState();
    localStorage.removeItem(STORAGE_KEY);
    setGameState(defaultState);
    setFlow([]);
    setCurrentStepIndex(0);
    setIsStarted(false);
    setShowConfirmReset(false);
    setInitialFormStep(1);
    setResetKey(prev => prev + 1);
    window.scrollTo(0, 0);
  };

  const handleResetClick = () => {
    if (showConfirmReset) {
      performReset();
    } else {
      setShowConfirmReset(true);
      setTimeout(() => setShowConfirmReset(false), 3000);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-900 mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-700 font-western tracking-wider animate-pulse">Initializing Cortex...</h2>
        <p className="text-gray-600 mt-2 text-sm italic">Accessing secure alliance servers</p>
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

  // Theme Classes
  const stickyHeaderBg = isDark ? 'bg-zinc-900/90 border-zinc-800' : 'bg-[#faf8ef]/95 border-[#d6cbb0]';
  const labelText = isDark ? 'text-gray-400' : 'text-[#78350f]';
  const mainText = isDark ? 'text-green-400' : 'text-[#7f1d1d]';
  const subText = isDark ? 'text-blue-300' : 'text-[#451a03]';
  const separatorColor = isDark ? 'text-gray-600' : 'text-[#a8a29e]';
  const storyColor = isDark ? 'text-amber-200' : 'text-[#b45309]';
  const HZ = isDark ? 'text-purple-400' : 'text-purple-800';

  const resetBtnDefault = isDark ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20' : 'text-[#7f1d1d] hover:text-[#991b1b] hover:bg-red-50';
  const resetBtnConfirm = 'bg-red-600 text-white hover:bg-red-700 ring-red-500 shadow-md';

  const finalCardBg = isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-[#faf8ef] border-[#d6cbb0]';
  const finalBorderTop = isDark ? 'border-t-green-800' : 'border-t-[#7f1d1d]';
  const finalTitle = isDark ? 'text-gray-100' : 'text-[#292524]';
  const finalSub = isDark ? 'text-gray-300' : 'text-[#57534e]';

  // Determine Display Name for Header
  let displaySetupName = gameState.setupCardName;
  if (gameState.setupCardId === 'FlyingSolo' && gameState.secondarySetupId) {
      const secondary = SETUP_CARDS.find(s => s.id === gameState.secondarySetupId);
      if (secondary) displaySetupName = `Flying Solo + ${secondary.label}`;
  }

  // Render Summary Logic
  const renderSummary = () => {
    const activeStory = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);
    const activeExpansions = EXPANSIONS_METADATA.filter(e => gameState.expansions[e.id]).map(e => e.label);
    
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
            const details = [];
            if (extraTokens) details.push('Extra Tokens');
            if (randomized) details.push('Randomized');
            
            timerSummary = `Unpredictable${details.length > 0 ? ` (${details.join(', ')})` : ''}`;
        }
    } else if (activeStory?.setupConfig?.disableSoloTimer) {
        timerSummary = "Disabled (Story Override)";
    }

    const summaryBg = isDark ? 'bg-black/20' : 'bg-amber-50/50';
    const summaryBorder = isDark ? 'border-white/10' : 'border-amber-900/10';
    const summaryLabelClass = `text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-amber-800/60'} mb-1`;
    const summaryValueClass = `font-bold text-sm ${isDark ? 'text-gray-200' : 'text-gray-900'}`;

    return (
        <div className={`text-left max-w-lg mx-auto mb-8 p-6 rounded-lg border ${summaryBg} ${summaryBorder}`}>
            <h3 className={`font-western text-xl border-b pb-2 mb-4 ${isDark ? 'text-gray-400 border-white/10' : 'text-amber-900 border-amber-900/20'}`}>
                Flight Manifest
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
                 <div>
                    <div className={summaryLabelClass}>Setup Scenario</div>
                    <div className={summaryValueClass}>{displaySetupName}</div>
                 </div>

                 <div>
                    <div className={summaryLabelClass}>Mission</div>
                    <div className={summaryValueClass}>{gameState.selectedStoryCard}</div>
                 </div>

                 {gameState.selectedGoal && (
                     <div className="sm:col-span-2">
                        <div className={summaryLabelClass}>Active Goal</div>
                        <div className={`${summaryValueClass} text-amber-700 dark:text-amber-400`}>{gameState.selectedGoal}</div>
                     </div>
                 )}

                 {/* Challenges */}
                 {Object.values(gameState.challengeOptions).some(Boolean) && (
                     <div className="sm:col-span-2">
                        <div className={summaryLabelClass}>Directives & Challenges</div>
                        <ul className={`list-disc ml-4 text-xs ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                            {activeStory?.challengeOptions?.filter(o => gameState.challengeOptions[o.id]).map(o => (
                                <li key={o.id}>{o.label}</li>
                            ))}
                        </ul>
                     </div>
                 )}

                 <div>
                    <div className={summaryLabelClass}>Captain(s)</div>
                    <div className={summaryValueClass}>{gameState.playerCount}</div>
                 </div>

                 {(isSoloTimerActive || timerSummary) && (
                     <div>
                        <div className={summaryLabelClass}>Solo Timer</div>
                        <div className={summaryValueClass}>{timerSummary}</div>
                     </div>
                 )}
                 
                 <div className="sm:col-span-2">
                    <div className={summaryLabelClass}>Active Expansions</div>
                    <div className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                        {activeExpansions.join(', ')}
                    </div>
                 </div>
            </div>
        </div>
    );
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sticky Header with Setup Details */}
      <div className={`${stickyHeaderBg} backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm border flex justify-between items-center transition-all duration-300 sticky top-0 z-30`}>
        <div className="flex flex-col">
           <span className={`text-[10px] font-bold uppercase tracking-widest ${labelText}`}>Active Game</span>
           <div className={`flex flex-wrap items-center gap-x-2 font-bold text-sm md:text-base leading-tight ${mainText}`}>
              <span className={subText}>{displaySetupName}</span>
              {gameState.selectedStoryCard && (
                <>
                  <span className={`${separatorColor} hidden sm:inline`}>•</span>
                  <span className={`${storyColor} block sm:inline`}>{gameState.selectedStoryCard}</span>
                </>
              )}
           </div>
           {/* Mode indicator */}
           {gameState.gameMode !== 'multiplayer' && (
              <span className={`text-[10px] uppercase font-bold mt-1 ${HZ}`}>
                 {gameState.setupCardId === 'FlyingSolo' ? 'Solo (Expanded)' : 'Solo (Classic)'}
              </span>
           )}
        </div>
        <button 
          type="button"
          onClick={handleResetClick}
          className={`
            text-xs font-bold underline focus:outline-none focus:ring-2 rounded px-2 py-1 transition-colors duration-200 ml-4 shrink-0
            ${showConfirmReset ? `${resetBtnConfirm} no-underline` : `${resetBtnDefault} focus:ring-[#d4af37]`}
          `}
        >
          {showConfirmReset ? "Confirm Restart?" : "Restart"}
        </button>
      </div>

      <ProgressBar current={currentStepIndex + 1} total={flow.length} />

      {isFinal ? (
        <div className={`${finalCardBg} rounded-xl shadow-xl p-8 text-center border-t-8 ${finalBorderTop} animate-fade-in-up border-x border-b transition-colors duration-300`}>
          <div className="text-6xl mb-4">🚀</div>
          <h2 className={`text-3xl font-bold font-western mb-4 ${finalTitle}`}>You are ready to fly!</h2>
          <p className={`mb-8 text-lg ${finalSub}`}>Setup is complete. Good luck, Captain.</p>
          
          {renderSummary()}

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
