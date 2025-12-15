
import React, { useState } from 'react';
import { GameState } from '../types';
import { CaptainSetup } from './CaptainSetup';
import { SetupCardSelection } from './SetupCardSelection';
import { SoloRulesSelection } from './SoloRulesSelection';

interface InitialFormProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onStart: () => void;
  initialStep?: number;
}

export const InitialForm: React.FC<InitialFormProps> = ({ gameState, setGameState, onStart, initialStep = 1 }) => {
  const [internalStep, setInternalStep] = useState<number>(initialStep);
  const isFlyingSolo = gameState.setupCardId === 'FlyingSolo';

  const next = () => {
      setInternalStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const back = () => {
      setInternalStep(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  switch (internalStep) {
    case 1:
      return <CaptainSetup gameState={gameState} setGameState={setGameState} onNext={next} />;
    
    case 2: {
      // If Flying Solo, we go to step 3. Otherwise, we are done.
      const handleNext = isFlyingSolo ? next : onStart;
      return <SetupCardSelection gameState={gameState} setGameState={setGameState} onBack={back} onNext={handleNext} />;
    }

    case 3:
      // This case is only reachable if isFlyingSolo was true in step 2
      if (isFlyingSolo) {
        return <SoloRulesSelection gameState={gameState} setGameState={setGameState} onBack={back} onStart={onStart} />;
      }
      // Fallback if state changed unexpectedly
      return null;

    default:
      return null;
  }
};
