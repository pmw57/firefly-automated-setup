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

  const unacknowledgedOverrides = useMemo(() => {
    return gameState.overriddenStepIds.filter(
      id => !gameState.acknowledgedOverrides.includes(id) && !gameState.visitedStepOverrides.includes(id)
    );
  }, [gameState.overriddenStepIds, gameState.acknowledgedOverrides, gameState.visitedStepOverrides]);

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
  }, [acknowledgeOverrides, gameState.overriddenStepIds]);

  const handleModalJump = useCallback(() => {
    if (modalData) {
      acknowledgeOverrides(gameState.overriddenStepIds);
      handleJump(modalData.firstAffectedIndex);
      setIsOverrideModalOpen(false);
    }
  }, [acknowledgeOverrides, gameState.overriddenStepIds, handleJump, modalData]);

  const openOverrideModal = useCallback(() => {
    const affectedSteps = flow.filter(step => unacknowledgedOverrides.includes(step.id));
    const firstAffectedIndex = Math.min(...affectedSteps.map(step => flow.indexOf(step)));
    const stepLabels = affectedSteps.map(step => step.data?.title.replace(/^\d+\.\s+/, '') || step.id);
    setModalData({ firstAffectedIndex, stepLabels });
    setIsOverrideModalOpen(true);
  }, [flow, unacknowledgedOverrides]);

  return {
    unacknowledgedOverrides,
    openOverrideModal,
    isOverrideModalOpen,
    affectedStepLabels: modalData?.stepLabels ?? [],
    handleModalContinue,
    handleModalJump,
  };
};
