import React from 'react';
import { useMissionSelection } from '../../hooks/useMissionSelection';
import { useGameState } from '../../hooks/useGameState';
import { useTheme } from '../ThemeContext';
import { Button } from '../Button';
import { PageReference } from '../PageReference';
import { StoryDossier } from './StoryDossier';
import { StoryRandomizer } from './StoryRandomizer';
import { StoryCardGrid } from './StoryCardGrid';
// FIX: Changed import from '../../types' to '../../types/index' to fix module resolution ambiguity.
import { Step } from '../../types/index';
import { STEP_IDS } from '../../data/ids';

interface StorySelectionPartProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  isNavigating: boolean;
}

export const StorySelectionPart: React.FC<StorySelectionPartProps> = ({ step, onNext, onPrev, isNavigating }) => {
  const { 
    activeStoryCard,
    handleStoryCardSelect,
    isClassicSolo,
    enablePart2
  } = useMissionSelection();
  const { state: gameState } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const titleOverride = step.id === STEP_IDS.D_FIRST_GOAL ? "First, Choose a Story Card" : undefined;

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
    <div className="space-y-6 animate-fade-in">
      <h4 className={`text-center font-bold text-sm uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {titleOverride || 'Choose a Story Card'}
      </h4>
      
      <div className={`${containerBg} rounded-lg shadow-md border ${containerBorder} overflow-hidden transition-colors duration-300`}>
        <div className={`${headerBarBg} p-4 flex justify-between items-center border-b ${headerBarBorder} transition-colors duration-300`}>
          <div className="flex items-baseline gap-2">
            <h3 className={`font-bold text-lg font-western tracking-wider ${headerColor}`}>
              Story Card
            </h3>
            <PageReference page={storyPage} manual={storyManual} />
          </div>
          {enablePart2 && <span className={`text-xs uppercase tracking-widest ${badgeBg} ${badgeBorder} ${badgeText} px-2 py-1 rounded font-bold`}>Part 1 of 2</span>}
        </div>
        
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

      <div className="space-y-4">
        <StoryRandomizer onSelect={handleStoryCardSelect} />
        <StoryCardGrid onSelect={handleStoryCardSelect} isClassicSolo={isClassicSolo} />
      </div>

      <div className={`mt-8 flex justify-between clear-both pt-6 border-t ${navBorderTop}`}>
        <Button onClick={onPrev} variant="secondary" className="shadow-sm" disabled={isNavigating}>
          ← Previous
        </Button>
        <Button 
          onClick={onNext} 
          className="shadow-lg hover:translate-y-[-2px] transition-transform"
          disabled={!activeStoryCard || isNavigating}
        >
          {enablePart2 ? 'Next: Options →' : 'Next Step →'}
        </Button>
      </div>
    </div>
  );
};