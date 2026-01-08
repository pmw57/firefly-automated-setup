import { useMemo } from 'react';
import { useGameState } from './useGameState';
import { getJobSetupDetails } from '../utils/jobs';
import { StepOverrides } from '../types';

export const useJobSetupDetails = (overrides: StepOverrides) => {
  const { state: gameState } = useGameState();
  return useMemo(() => getJobSetupDetails(gameState, overrides), [gameState, overrides]);
};