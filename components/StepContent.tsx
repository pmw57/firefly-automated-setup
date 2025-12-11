import React from 'react';
import { GameState, Step } from '../types';
import { Button } from './Button';
import { QuotePanel } from './QuotePanel';

// Core Steps
import { NavDeckStep } from './NavDeckStep';
import { AllianceReaverStep } from './AllianceReaverStep';
import { DraftStep } from './DraftStep';
import { MissionDossierStep } from './MissionDossierStep';
import { ResourcesStep } from './ResourcesStep';
import { JobStep } from './JobStep';
import { PrimePumpStep } from './PrimePumpStep';

// Dynamic Step
import { DynamicStepHandler } from './DynamicStepHandler';

interface StepContentProps {
  step: Step;
  stepIndex: number;
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onNext: () => void;
  onPrev: () => void;
}

export const StepContent: React.FC<StepContentProps> = ({ step, stepIndex, gameState, setGameState, onNext, onPrev }) => {
  const stepId = step.data?.id || step.id || '';

  // Render logic based on Step Type and ID
  const renderStepBody = () => {
    if (step.type === 'core') {
      switch (step.data?.id) {
        case 'core-1': return <NavDeckStep step={step} gameState={gameState} />;
        case 'core-2': return <AllianceReaverStep step={step} gameState={gameState} />;
        case 'core-3': return <DraftStep step={step} gameState={gameState} />;
        case 'core-4': return <MissionDossierStep step={step} gameState={gameState} setGameState={setGameState} />;
        case 'core-5': return <ResourcesStep step={step} gameState={gameState} />;
        case 'core-6': return <JobStep step={step} gameState={gameState} />;
        case 'core-prime': return <PrimePumpStep step={step} gameState={gameState} />;
        default: return <div className="text-red-500">Unknown Core Step: {step.data?.id}</div>;
      }
    } else {
      // Delegate all dynamic logic to the handler
      return <DynamicStepHandler step={step} gameState={gameState} />;
    }
  };

  return (
    <div className="animate-fade-in-up">
      {/* Floating Quote Panel - Top Right */}
      <QuotePanel stepId={stepId} />

      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 font-western border-b-2 border-green-800 pb-2 inline-block pr-10">
          <span className="text-green-700 mr-2">{stepIndex}.</span>
          {step.data?.title || step.id}
        </h2>

        {/* Main Content Area */}
        <div className="relative">
          {renderStepBody()}
        </div>
      </div>

      <div className="mt-8 flex justify-between clear-both pt-6 border-t border-gray-200">
        <Button onClick={onPrev} variant="secondary" className="shadow-sm">
          ← Previous
        </Button>
        <Button onClick={onNext} className="shadow-lg hover:translate-y-[-2px] transition-transform">
          Next Step →
        </Button>
      </div>
    </div>
  );
};