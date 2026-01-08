import { useContext } from 'react';
import { GameDispatchContext, GameDispatchContextType } from './useGameState';

export const useGameDispatch = (): GameDispatchContextType => {
  const context = useContext(GameDispatchContext);
  if (context === undefined) {
    throw new Error('useGameDispatch must be used within a GameStateProvider');
  }
  return context;
};
