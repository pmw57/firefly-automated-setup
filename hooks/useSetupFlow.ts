import { useMemo } from 'react';
import { Step } from '../types/index';
import { useGameState } from './useGameState';
import { useData } from './useData';
import { calculateSetupFlow } from '../utils/flow';

export const useSetupFlow = (): { flow: Step[] } => {
  const { state: gameState, isStateInitialized } = useGameState();
  const { setupCards } = useData();

  const flow = useMemo(() => {
    if (!isStateInitialized) {
      return [];
    }
    return calculateSetupFlow(gameState, setupCards);
  }, [gameState, isStateInitialized, setupCards]);

  return { flow };
};
