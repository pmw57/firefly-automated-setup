import { useMemo } from 'react';
import { Step } from '../types/index';
import { useGameState } from './useGameState';
import { calculateSetupFlow } from '../utils/flow';

export const useSetupFlow = (): { flow: Step[] } => {
  const { state: gameState, isStateInitialized } = useGameState();

  const flow = useMemo(() => {
    if (!isStateInitialized) {
      return [];
    }
    return calculateSetupFlow(gameState);
  }, [gameState, isStateInitialized]);

  return { flow };
};
