
import React, { useState } from 'react';
import { GameState, Step, Expansions } from '../types';
import { SCENARIOS, SETUP_CONTENT, STORY_CARDS, EXPANSIONS_METADATA } from '../constants';
import { InitialForm } from './InitialForm';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';

const SetupWizard: React.FC = () => {
  // Generate initial expansions object (all true by default)
  const initialExpansions = EXPANSIONS_METADATA.reduce((acc, expansion) => {
    acc[expansion.id] = true;
    return acc;
  }, {} as Expansions);

  const [gameState, setGameState] = useState<GameState>({
    playerCount: 4,
    playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'],
    scenarioValue: 'Standard',
    scenarioName: 'Standard Game Setup',
    selectedStoryCard: STORY_CARDS[0].title,
    expansions: initialExpansions
  });

  const [flow, setFlow] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); // 0 is InitialForm
  const [isStarted, setIsStarted] = useState(false);

  // Build the flow based on selection
  const buildFlow = () => {
    // Find the scenario definition from the array
    const scenarioDef = SCENARIOS.find(s => s.id === gameState.scenarioValue) || SCENARIOS[0];
    
    const newFlow: Step[] = [];

    // Iterate through the steps defined in the scenario
    scenarioDef.steps.forEach(scenarioStep => {
      const content = SETUP_CONTENT[scenarioStep.id];
      if (content) {
        newFlow.push({
          type: content.type,
          id: content.id || content.elementId || scenarioStep.id,
          data: content,
          overrides: scenarioStep.overrides // Pass overrides if present
        });
      }
    });

    newFlow.push({ type: 'final', id: 'final' });
    setFlow(newFlow);
    setIsStarted(true);
    setCurrentStepIndex(0);
  };

  const handleNext = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, flow.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      // Go back to config
      setIsStarted(false);
      setFlow([]);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsStarted(false);
    setCurrentStepIndex(0);
    setFlow([]);
  };

  if (!isStarted) {
    return <InitialForm gameState={gameState} setGameState={setGameState} onStart={buildFlow} />;
  }

  const currentStep = flow[currentStepIndex];
  const isFinal = currentStep.type === 'final';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm border border-gray-200 flex justify-between items-center">
        <div>
           <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Scenario</span>
           <div className="font-bold text-green-900">{gameState.scenarioName}</div>
        </div>
        <button onClick={handleReset} className="text-xs text-red-600 hover:text-red-800 font-bold underline">
          Restart
        </button>
      </div>

      <ProgressBar current={currentStepIndex + 1} total={flow.length} />

      {isFinal ? (
        <div className="bg-white rounded-xl shadow-xl p-8 text-center border-t-8 border-green-600 animate-fade-in-up">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-gray-800 font-western mb-4">You are ready to fly!</h2>
          <p className="text-gray-600 mb-8 text-lg">Setup is complete. Good luck, Captain.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={handlePrev} variant="secondary">Back</Button>
            <Button onClick={handleReset}>Start New Game Setup</Button>
          </div>
        </div>
      ) : (
        <StepContent 
          step={currentStep} 
          stepIndex={currentStepIndex + 1}
          gameState={gameState}
          setGameState={setGameState}
          onNext={handleNext} 
          onPrev={handlePrev}
        />
      )}
    </div>
  );
};

export default SetupWizard;
