import { useMemo } from 'react';
import { useGameState } from './useGameState';
import { getPrimeDetails } from '../utils/prime';
import { StepOverrides } from '../types';

export const usePrimeDetails = (overrides: StepOverrides) => {
  const { state: gameState } = useGameState();
  return useMemo(() => getPrimeDetails(gameState, overrides), [gameState, overrides]);
};
