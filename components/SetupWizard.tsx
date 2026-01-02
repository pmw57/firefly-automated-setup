

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useGameState } from '../hooks/useGameState';
import { useSetupFlow } from '../hooks/useSetupFlow';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { FinalSummary } from './FinalSummary';
import { WizardHeader } from './WizardHeader';
import { OverrideModal } from './OverrideModal';
import { detectOverrides } from '../utils/overrides';
import { getActiveStoryCard } from '../utils/selectors/story';
import { ActionType } from '../state/actions';
import { STEP_IDS } from '../data/ids';
import { cls } from '../utils/style';
import { isSetupDetermined } from '../utils/ui';

interface SetupWizardProps {
  isDevMode: boolean;
}

const SetupWizard = ({ isDevMode }: SetupWizardProps): React.ReactElement | null => {
  const { 
    state: gameState, 
    dispatch,
    isStateInitialized, 
    resetGameState,
    currentStepIndex,
    setCurrentStepIndex,
    isWizardInitialized
  } = useGameState();
  const { flow } = useSetupFlow();

  const [resetKey, setResetKey] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [overrideModalState, setOverrideModalState] = useState<{ firstAffectedIndex: number; stepLabels: string[] } | null>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // Calculate overrides that have been detected but not yet shown to the user in the modal.
  const unacknowledgedOverrides = useMemo(() => {
      return gameState.overriddenStepIds.filter(id => !gameState.acknowledgedOverrides.includes(id));
  }, [gameState.overriddenStepIds, gameState.acknowledgedOverrides]);

  // Effect to detect and set story overrides in global state
  useEffect(() => {
    const storyCard = getActiveStoryCard(gameState);
    if (storyCard) {
      const storyStepIndex = flow.findIndex(s => s.id === STEP_IDS.C4 || s.id === STEP_IDS.D_FIRST_GOAL);
      const overriddenIds = detectOverrides(storyCard, flow, storyStepIndex);
      if (overriddenIds.length > 0 && overriddenIds.join(',') !== gameState.overriddenStepIds.join(',')) {
        dispatch({ type: ActionType.SET_STORY_OVERRIDES, payload: overriddenIds });
      }
    }
  }, [gameState.selectedStoryCardIndex, flow, dispatch, gameState.overriddenStepIds, gameState]);


  useEffect(() => {
    if (currentStepIndex >= flow.length && flow.length > 0) {
      setCurrentStepIndex(flow.length - 1);
    }
  }, [flow, currentStepIndex, setCurrentStepIndex]);

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
  }, [flow.length, setCurrentStepIndex]);

  const handleNext = useCallback(() => {
    const isStoryStep = flow[currentStepIndex]?.id === STEP_IDS.C4 || flow[currentStepIndex]?.id === STEP_IDS.D_FIRST_GOAL;
    
    if (isStoryStep && unacknowledgedOverrides.length > 0) {
      const affectedSteps = flow.filter(step => unacknowledgedOverrides.includes(step.id));
      const firstAffectedIndex = Math.min(...affectedSteps.map(step => flow.indexOf(step)));
      const stepLabels = affectedSteps.map(step => step.data?.title.replace(/^\d+\.\s+/, '') || step.id);

      setOverrideModalState({ firstAffectedIndex, stepLabels });
    } else {
      handleNavigation('next');
    }
  }, [handleNavigation, currentStepIndex, flow, unacknowledgedOverrides]);

  const handlePrev = useCallback(() => handleNavigation('prev'), [handleNavigation]);
  const handleJump = useCallback((index: number) => handleNavigation(index), [handleNavigation]);

  const performReset = useCallback(() => {
    resetGameState();
    setResetKey(prev => prev + 1);
    window.scrollTo(0, 0);
  }, [resetGameState]);
  
  const handleModalContinue = () => {
    dispatch({ type: ActionType.ACKNOWLEDGE_OVERRIDES, payload: gameState.overriddenStepIds });
    setOverrideModalState(null);
    handleNavigation('next');
  };
  
  const handleModalJump = () => {
    if (overrideModalState) {
      dispatch({ type: ActionType.ACKNOWLEDGE_OVERRIDES, payload: gameState.overriddenStepIds });
      handleJump(overrideModalState.firstAffectedIndex);
      setOverrideModalState(null);
    }
  };


  if (!isStateInitialized || !isWizardInitialized || flow.length === 0) {
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
        overriddenStepIds={gameState.overriddenStepIds}
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
          isDevMode={isDevMode}
        />
      )}
      
      {overrideModalState && createPortal(
        <OverrideModal
          affectedStepLabels={overrideModalState.stepLabels}
          onContinue={handleModalContinue}
          onJump={handleModalJump}
        />,
        document.body
      )}
    </div>
  );
};

export default SetupWizard;