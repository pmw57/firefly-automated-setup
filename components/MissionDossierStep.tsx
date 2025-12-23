import React, { useEffect, useRef } from 'react';
import { Button } from './Button';
import { useGameState } from '../hooks/useGameState';
import { MissionSelectionProvider } from './MissionSelectionContext';
import { useMissionSelection } from '../hooks/useMissionSelection';
import { useTheme } from './ThemeContext';
import { ActionType } from '../state/actions';
import { PageReference } from './PageReference';
import { StepComponentProps } from './StepContent';
import { STEP_IDS } from '../data/ids';

// Child Components
import { StoryDossier } from './story/StoryDossier';
import { StoryRandomizer } from './story/StoryRandomizer';
import { StoryCardGrid } from './story/StoryCardGrid';
import { SoloOptionsPart } from './story/SoloOptionsPart';

interface MissionDossierStepContentProps extends StepComponentProps {
  titleOverride?: string;
}

const MissionDossierStepContent = ({ onNext, onPrev, titleOverride, isNavigating }: MissionDossierStepContentProps): React.ReactElement => {
  const { state: gameState, dispatch } = useGameState();
  const {
    subStep,
    setSubStep,
    activeStoryCard,
    availableAdvancedRules,
    isClassicSolo,
    enablePart2,
    handleStoryCardSelect,
  } = useMissionSelection();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const dossierTopRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to top when a story is selected
  useEffect(() => {
    if (subStep === 1) { // Only scroll if we are in the main selection view
      dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [gameState.selectedStoryCard, subStep]);

  // Effect to ensure a goal is selected if the story has goals
  useEffect(() => {
    if (activeStoryCard && activeStoryCard.goals && activeStoryCard.goals.length > 0 && !gameState.selectedGoal) {
      dispatch({ type: ActionType.SET_GOAL, payload: activeStoryCard.goals[0].title });
    }
  }, [activeStoryCard, gameState.selectedGoal, dispatch]);

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

  const hasTenth = gameState.expansions.tenth;
  const storyPage = hasTenth ? 25 : 16;
  const storyManual = hasTenth ? '10th AE' : 'Core';

  const containerBg = 'bg-[#faf8ef]/80 dark:bg-zinc-900/70 backdrop-blur-md';
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
      {subStep === 1 && (
        <h4 className={`text-center font-bold text-sm uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            {titleOverride || 'Choose a Story Card'}
        </h4>
      )}
      
      <div 
        ref={dossierTopRef}
        className={`${containerBg} rounded-lg shadow-md border ${containerBorder} overflow-hidden transition-colors duration-300 scroll-mt-24`}
      >
        <div className={`${headerBarBg} p-4 flex justify-between items-center border-b ${headerBarBorder} transition-colors duration-300`}>
          <div className="flex items-baseline gap-2">
            <h3 className={`font-bold text-lg font-western tracking-wider ${headerColor}`}>
              {subStep === 1 ? 'Story Card' : 'Story Options'}
            </h3>
            {subStep === 1 && <PageReference page={storyPage} manual={storyManual} />}
          </div>
          {enablePart2 && <span className={`text-xs uppercase tracking-widest ${badgeBg} ${badgeBorder} ${badgeText} px-2 py-1 rounded font-bold`}>Part {subStep} of 2</span>}
        </div>
        
        {subStep === 1 ? (
          <div className="animate-fade-in">
            {activeStoryCard ? (
              <StoryDossier activeStoryCard={activeStoryCard} />
            ) : (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4" role="img" aria-label="Dossier icon">📜</div>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
                  Your selected story will appear here.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="animate-fade-in">
            {activeStoryCard && (
              <SoloOptionsPart 
                activeStoryCard={activeStoryCard}
                availableAdvancedRules={availableAdvancedRules}
              />
            )}
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
        <Button onClick={handlePrevStep} variant="secondary" className="shadow-sm" disabled={isNavigating}>
          {subStep === 1 ? '← Previous' : '← Back to Story'}
        </Button>
        <Button 
          onClick={handleNextStep} 
          className="shadow-lg hover:translate-y-[-2px] transition-transform"
          disabled={!activeStoryCard || isNavigating}
        >
          {subStep === 1 && enablePart2 ? 'Next: Options →' : 'Next Step →'}
        </Button>
      </div>
    </div>
  );
}

export const MissionDossierStep = (props: StepComponentProps): React.ReactElement => {
  const titleOverride = props.step.id === STEP_IDS.D_FIRST_GOAL ? "First, Choose a Story Card" : undefined;
  
  return (
    <MissionSelectionProvider>
      <MissionDossierStepContent {...props} titleOverride={titleOverride} />
    </MissionSelectionProvider>
  );
};