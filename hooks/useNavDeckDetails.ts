import { useMemo } from 'react';
import { useGameState } from './useGameState';
import { getNavDeckDetails } from '../utils/nav';
import { StepOverrides } from '../types';

export const useNavDeckDetails = (overrides: StepOverrides) => {
  const { state: gameState } = useGameState();
  return useMemo(() => getNavDeckDetails(gameState, overrides), [gameState, overrides]);
};
