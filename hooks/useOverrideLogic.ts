import { useState, useEffect, useMemo, useCallback } from 'react';
import { Step } from '../types';
import { useGameState } from './useGameState';
import { useGameDispatch } from './useGameDispatch';
import { detectOverrides } from '../utils/overrides';
import { ActionType } from '../state/actions';

interface UseOverrideLogicProps {
  flow: Step[];
  currentStepIndex: number;
  handleJump: (index: number) => void;
}

export const useOverrideLogic = ({ flow, currentStepIndex, handleJump }: UseOverrideLogicProps) => {
  const { state: gameState } = useGameState();
  const { dispatch, acknowledgeOverrides, visitOverriddenStep } = useGameDispatch();
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{ firstAffectedIndex: number; stepLabels: string[] } | null>(null);
  const [continueAction, setContinueAction] = useState<(() => void) | null>(null);

  const unacknowledgedOverrides = useMemo(() => {
    return gameState.overriddenStepIds.filter(
      id => !gameState.acknowledgedOverrides.includes(id) && !gameState.visitedStepOverrides.includes(id)
    );
  }, [gameState.overriddenStepIds, gameState.acknowledgedOverrides, gameState.visitedStepOverrides]);

  const hasUnacknowledgedPastOverrides = useMemo(() => {
    const pastStepIds = flow.slice(0, currentStepIndex).map(s => s.id);
    return unacknowledgedOverrides.some(id => pastStepIds.includes(id));
  }, [unacknowledgedOverrides, flow, currentStepIndex]);
  
  // Effect to detect and set story overrides in global state
  useEffect(() => {
    if (gameState.selectedStoryCardIndex !== null) {
      const overriddenIds = detectOverrides(gameState, flow);
      // Use a more robust comparison that is not order-dependent
      if (JSON.stringify(overriddenIds.sort()) !== JSON.stringify(gameState.overriddenStepIds.sort())) {
        dispatch({ type: ActionType.SET_STORY_OVERRIDES, payload: overriddenIds });
      }
    } else if (gameState.overriddenStepIds.length > 0) {
      // If no story is selected, clear any existing overrides
      dispatch({ type: ActionType.SET_STORY_OVERRIDES, payload: [] });
    }
  }, [gameState, flow, dispatch]);

  // Effect to mark overridden steps as "visited" when the user navigates to them.
  useEffect(() => {
    const currentStepId = flow[currentStepIndex]?.id;
    if (
      currentStepId &&
      gameState.overriddenStepIds.includes(currentStepId) &&
      !gameState.visitedStepOverrides.includes(currentStepId)
    ) {
      visitOverriddenStep(currentStepId);
    }
  }, [currentStepIndex, flow, gameState.overriddenStepIds, gameState.visitedStepOverrides, visitOverriddenStep]);

  // Modal Handlers
  const handleModalContinue = useCallback(() => {
    acknowledgeOverrides(gameState.overriddenStepIds);
    setIsOverrideModalOpen(false);
    if (continueAction) {
      continueAction();
    }
  }, [acknowledgeOverrides, gameState.overriddenStepIds, continueAction]);

  const handleModalJump = useCallback(() => {
    if (modalData) {
      acknowledgeOverrides(gameState.overriddenStepIds);
      handleJump(modalData.firstAffectedIndex);
      setIsOverrideModalOpen(false);
    }
  }, [acknowledgeOverrides, gameState.overriddenStepIds, handleJump, modalData]);

  const openOverrideModal = useCallback((onContinue: () => void) => {
    const pastStepIds = flow.slice(0, currentStepIndex).map(s => s.id);
    const affectedPastSteps = flow.filter(step => 
        pastStepIds.includes(step.id) &&
        unacknowledgedOverrides.includes(step.id)
    );

    if (affectedPastSteps.length === 0) return;

    const firstAffectedIndex = Math.min(...affectedPastSteps.map(step => flow.indexOf(step)));
    const stepLabels = affectedPastSteps.map(step => step.data?.title.replace(/^\d+\.\s+/, '') || step.id);
    setModalData({ firstAffectedIndex, stepLabels });
    setContinueAction(() => onContinue);
    setIsOverrideModalOpen(true);
  }, [flow, currentStepIndex, unacknowledgedOverrides]);

  return {
    openOverrideModal,
    isOverrideModalOpen,
    affectedStepLabels: modalData?.stepLabels ?? [],
    handleModalContinue,
    handleModalJump,
    hasUnacknowledgedPastOverrides,
  };
};
