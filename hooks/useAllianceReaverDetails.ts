import { useMemo } from 'react';
import { useGameState } from './useGameState';
import { getAllianceReaverDetails } from '../utils/alliance';
import { StepOverrides } from '../types';

export const useAllianceReaverDetails = (overrides: StepOverrides) => {
  const { state: gameState } = useGameState();
  return useMemo(() => getAllianceReaverDetails(gameState, overrides), [gameState, overrides]);
};
