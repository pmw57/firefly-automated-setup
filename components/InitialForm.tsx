import React, { useState } from 'react';
import { GameState } from '../types';
import { CaptainSetup } from './CaptainSetup';
import { SetupCardSelection } from './SetupCardSelection';

export const InitialForm: React.FC<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onStart: () => void;
}> = (props) => {
  const [internalStep, setInternalStep] = useState<1 | 2>(1);

  if (internalStep === 1) {
    return <CaptainSetup {...props} onNext={() => setInternalStep(2)} />;
  }
  return <SetupCardSelection {...props} onBack={() => setInternalStep(1)} />;
};