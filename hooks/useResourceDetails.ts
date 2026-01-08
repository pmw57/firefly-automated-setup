import { useMemo } from 'react';
import { useGameState } from './useGameState';
import { getResourceDetails } from '../utils/resources';

export const useResourceDetails = (manualSelection?: 'story' | 'setupCard') => {
  const { state: gameState } = useGameState();
  return useMemo(() => getResourceDetails(gameState, manualSelection), [gameState, manualSelection]);
};
