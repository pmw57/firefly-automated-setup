
import React, { useState } from 'react';
import { GameState } from '../types';
import { CaptainSetup } from './CaptainSetup';
import { SetupCardSelection } from './SetupCardSelection';

export const InitialForm: React.FC<{
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onStart: () => void;
  initialStep?: number;
}> = (props) => {
  const [internalStep, setInternalStep] = useState<number>(props.initialStep || 1);

  const next = () => {
      setInternalStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
      setInternalStep(prev => prev - 1);
  };

  if (internalStep === 1) {
    return <CaptainSetup {...props} onNext={next} />;
  }
  
  return <SetupCardSelection {...props} onBack={back} />;
};
