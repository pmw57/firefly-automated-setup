import { useMemo } from 'react';
import { useGameState } from './useGameState';
import { getAllianceReaverDetails } from '../utils/alliance';

export const useAllianceReaverDetails = () => {
  const { state: gameState } = useGameState();
  return useMemo(() => getAllianceReaverDetails(gameState), [gameState]);
};
