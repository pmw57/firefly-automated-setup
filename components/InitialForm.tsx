
import React, { useState } from 'react';
import { GameState } from '../types';
import { CaptainSetup } from './CaptainSetup';
import { SetupCardSelection } from './SetupCardSelection';
import { OptionalRulesSelection } from './OptionalRulesSelection';

interface InitialFormProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onStart: () => void;
  initialStep?: number;
}

export const InitialForm: React.FC<InitialFormProps> = ({ gameState, setGameState, onStart, initialStep = 1 }) => {
  const [internalStep, setInternalStep] = useState<number>(initialStep);
  const isFlyingSolo = gameState.setupCardId === 'FlyingSolo';
  const has10th = gameState.expansions.tenth;

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
      // Show Optional Rules if Flying Solo OR 10th Anniversary expansion is active
      const showOptionalRules = isFlyingSolo || has10th;
      const handleNext = showOptionalRules ? next : onStart;
      return <SetupCardSelection gameState={gameState} setGameState={setGameState} onBack={back} onNext={handleNext} />;
    }

    case 3:
      if (isFlyingSolo || has10th) {
        return <OptionalRulesSelection gameState={gameState} setGameState={setGameState} onBack={back} onStart={onStart} />;
      }
      // Fallback if state changed unexpectedly
      return null;

    default:
      return null;
  }
};
