
import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { useGameState } from '../hooks/useGameState';
import { MissionSelectionProvider } from './MissionSelectionContext';
import { useMissionSelection } from '../hooks/useMissionSelection';

// Child Components
import { StoryDossier } from './story/StoryDossier';
import { StoryRandomizer } from './story/StoryRandomizer';
import { StoryCardGrid } from './story/StoryCardGrid';
import { SoloOptionsPart } from './story/SoloOptionsPart';

interface MissionDossierStepProps {
  onNext: () => void;
  onPrev: () => void;
}

const MissionDossierStepContent = ({ onNext, onPrev }: { onNext: () => void; onPrev: () => void }): React.ReactElement => {
  const { gameState, setGameState } = useGameState();
  const {
    subStep,
    setSubStep,
    activeStoryCard,
    availableAdvancedRules,
    isClassicSolo,
    enablePart2,
    handleStoryCardSelect,
  } = useMissionSelection();

  const dossierTopRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to top when a story is selected
  useEffect(() => {
    if (subStep === 1) { // Only scroll if we are in the main selection view
      dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [gameState.selectedStoryCard, subStep]);

  // Effect to ensure a goal is selected if the story has goals
  useEffect(() => {
    if (activeStoryCard.goals && activeStoryCard.goals.length > 0 && !gameState.selectedGoal) {
      setGameState(prev => ({ ...prev, selectedGoal: activeStoryCard.goals![0].title }));
    }
  }, [activeStoryCard, gameState.selectedGoal, setGameState]);

  const handleNextStep = () => {
    if (subStep === 1 && enablePart2) {
      setSubStep(2);
      dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onNext();
    }
  };

  const handlePrevStep = () => {
    if (subStep === 2) {
      setSubStep(1);
      dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      onPrev();
    }
  };

  const containerBg = 'bg-[#faf8ef] dark:bg-zinc-900';
  const containerBorder = 'border-[#d6cbb0] dark:border-zinc-800';
  const headerBarBg = 'bg-[#5e1916] dark:bg-black/40';
  const headerBarBorder = 'border-[#450a0a] dark:border-zinc-800';
  const headerColor = 'text-[#fef3c7] dark:text-amber-500';
  const badgeBg = 'bg-[#991b1b] dark:bg-zinc-800';
  const badgeText = 'text-[#fef3c7] dark:text-gray-400';
  const badgeBorder = 'border border-[#450a0a] dark:border-0';
  const navBorderTop = 'border-[#d6cbb0] dark:border-zinc-800';

  return (
    <div className="space-y-6">
      <div 
        ref={dossierTopRef}
        className={`${containerBg} backdrop-blur-md rounded-lg shadow-md border ${containerBorder} overflow-hidden transition-colors duration-300 scroll-mt-24`}
      >
        <div className={`${headerBarBg} p-4 flex justify-between items-center border-b ${headerBarBorder} transition-colors duration-300`}>
          <h3 className={`font-bold text-lg font-western tracking-wider ${headerColor}`}>
            {subStep === 1 ? 'Goal of the Game' : 'Story Options'}
          </h3>
          {enablePart2 && <span className={`text-xs uppercase tracking-widest ${badgeBg} ${badgeBorder} ${badgeText} px-2 py-1 rounded font-bold`}>Part {subStep} of 2</span>}
        </div>
        
        {subStep === 1 ? (
          <div className="animate-fade-in">
            <StoryDossier activeStoryCard={activeStoryCard} />
          </div>
        ) : (
          <div className="animate-fade-in">
            <SoloOptionsPart 
              activeStoryCard={activeStoryCard}
              availableAdvancedRules={availableAdvancedRules}
            />
          </div>
        )}
      </div>

      {subStep === 1 && (
        <div className="animate-fade-in space-y-4">
          <StoryRandomizer onSelect={handleStoryCardSelect} />
          <StoryCardGrid onSelect={handleStoryCardSelect} isClassicSolo={isClassicSolo} />
        </div>
      )}

      <div className={`mt-8 flex justify-between clear-both pt-6 border-t ${navBorderTop}`}>
        <Button onClick={handlePrevStep} variant="secondary" className="shadow-sm">
          {subStep === 1 ? '← Previous' : '← Back to Story'}
        </Button>
        <Button 
          onClick={handleNextStep} 
          className="shadow-lg hover:translate-y-[-2px] transition-transform"
        >
          {subStep === 1 && enablePart2 ? 'Next: Options →' : 'Next Step →'}
        </Button>
      </div>
    </div>
  );
}

export const MissionDossierStep = ({ onNext, onPrev }: MissionDossierStepProps): React.ReactElement => {
  return (
    <MissionSelectionProvider>
      <MissionDossierStepContent onNext={onNext} onPrev={onPrev} />
    </MissionSelectionProvider>
  );
};
