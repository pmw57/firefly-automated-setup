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
import { getSetupCardSelectionInfo, isSetupDetermined } from '../utils/ui';
import { calculateSetupFlow } from '../utils/flow';
import { STEP_IDS } from '../data/ids';
import { getActiveStoryCard } from '../utils/selectors/story';

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
  const [lastNavDirection, setLastNavDirection] = useState<'next' | 'prev'>('next');
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const [touchEndY, setTouchEndY] = useState<number | null>(null);


  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const unacknowledgedOverrides = useMemo(() => {
      return gameState.overriddenStepIds.filter(
        id => !gameState.acknowledgedOverrides.includes(id) && !gameState.visitedStepOverrides.includes(id)
      );
  }, [gameState.overriddenStepIds, gameState.acknowledgedOverrides, gameState.visitedStepOverrides]);
  
  const handleNavigation = useCallback((direction: 'next' | 'prev' | number) => {
    setIsNavigating(true);
    if (typeof direction === 'string') {
      setLastNavDirection(direction);
    }
    setTimeout(() => {
        setCurrentStepIndex(prev => {
            const nextIndex = typeof direction === 'number' 
              ? direction 
              : direction === 'next'
                ? Math.min(prev + 1, flow.length - 1)
                : Math.max(prev - 1, 0);
            
            // If navigating forward into the Mission Dossier step, always reset to its first sub-step.
            const isMovingForward = nextIndex > prev;
            const targetStepId = flow[nextIndex]?.id;
            if (isMovingForward && targetStepId === STEP_IDS.C4) {
              dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: 1 });
            }

            if (nextIndex !== prev) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            return nextIndex;
        });
        setIsNavigating(false);
    }, 50);
  }, [flow, setCurrentStepIndex, dispatch]);

  // Effect to handle setup mode changes and maintain the current conceptual step
  useEffect(() => {
    if (prevSetupModeRef.current !== gameState.setupMode) {
      // The mode has changed. Find our place in the new flow.
      const oldState = { ...gameState, setupMode: prevSetupModeRef.current };
      const oldFlow = calculateSetupFlow(oldState);
      const oldStepId = oldFlow[currentStepIndex]?.id;
      
      const wasOnAdvancedRules = oldState.missionDossierSubStep === 2;
      const advancedRulesBecameInvalid = gameState.setupMode === 'quick';

      if (oldStepId === STEP_IDS.C4 && wasOnAdvancedRules && advancedRulesBecameInvalid) {
        // The "Advanced Rules" sub-step was removed. Use last travel direction to determine new position.
        if (lastNavDirection === 'next') {
          // User was moving forward, so navigate to the next MAIN step.
          handleNavigation('next');
        } else { // 'prev'
          // User was moving backward, so navigate to the previous SUB-step (Goal page 1).
          dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: 1 });
        }
        prevSetupModeRef.current = gameState.setupMode;
        return; // Exit early as navigation is handled
      }

      if (oldStepId) {
        const newIndex = flow.findIndex(step => step.id === oldStepId);
        if (newIndex !== -1) {
          // Step still exists, just update index if it moved
          if (newIndex !== currentStepIndex) {
            setCurrentStepIndex(newIndex);
          }
        } else {
          // Step was removed. Use last travel direction to determine new position.
          const prevStepIdInOldFlow = oldFlow[currentStepIndex - 1]?.id;
          if (prevStepIdInOldFlow) {
            const newIndexOfPrevStep = flow.findIndex(step => step.id === prevStepIdInOldFlow);
            if (newIndexOfPrevStep !== -1) {
              if (lastNavDirection === 'next') {
                // Land on the step that conceptually replaces the removed one.
                const targetIndex = newIndexOfPrevStep + 1;
                setCurrentStepIndex(Math.min(targetIndex, flow.length - 1));
              } else { // 'prev'
                // Land on the previous step.
                setCurrentStepIndex(newIndexOfPrevStep);
              }
            } else {
              // Fallback if the previous step also disappeared somehow.
              setCurrentStepIndex(0);
            }
          }
        }
      }
      prevSetupModeRef.current = gameState.setupMode;
    }
  }, [gameState.setupMode, flow, currentStepIndex, setCurrentStepIndex, gameState, lastNavDirection, handleNavigation, dispatch]);

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


  const handleNext = useCallback(() => {
    const currentStep = flow[currentStepIndex];
    if (!currentStep) return;

    const isC4 = currentStep.id === STEP_IDS.C4;
    const isStorySelectionSubStep = gameState.missionDossierSubStep === 1;
    const hasAdvancedRules = gameState.expansions.tenth && gameState.setupMode === 'detailed';

    // If we are on the story selection part of C4 and there are unacknowledged overrides, show the modal.
    if (isC4 && isStorySelectionSubStep && unacknowledgedOverrides.length > 0) {
      const affectedSteps = flow.filter(step => unacknowledgedOverrides.includes(step.id));
      const firstAffectedIndex = Math.min(...affectedSteps.map(step => flow.indexOf(step)));
      const stepLabels = affectedSteps.map(step => step.data?.title.replace(/^\d+\.\s+/, '') || step.id);
      setOverrideModalState({ firstAffectedIndex, stepLabels });
    } 
    // If we are on story selection, have no overrides, and advanced rules are available, move to that sub-step.
    else if (isC4 && isStorySelectionSubStep && hasAdvancedRules) {
      dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: 2 });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } 
    // In all other cases (leaving Advanced Rules, or any other step), navigate to the next main step.
    else {
      handleNavigation('next');
    }
  }, [
    handleNavigation, 
    currentStepIndex, 
    flow, 
    unacknowledgedOverrides, 
    gameState.missionDossierSubStep, 
    gameState.expansions.tenth, 
    gameState.setupMode, 
    dispatch
  ]);

  const handlePrev = useCallback(() => {
    const toStep = flow[currentStepIndex - 1];

    // When navigating back to the Mission Dossier step (which contains Story & Advanced Rules)...
    if (toStep?.id === STEP_IDS.C4) {
      const advancedRulesAvailable = gameState.expansions.tenth && gameState.setupMode === 'detailed';
      // ...if advanced rules are available, go to the "Advanced Rules" sub-step (part 2).
      // This creates the desired sequential back-navigation: Supplies -> Goal Pt 2 -> Goal Pt 1.
      if (advancedRulesAvailable) {
        dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: 2 });
      } else {
        dispatch({ type: ActionType.SET_MISSION_DOSSIER_SUBSTEP, payload: 1 });
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
  
  const handleModalContinue = useCallback(() => {
    dispatch({ type: ActionType.ACKNOWLEDGE_OVERRIDES, payload: gameState.overriddenStepIds });
    setOverrideModalState(null);
    handleNext();
  }, [dispatch, gameState.overriddenStepIds, handleNext]);
  
  const handleModalJump = useCallback(() => {
    if (overrideModalState) {
      dispatch({ type: ActionType.ACKNOWLEDGE_OVERRIDES, payload: gameState.overriddenStepIds });
      handleJump(overrideModalState.firstAffectedIndex);
      setOverrideModalState(null);
    }
  }, [dispatch, gameState.overriddenStepIds, handleJump, overrideModalState]);

  const currentStep = flow[currentStepIndex];

  const isNextDisabled = useMemo(() => {
      if (!currentStep || isNavigating) return true;

      if (currentStep.type === 'final' || currentStepIndex >= flow.length - 1) {
          return true;
      }

      if (currentStep.id === STEP_IDS.SETUP_CARD_SELECTION) {
          return getSetupCardSelectionInfo(gameState).isNextDisabled;
      }

      if (currentStep.id === STEP_IDS.C4) {
          if (gameState.missionDossierSubStep === 1) {
              const activeStoryCard = getActiveStoryCard(gameState);
              if (!activeStoryCard) {
                  return true;
              }
          }
      }
      
      return false;
  }, [currentStep, currentStepIndex, flow.length, gameState, isNavigating]);

  const isPrevDisabled = useMemo(() => {
      return currentStepIndex <= 0 || isNavigating;
  }, [currentStepIndex, isNavigating]);


  if (!isStateInitialized || !isWizardInitialized || flow.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-900 mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-700 font-western tracking-wider animate-pulse">Initializing Cortex...</h2>
      </div>
    );
  }

  if (!currentStep) return null;
  
  const isFinal = currentStep.type === 'final';
  
  const footerBg = isDark ? 'bg-zinc-950/90' : 'bg-[#faf8ef]/95';
  const footerBorder = isDark ? 'border-zinc-800' : 'border-firefly-parchment-border';
  
  // --- Swipe Navigation Logic ---
  const MIN_SWIPE_DISTANCE = 50;
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchEndY(null);
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX || !touchStartY || !touchEndY) return;

    const distanceX = touchStartX - touchEndX;
    const distanceY = touchStartY - touchEndY;

    // Only trigger swipe if horizontal movement is greater than vertical to avoid conflicting with scrolling
    if (Math.abs(distanceX) < Math.abs(distanceY)) {
        setTouchStartX(null);
        setTouchStartY(null);
        setTouchEndX(null);
        setTouchEndY(null);
        return;
    }

    const isLeftSwipe = distanceX > MIN_SWIPE_DISTANCE;
    const isRightSwipe = distanceX < -MIN_SWIPE_DISTANCE;

    if (isLeftSwipe && !isNextDisabled) {
        handleNext();
    } else if (isRightSwipe && !isPrevDisabled) {
        handlePrev();
    }

    setTouchStartX(null);
    setTouchStartY(null);
    setTouchEndX(null);
    setTouchEndY(null);
  };
  // --- End Swipe Navigation ---

  return (
    <div 
      className="max-w-2xl mx-auto pb-24 sm:pb-0"
      key={resetKey}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
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

          {/* Desktop Nav */}
          <div className="hidden sm:flex justify-center gap-4">
            <Button onClick={handlePrev} variant="secondary">← Back</Button>
            <Button onClick={performReset}>Start New Game Setup</Button>
          </div>
          
           {/* Sticky Mobile Nav */}
           <div className={cls(
            "fixed bottom-0 left-0 right-0 p-4 border-t z-[60] flex sm:hidden justify-between gap-4 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-colors duration-300",
            footerBg, footerBorder
          )}>
            <Button 
              onClick={handlePrev} 
              variant="secondary"
              className="flex-1 text-xs uppercase tracking-wider !py-3"
            >
              ← Back
            </Button>
            <Button 
              onClick={performReset}
              className="flex-[2] text-xs uppercase tracking-[0.1em] !py-3"
            >
              Start New Setup
            </Button>
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