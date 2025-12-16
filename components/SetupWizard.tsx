import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useSetupFlow } from '../hooks/useSetupFlow';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { FinalSummary } from './FinalSummary';
import { WizardHeader } from './WizardHeader';

const WIZARD_STEP_STORAGE_KEY = 'firefly_wizardStep_v3';

const SetupWizard = (): React.ReactElement | null => {
  const { gameState, isStateInitialized: isGameStateInitialized, resetGameState } = useGameState();
  const { flow } = useSetupFlow();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWizardInitialized, setIsWizardInitialized] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const setupStepCount = useMemo(() => flow.filter(s => s.type === 'setup').length, [flow]);
  
  // Load wizard-specific state (step index) from local storage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem(WIZARD_STEP_STORAGE_KEY);
    if (savedStep) {
      try {
        const parsedStep: number = JSON.parse(savedStep);
        setCurrentStepIndex(parsedStep);
      } catch (e) {
        console.warn("Wizard step reset due to error", e);
        localStorage.removeItem(WIZARD_STEP_STORAGE_KEY);
      }
    }
    setIsWizardInitialized(true);
  }, []);

  // Save wizard-specific state (step index) to local storage
  useEffect(() => {
    if (!isWizardInitialized) return;
    localStorage.setItem(WIZARD_STEP_STORAGE_KEY, JSON.stringify(currentStepIndex));
  }, [currentStepIndex, isWizardInitialized]);
  
  // When the flow changes (e.g., options selected), ensure the current index is still valid.
  useEffect(() => {
    if (currentStepIndex >= flow.length && flow.length > 0) {
      setCurrentStepIndex(flow.length - 1);
    }
  }, [flow, currentStepIndex]);

  const handleNext = useCallback(() => {
    setCurrentStepIndex(prev => {
        const nextIndex = Math.min(prev + 1, flow.length - 1);
        if (nextIndex !== prev) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return nextIndex;
    });
  }, [flow.length]);

  const handlePrev = useCallback(() => {
    setCurrentStepIndex(prev => {
        const nextIndex = Math.max(prev - 1, 0);
        if (nextIndex !== prev) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return nextIndex;
    });
  }, []);

  const performReset = useCallback(() => {
    resetGameState();
    localStorage.removeItem(WIZARD_STEP_STORAGE_KEY);
    setCurrentStepIndex(0);
    setResetKey(prev => prev + 1);
    window.scrollTo(0, 0);
  }, [resetGameState]);

  if (!isGameStateInitialized || !isWizardInitialized || flow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-900 mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-700 font-western tracking-wider animate-pulse">Initializing Cortex...</h2>
      </div>
    );
  }

  const currentStep = flow[currentStepIndex];
  if (!currentStep) {
    // This can happen briefly while flow recalculates, especially on reset.
    return null;
  }
  
  const isFinal = currentStep.type === 'final';

  // Don't show step numbers for the initial setup screens
  const displayStepIndex = currentStep.type === 'setup' ? 0 : currentStepIndex - setupStepCount + 1;

  return (
    <div className="max-w-2xl mx-auto" key={resetKey}>
      <WizardHeader gameState={gameState} onReset={performReset} flow={flow} currentStepIndex={currentStepIndex} />

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
          stepIndex={displayStepIndex}
          onNext={handleNext} 
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default SetupWizard;