import React, { useState } from 'react';
import { GameState } from '../types';
import { CaptainSetup } from './CaptainSetup';
import { SetupCardSelection } from './SetupCardSelection';

export const InitialForm: React.FC<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onStart: () => void;
  initialStep?: 1 | 2;
}> = (props) => {
  const [internalStep, setInternalStep] = useState<1 | 2>(props.initialStep || 1);

  if (internalStep === 1) {
    return <CaptainSetup {...props} onNext={() => {
      setInternalStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }} />;
  }
  return <SetupCardSelection {...props} onBack={() => setInternalStep(1)} />;
};