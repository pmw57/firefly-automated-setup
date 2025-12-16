import { useMemo } from 'react';
import { Step } from '../types';
import { calculateSetupFlow as calculateFlow } from '../utils/flow';
import { useGameState } from './useGameState';

export const useSetupFlow = (): { flow: Step[] } => {
  const { gameState, isStateInitialized } = useGameState();

  const flow = useMemo(() => {
    if (!isStateInitialized) {
      return [];
    }
    return calculateFlow(gameState);
  }, [gameState, isStateInitialized]);

  return { flow };
};
