
import React, { useState, useEffect } from 'react';
import { GameState, Step } from '../types';
import { getDefaultGameState, calculateSetupFlow } from '../utils';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { FinalSummary } from './FinalSummary';
import { WizardHeader } from './WizardHeader';

const STORAGE_KEY = 'firefly_setup_v2';

interface PersistedState {
  gameState: GameState;
  currentStepIndex: number;
}

const SetupWizard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getDefaultGameState());
  const [flow, setFlow] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 
  const [isInitialized, setIsInitialized] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Re-calculate the flow whenever gameState changes
  useEffect(() => {
      if (!isInitialized) return;
      const newFlow = calculateSetupFlow(gameState);
      setFlow(newFlow);
  }, [gameState, isInitialized]);
  
  // Load state from local storage on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed: PersistedState = JSON.parse(saved);
          if (!parsed.gameState.gameEdition) throw new Error("Legacy state");
          
          // Deep merge with default state to ensure new fields are present
          const defaults = getDefaultGameState();
          const loadedState = parsed.gameState;
          
          const mergedState: GameState = {
              ...defaults,
              ...loadedState,
              timerConfig: { ...defaults.timerConfig, ...(loadedState.timerConfig || {}) },
              soloOptions: { ...defaults.soloOptions, ...(loadedState.soloOptions || {}) },
              optionalRules: { ...defaults.optionalRules, ...(loadedState.optionalRules || {}) },
              expansions: { ...defaults.expansions, ...(loadedState.expansions || {}) },
              challengeOptions: { ...defaults.challengeOptions, ...(loadedState.challengeOptions || {}) }
          };

          setGameState(mergedState);
          setCurrentStepIndex(parsed.currentStepIndex);

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
    const dataToSave: PersistedState = { gameState, currentStepIndex };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [gameState, currentStepIndex, isInitialized]);

  const handleNext = () => {
    setCurrentStepIndex(prev => {
        const nextIndex = Math.min(prev + 1, flow.length - 1);
        if (nextIndex !== prev) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentStepIndex(prev => {
        const nextIndex = Math.max(prev - 1, 0);
        if (nextIndex !== prev) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return nextIndex;
    });
  };

  const performReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    setGameState(getDefaultGameState());
    setCurrentStepIndex(0);
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

  const currentStep = flow[currentStepIndex];
  if (!currentStep) {
    // This can happen briefly while flow recalculates.
    // A more robust solution might show a loading spinner.
    return null;
  }
  
  const isFinal = currentStep.type === 'final';

  return (
    <div className="max-w-2xl mx-auto" key={resetKey}>
      <WizardHeader gameState={gameState} onReset={performReset} />

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