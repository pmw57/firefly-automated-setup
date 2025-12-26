import { useMemo } from 'react';
// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
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