import React, { useState, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { useGameState } from '../hooks/useGameState';
import { useGameDispatch } from '../hooks/useGameDispatch';
import { useWizardState } from '../hooks/useWizardState';
import { useSetupFlow } from '../hooks/useSetupFlow';
import { useTheme } from './ThemeContext';
import { cls } from '../utils/style';
import { STEP_IDS } from '../data/ids';
import { getSetupCardSelectionInfo, isSetupDetermined } from '../utils/selectors/ui';
import { getActiveStoryCard } from '../utils/selectors/story';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';
import { FinalSummary } from './FinalSummary';
import { WizardHeader } from './WizardHeader';
import { OverrideModal } from './OverrideModal';
import { useWizardNavigation } from '../hooks/useWizardNavigation';
import { useSwipeNavigation } from '../hooks/useSwipeNavigation';
import { useOverrideLogic } from '../hooks/useOverrideLogic';

interface SetupWizardProps {
  isDevMode: boolean;
}

const SetupWizard = ({ isDevMode }: SetupWizardProps): React.ReactElement | null => {
  const { state: gameState, isStateInitialized } = useGameState();
  const { resetGameState, setMissionDossierSubstep } = useGameDispatch();
  const { currentStepIndex, isWizardInitialized } = useWizardState();
  const { flow } = useSetupFlow();

  const [resetKey, setResetKey] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  // --- Custom Hooks for Logic Abstraction ---
  const { isNavigating, handleNavigation, handleJump } = useWizardNavigation({ flow });

  const {
    openOverrideModal,
    isOverrideModalOpen,
    affectedStepLabels,
    handleModalContinue,
    handleModalJump,
    hasUnacknowledgedPastOverrides,
  } = useOverrideLogic({
    flow,
    currentStepIndex,
    handleJump,
  });
  
  // --- Navigation Button State ---
  const currentStep = flow[currentStepIndex];
  const isNextDisabled = useMemo(() => {
      if (!currentStep || isNavigating) return true;
      if (currentStep.type === 'final' || currentStepIndex >= flow.length - 1) return true;
      
      // Special logic for River's Run
      if (currentStep.id === STEP_IDS.C3 && getActiveStoryCard(gameState)?.title === "River's Run 1v1") {
        // Disable ONLY IF the draft has been rolled AND the setup hasn't been confirmed yet.
        return !!gameState.draft.state && !gameState.riversRun_setupConfirmed;
      }
      
      if (currentStep.id === STEP_IDS.SETUP_CARD_SELECTION) {
          return getSetupCardSelectionInfo(gameState).isNextDisabled;
      }
      if (currentStep.id === STEP_IDS.C4) {
          if (gameState.missionDossierSubStep === 1 && !getActiveStoryCard(gameState)) {
              return true;
          }
      }
      return false;
  }, [currentStep, currentStepIndex, flow.length, gameState, isNavigating]);

  const isPrevDisabled = useMemo(() => {
      return currentStepIndex <= 0 || isNavigating;
  }, [currentStepIndex, isNavigating]);

  // --- Navigation Event Handlers ---
  const handleNext = useCallback(() => {
    handleNavigation('next');
  }, [handleNavigation]);

  const handlePrev = useCallback(() => {
    const toStep = flow[currentStepIndex - 1];
    if (toStep?.id === STEP_IDS.C4) {
      const advancedRulesAvailable = gameState.expansions.tenth && gameState.setupMode === 'detailed';
      if (advancedRulesAvailable) {
        setMissionDossierSubstep(2);
      } else {
        setMissionDossierSubstep(1);
      }
    }
    handleNavigation('prev');
  }, [handleNavigation, currentStepIndex, flow, gameState.expansions.tenth, gameState.setupMode, setMissionDossierSubstep]);

  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipeNavigation({
    onNext: handleNext,
    onPrev: handlePrev,
    isNextDisabled,
    isPrevDisabled,
  });

  // --- Reset Logic ---
  const performReset = useCallback(() => {
    resetGameState();
    setResetKey(prev => prev + 1);
    window.scrollTo(0, 0);
  }, [resetGameState]);

  const setupDetermined = useMemo(() => isSetupDetermined(flow, currentStepIndex), [flow, currentStepIndex]);
  
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
  
  const touchHandlers = isOverrideModalOpen ? {} : {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return (
    <div 
      className="max-w-2xl mx-auto pb-24 xl:pb-0"
      key={resetKey}
      {...touchHandlers}
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
        <div className={cls(isDark ? 'bg-zinc-900/70 backdrop-blur-md border-zinc-800' : 'bg-[#faf8ef]/80 backdrop-blur-md border-[#d6cbb0]', "rounded-xl shadow-xl p-8 text-center border-t-8 animate-fade-in-up transition-colors duration-300", isDark ? 'border-t-green-800' : 'border-t-[#7f1d1d]')}>
          <div className="text-6xl mb-4">🚀</div>
          <h2 className={cls("text-3xl font-bold font-western mb-4", isDark ? 'text-gray-100' : 'text-[#292524]')}>You are ready to fly!</h2>
          <p className={cls("mb-8 text-lg", isDark ? 'text-gray-300' : 'text-[#57534e]')}>Setup is complete. Good luck, Captain.</p>
          
          {gameState.setupMode === 'detailed' && <FinalSummary gameState={gameState} />}

          <div className="hidden xl:flex justify-center gap-4">
            <Button onClick={handlePrev} variant="secondary">← Back</Button>
            <Button onClick={performReset}>Start New Game Setup</Button>
          </div>
          
           <div className={cls("fixed bottom-0 left-0 right-0 p-4 border-t z-[60] flex xl:hidden justify-between gap-4 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-colors duration-300", footerBg, footerBorder)}>
            <Button onClick={handlePrev} variant="secondary" className="flex-1 text-xs uppercase tracking-wider !py-3">
              ← Back
            </Button>
            <Button onClick={performReset} className="flex-[2] text-xs uppercase tracking-[0.1em] !py-3">
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
          openOverrideModal={openOverrideModal}
          hasUnacknowledgedPastOverrides={hasUnacknowledgedPastOverrides}
          onJump={handleJump}
          isNextDisabled={isNextDisabled}
        />
      )}
      
      {isOverrideModalOpen && createPortal(
        <OverrideModal
          affectedStepLabels={affectedStepLabels}
          onContinue={handleModalContinue}
          onJump={handleModalJump}
        />,
        document.body
      )}
    </div>
  );
};

export default SetupWizard;