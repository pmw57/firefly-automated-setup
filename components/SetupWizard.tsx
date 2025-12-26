


import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useSetupFlow } from '../hooks/useSetupFlow';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { FinalSummary } from './FinalSummary';
import { WizardHeader } from './WizardHeader';
import { cls } from '../utils/style';
import { isSetupDetermined } from '../utils/ui';

const WIZARD_STEP_STORAGE_KEY = 'firefly_wizardStep_v3';

const SetupWizard = (): React.ReactElement | null => {
  const { state: gameState, isStateInitialized: isGameStateInitialized, resetGameState } = useGameState();
  const { flow } = useSetupFlow();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isWizardInitialized, setIsWizardInitialized] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);

  const { theme } = useTheme();
  const isDark = theme === 'dark';

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

  useEffect(() => {
    if (!isWizardInitialized) return;
    localStorage.setItem(WIZARD_STEP_STORAGE_KEY, JSON.stringify(currentStepIndex));
  }, [currentStepIndex, isWizardInitialized]);
  
  useEffect(() => {
    if (currentStepIndex >= flow.length && flow.length > 0) {
      setCurrentStepIndex(flow.length - 1);
    }
  }, [flow, currentStepIndex]);

  const setupDetermined = useMemo(() => isSetupDetermined(flow, currentStepIndex), [flow, currentStepIndex]);

  const handleNavigation = useCallback((direction: 'next' | 'prev' | number) => {
    setIsNavigating(true);
    setTimeout(() => {
        setCurrentStepIndex(prev => {
            const nextIndex = typeof direction === 'number' 
              ? direction 
              : direction === 'next'
                ? Math.min(prev + 1, flow.length - 1)
                : Math.max(prev - 1, 0);
            
            if (nextIndex !== prev) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return nextIndex;
        });
        setIsNavigating(false);
    }, 50);
  }, [flow.length]);

  const handleNext = useCallback(() => handleNavigation('next'), [handleNavigation]);
  const handlePrev = useCallback(() => handleNavigation('prev'), [handleNavigation]);
  const handleJump = useCallback((index: number) => handleNavigation(index), [handleNavigation]);

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
  if (!currentStep) return null;
  
  const isFinal = currentStep.type === 'final';

  return (
    <div 
      className="max-w-2xl mx-auto"
      key={resetKey}
    >
      <WizardHeader gameState={gameState} onReset={performReset} flow={flow} currentStepIndex={currentStepIndex} />

      <ProgressBar 
        flow={flow} 
        currentIndex={currentStepIndex} 
        onJump={handleJump} 
        setupDetermined={setupDetermined} 
      />

      {isFinal ? (
        <div className={cls(isDark ? 'bg-zinc-900/70 backdrop-blur-md border-zinc-800' : 'bg-[#faf8ef]/80 backdrop-blur-md border-[#d6cbb0]', "rounded-xl shadow-xl p-8 text-center border-t-8 animate-fade-in-up border-x border-b transition-colors duration-300", isDark ? 'border-t-green-800' : 'border-t-[#7f1d1d]')}>
          <div className="text-6xl mb-4">🚀</div>
          <h2 className={cls("text-3xl font-bold font-western mb-4", isDark ? 'text-gray-100' : 'text-[#292524]')}>You are ready to fly!</h2>
          <p className={cls("mb-8 text-lg", isDark ? 'text-gray-300' : 'text-[#57534e]')}>Setup is complete. Good luck, Captain.</p>
          
          <FinalSummary gameState={gameState} />

          <div className="flex justify-center gap-4">
            <Button onClick={handlePrev} variant="secondary">Back</Button>
            <Button onClick={performReset}>Start New Game Setup</Button>
          </div>
        </div>
      ) : (
        <StepContent 
          step={currentStep} 
          onNext={handleNext} 
          onPrev={handlePrev}
          isNavigating={isNavigating}
        />
      )}
    </div>
  );
};

export default SetupWizard;