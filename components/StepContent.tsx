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
      
      {/* 
        Flex Layout for Header:
        - flex-wrap: Allows items to wrap to new line if space runs out.
        - Heading is FIRST in DOM, so it stays top-left.
        - QuotePanel is SECOND.
        - If Heading fits with Quote, they sit side-by-side.
        - If Heading is too wide, Quote wraps to the next line (Below Heading).
        - flex-1 on Heading ensures it takes up available space.
        - min-w on Heading ensures it doesn't get crushed before wrapping occurs.
      */}
      <div className="flex flex-wrap items-start justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 font-western border-b-2 border-green-800 pb-2 pr-10 flex-1 min-w-[200px]">
          <span className="text-green-700 mr-2">{stepIndex}.</span>
          {step.data?.title || step.id}
        </h2>

        <div className="w-full lg:w-1/3 shrink-0">
           <QuotePanel stepId={stepId} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {renderStepBody()}
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