import { useMemo } from 'react';
import { useGameState } from './useGameState';
import { getDraftDetails } from '../utils/draftRules';
import { Step } from '../types';

export const useDraftDetails = (step: Step) => {
  const { state: gameState } = useGameState();
  return useMemo(() => getDraftDetails(gameState, step), [gameState, step]);
};