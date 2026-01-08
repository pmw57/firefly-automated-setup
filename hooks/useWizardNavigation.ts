import { useState, useCallback, useEffect, useRef } from 'react';
import { Step } from '../types';
import { useWizardState } from './useWizardState';
import { useGameDispatch } from './useGameDispatch';
import { calculateSetupFlow } from '../utils/flow';
import { useGameState } from './useGameState';
import { STEP_IDS } from '../data/ids';

interface UseWizardNavigationProps {
  flow: Step[];
}

export const useWizardNavigation = ({ flow }: UseWizardNavigationProps) => {
  const { state: gameState } = useGameState();
  const { setMissionDossierSubstep } = useGameDispatch();
  const { currentStepIndex, setCurrentStepIndex } = useWizardState();
  const [isNavigating, setIsNavigating] = useState(false);
  const [lastNavDirection, setLastNavDirection] = useState<'next' | 'prev'>('next');
  const prevSetupModeRef = useRef(gameState.setupMode);

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

        const isMovingForward = nextIndex > prev;
        const targetStepId = flow[nextIndex]?.id;
        if (isMovingForward && targetStepId === STEP_IDS.C4) {
          setMissionDossierSubstep(1);
        }

        if (nextIndex !== prev) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        return nextIndex;
      });
      setIsNavigating(false);
    }, 50);
  }, [flow, setCurrentStepIndex, setMissionDossierSubstep]);

  // Effect to handle setup mode changes
  useEffect(() => {
    if (prevSetupModeRef.current !== gameState.setupMode) {
      const oldState = { ...gameState, setupMode: prevSetupModeRef.current };
      const oldFlow = calculateSetupFlow(oldState);
      const oldStepId = oldFlow[currentStepIndex]?.id;
      
      const wasOnAdvancedRules = oldState.missionDossierSubStep === 2;
      const advancedRulesBecameInvalid = gameState.setupMode === 'quick';

      if (oldStepId === STEP_IDS.C4 && wasOnAdvancedRules && advancedRulesBecameInvalid) {
        if (lastNavDirection === 'next') {
          handleNavigation('next');
        } else {
          setMissionDossierSubstep(1);
        }
        prevSetupModeRef.current = gameState.setupMode;
        return;
      }

      if (oldStepId) {
        const newIndex = flow.findIndex(step => step.id === oldStepId);
        if (newIndex !== -1 && newIndex !== currentStepIndex) {
          setCurrentStepIndex(newIndex);
        } else if (newIndex === -1) {
          const prevStepIdInOldFlow = oldFlow[currentStepIndex - 1]?.id;
          if (prevStepIdInOldFlow) {
            const newIndexOfPrevStep = flow.findIndex(step => step.id === prevStepIdInOldFlow);
            if (newIndexOfPrevStep !== -1) {
              const targetIndex = lastNavDirection === 'next' ? newIndexOfPrevStep + 1 : newIndexOfPrevStep;
              setCurrentStepIndex(Math.min(targetIndex, flow.length - 1));
            } else {
              setCurrentStepIndex(0);
            }
          }
        }
      }
      prevSetupModeRef.current = gameState.setupMode;
    }
  }, [gameState.setupMode, flow, currentStepIndex, setCurrentStepIndex, gameState, lastNavDirection, handleNavigation, setMissionDossierSubstep]);
  
  // Effect to keep index in bounds
  useEffect(() => {
    if (currentStepIndex >= flow.length && flow.length > 0) {
      setCurrentStepIndex(flow.length - 1);
    }
  }, [flow, currentStepIndex, setCurrentStepIndex]);

  const handleJump = useCallback((index: number) => {
    const targetStepId = flow[index]?.id;
    if (targetStepId === STEP_IDS.C4) {
      setMissionDossierSubstep(1);
    }
    handleNavigation(index);
  }, [handleNavigation, flow, setMissionDossierSubstep]);

  return {
    isNavigating,
    lastNavDirection,
    handleNavigation,
    handleJump,
  };
};
