import React, { useState, useEffect } from 'react';
import { GameState, Step, Expansions } from '../types';
import { SETUP_CARDS, SETUP_CONTENT, STORY_CARDS, EXPANSIONS_METADATA } from '../constants';
import { InitialForm } from './InitialForm';
import { StepContent } from './StepContent';
import { ProgressBar } from './ProgressBar';
import { Button } from './Button';

const STORAGE_KEY = 'firefly_setup_v2';

interface PersistedState {
  gameState: GameState;
  currentStepIndex: number;
  isStarted: boolean;
}

// Helper to generate default state (Moved outside component for stability)
const getDefaultGameState = (): GameState => {
  const initialExpansions = EXPANSIONS_METADATA.reduce((acc, expansion) => {
    acc[expansion.id] = true;
    return acc;
  }, {} as Expansions);

  return {
    playerCount: 4,
    playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'],
    setupCardId: 'Standard',
    setupCardName: 'Standard Game Setup',
    selectedStoryCard: STORY_CARDS[0].title,
    expansions: initialExpansions
  };
};

// Helper to rebuild flow from a game state (Moved outside to satisfy React Hooks deps)
const calculateFlow = (state: GameState): Step[] => {
  const setupDef = SETUP_CARDS.find(s => s.id === state.setupCardId) || SETUP_CARDS[0];
  const newFlow: Step[] = [];

  setupDef.steps.forEach(setupStep => {
    const content = SETUP_CONTENT[setupStep.id];
    if (content) {
      newFlow.push({
        type: content.type,
        id: content.id || content.elementId || setupStep.id,
        data: content,
        overrides: setupStep.overrides
      });
    }
  });

  newFlow.push({ type: 'final', id: 'final' });
  return newFlow;
};

const SetupWizard: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(getDefaultGameState());
  const [flow, setFlow] = useState<Step[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0); 
  const [isStarted, setIsStarted] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const [initialFormStep, setInitialFormStep] = useState<1 | 2>(1);
  
  // UI State for Restart Confirmation
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // Build the flow based on selection (Public handler)
  const buildFlow = () => {
    const newFlow = calculateFlow(gameState);
    setFlow(newFlow);
    setIsStarted(true);
    setCurrentStepIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load state from local storage on mount
  useEffect(() => {
    // Artificial delay to ensure the loading UI is visible and the browser has time to paint
    // preventing the "frozen" feeling on initial load
    const timer = setTimeout(() => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        try {
          const parsed: PersistedState = JSON.parse(saved);
          setGameState(parsed.gameState);
          
          if (parsed.isStarted) {
            // Reconstruct the flow based on saved game state
            const newFlow = calculateFlow(parsed.gameState);
            setFlow(newFlow);
            setCurrentStepIndex(parsed.currentStepIndex);
            setIsStarted(true);
          }
        } catch (e) {
          console.error("Failed to load saved state", e);
        }
      }
      
      // Reveal the app
      setIsInitialized(true);
    }, 1200); // 1.2s delay for better UX on slower devices

    return () => clearTimeout(timer);
  }, []);

  // Save state to local storage whenever it changes
  useEffect(() => {
    if (!isInitialized) return;

    const dataToSave: PersistedState = {
      gameState,
      currentStepIndex,
      isStarted
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [gameState, currentStepIndex, isStarted, isInitialized]);

  const handleNext = () => {
    setCurrentStepIndex(prev => Math.min(prev + 1, flow.length - 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    } else {
      setIsStarted(false);
      setFlow([]);
      setInitialFormStep(2);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Hard Reset Function - State Based
  const performReset = () => {
    const defaultState = getDefaultGameState();
    
    // 1. Clear Storage
    localStorage.removeItem(STORAGE_KEY);
    
    // 2. Reset React State
    setGameState(defaultState);
    setFlow([]);
    setCurrentStepIndex(0);
    setIsStarted(false);
    setShowConfirmReset(false);
    setInitialFormStep(1);
    
    // 3. Force Re-mount of children
    setResetKey(prev => prev + 1);
    
    // 4. Scroll to top
    window.scrollTo(0, 0);
  };

  const handleResetClick = () => {
    if (showConfirmReset) {
      performReset();
    } else {
      setShowConfirmReset(true);
      // Auto-hide confirmation after 3 seconds if not clicked
      setTimeout(() => setShowConfirmReset(false), 3000);
    }
  };

  // Prevent rendering until we've checked local storage
  if (!isInitialized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-red-900 mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-700 font-western tracking-wider animate-pulse">Initializing Cortex...</h2>
        <p className="text-gray-500 mt-2 text-sm italic">Accessing secure alliance servers</p>
      </div>
    );
  }

  if (!isStarted) {
    return <InitialForm key={resetKey} gameState={gameState} setGameState={setGameState} onStart={buildFlow} initialStep={initialFormStep} />;
  }

  const currentStep = flow[currentStepIndex];
  if (!currentStep) {
    performReset();
    return null;
  }
  
  const isFinal = currentStep.type === 'final';

  return (
    <div className="max-w-2xl mx-auto">
      {/* Sticky Header with Setup Details */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-4 rounded-lg mb-6 shadow-sm border border-gray-200 dark:border-zinc-800 flex justify-between items-center transition-all duration-300 sticky top-0 z-30">
        <div className="flex flex-col">
           <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Active Game</span>
           <div className="flex flex-wrap items-center gap-x-2 font-bold text-green-900 dark:text-green-400 text-sm md:text-base leading-tight">
              <span className="text-blue-900 dark:text-blue-300">{gameState.setupCardName}</span>
              {gameState.selectedStoryCard && (
                <>
                  <span className="text-gray-400 dark:text-gray-600 hidden sm:inline">•</span>
                  <span className="text-amber-800 dark:text-amber-200 block sm:inline">{gameState.selectedStoryCard}</span>
                </>
              )}
           </div>
        </div>
        <button 
          type="button"
          onClick={handleResetClick}
          className={`
            text-xs font-bold underline focus:outline-none focus:ring-2 rounded px-2 py-1 transition-colors duration-200 ml-4 shrink-0
            ${showConfirmReset 
              ? 'bg-red-600 text-white hover:bg-red-700 ring-red-500 no-underline shadow-md' 
              : 'text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 focus:ring-red-500'
            }
          `}
        >
          {showConfirmReset ? "Confirm Restart?" : "Restart"}
        </button>
      </div>

      <ProgressBar current={currentStepIndex + 1} total={flow.length} />

      {isFinal ? (
        <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-8 text-center border-t-8 border-green-600 dark:border-green-800 animate-fade-in-up border-x border-b border-gray-200 dark:border-zinc-800 transition-colors duration-300">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 font-western mb-4">You are ready to fly!</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">Setup is complete. Good luck, Captain.</p>
          <div className="flex justify-center gap-4">
            <Button onClick={handlePrev} variant="secondary">Back</Button>
            <Button onClick={performReset}>Start New Game Setup</Button>
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