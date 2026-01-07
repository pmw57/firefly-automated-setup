import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { ActionType } from '../state/actions';
import { cls } from '../utils/style';
import { isSetupDetermined } from '../utils/ui';
import { calculateSetupFlow } from '../utils/flow';
import { STEP_IDS } from '../data/ids';

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
  const prevSetupModeRef = useRef(gameState.setupMode);

  const [resetKey, setResetKey] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const [overrideModalState, setOverrideModalState] = useState<{ firstAffectedIndex: number; stepLabels: string[] } | null>(null);

  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const unacknowledgedOverrides = useMemo(() => {
      return gameState.overriddenStepIds.filter(
        id => !gameState.acknowledgedOverrides.includes(id) && !gameState.visitedStepOverrides.includes(id)
      );
  }, [gameState.overriddenStepIds, gameState.acknowledgedOverrides, gameState.visitedStepOverrides]);

  // Effect to handle setup mode changes and maintain the current conceptual step
  useEffect(() => {
    if (prevSetupModeRef.current !== gameState.setupMode) {
      // The mode has changed. Find our place in the new flow.
      const oldState = { ...gameState, setupMode: prevSetupModeRef.current };
      const oldFlow = calculateSetupFlow(oldState);
      const oldStepId = oldFlow[currentStepIndex]?.id;

      if (oldStepId) {
        const newIndex = flow.findIndex(step => step.id === oldStepId);
        if (newIndex !== -1 && newIndex !== currentStepIndex) {
          setCurrentStepIndex(newIndex);
        }
      }
      prevSetupModeRef.current = gameState.setupMode;
    }
  }, [gameState.setupMode, flow, currentStepIndex, setCurrentStepIndex, gameState]);

  // Effect to detect and set story overrides in global state
  useEffect(() => {
    if (gameState.selectedStoryCardIndex !== null) {
      const overriddenIds = detectOverrides(gameState, flow, currentStepIndex);
      if (overriddenIds.length > 0 && overriddenIds.join(',') !== gameState.overriddenStepIds.join(',')) {
        dispatch({ type: ActionType.SET_STORY_OVERRIDES, payload: overriddenIds });
      }
    }
  }, [gameState.selectedStoryCardIndex, flow, dispatch, gameState.overriddenStepIds, gameState, currentStepIndex]);


  // Effect to mark overridden steps as "visited" when the user navigates to them.
  // This is used to clear the warning indicator on the progress bar.
  useEffect(() => {
    const currentStepId = flow[currentStepIndex]?.id;
    if (
      currentStepId &&
      gameState.overriddenStepIds.includes(currentStepId) &&
      !gameState.visitedStepOverrides.includes(currentStepId)
    ) {
      dispatch({ type: ActionType.VISIT_OVERRIDDEN_STEP, payload: currentStepId });
    }
  }, [
    currentStepIndex,
    flow,
    gameState.overriddenStepIds,
    gameState.visitedStepOverrides,
    dispatch,
  ]);

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
    const isStoryStep = flow[currentStepIndex]?.data?.title === '4. Goal of the Game';
    
    if (isStoryStep && unacknowledgedOverrides.length > 0) {
      const affectedSteps = flow.filter(step => unacknowledgedOverrides.includes(step.id));
      const firstAffectedIndex = Math.min(...affectedSteps.map(step => flow.indexOf(step)));
      const stepLabels = affectedSteps.map(step => step.data?.title.replace(/^\d+\.\s+/, '') || step.id);

      setOverrideModalState({ firstAffectedIndex, stepLabels });
    } else {
      handleNavigation('next');
    }
  }, [handleNavigation, currentStepIndex, flow, unacknowledgedOverrides]);

  const handlePrev = useCallback(() => {
    const fromStep = flow[currentStepIndex];
    const toStep = flow[currentStepIndex - 1];

    // When navigating back from Starting Supplies to the Mission Dossier...
    if (fromStep?.id === STEP_IDS.C5 && toStep?.id === STEP_IDS.C4) {
      const advancedRulesAvailable = gameState.expansions.tenth && gameState.setupMode === 'detailed';
      // ...if advanced rules are available, ensure we land on that sub-step.
      if (advancedRulesAvailable) {
        dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: 2 });
      }
    }
    
    handleNavigation('prev');
  }, [handleNavigation, currentStepIndex, flow, gameState.expansions.tenth, gameState.setupMode, dispatch]);
  
  const handleJump = useCallback((index: number) => {
    // If jumping to the Mission Dossier step, always reset its internal state to the first page.
    // This prevents landing on the "Advanced Rules" sub-step when the user just wants to re-select a story.
    const targetStepId = flow[index]?.id;
    if (targetStepId === STEP_IDS.C4) {
      dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: 1 });
    }
    
    handleNavigation(index);
  }, [handleNavigation, flow, dispatch]);

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
        visitedStepOverrides={gameState.visitedStepOverrides}
      />

      {isFinal ? (
        <div className={cls(isDark ? 'bg-zinc-900/70 backdrop-blur-md border-zinc-800' : 'bg-[#faf8ef]/80 backdrop-blur-md border-[#d6cbb0]', "rounded-xl shadow-xl p-8 text-center border-t-8 animate-fade-in-up border-x border-b transition-colors duration-300", isDark ? 'border-t-green-800' : 'border-t-[#7f1d1d]')}>
          <div className="text-6xl mb-4">🚀</div>
          <h2 className={cls("text-3xl font-bold font-western mb-4", isDark ? 'text-gray-100' : 'text-[#292524]')}>You are ready to fly!</h2>
          <p className={cls("mb-8 text-lg", isDark ? 'text-gray-300' : 'text-[#57534e]')}>Setup is complete. Good luck, Captain.</p>
          
          {gameState.setupMode === 'detailed' && <FinalSummary gameState={gameState} />}

          <div className="flex justify-center gap-4">
            <Button onClick={handlePrev} variant="secondary">← Back</Button>
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