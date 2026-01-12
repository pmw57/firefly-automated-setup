import React from 'react';
import { useMissionSelection } from '../../hooks/useMissionSelection';
import { useGameState } from '../../hooks/useGameState';
import { useTheme } from '../ThemeContext';
import { Button } from '../Button';
import { PageReference } from '../PageReference';
import { StoryDossier } from './StoryDossier';
import { StoryRandomizer } from './StoryRandomizer';
import { StoryCardGrid } from './StoryCardGrid';
import { SETUP_CARD_IDS } from '../../data/ids';
import { OverrideNotificationBlock } from '../SpecialRuleBlock';
import { cls } from '../../utils/style';

interface StorySelectionPartProps {
  onNext: () => void;
  onPrev: () => void;
  isNavigating: boolean;
  title: string;
  isFirstStep: boolean;
}

export const StorySelectionPart: React.FC<StorySelectionPartProps> = ({ onNext, onPrev, isNavigating, title, isFirstStep }) => {
  const { 
    activeStoryCard,
    handleStoryCardSelect,
    enablePart2
  } = useMissionSelection();
  const { state: gameState } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const hasTenth = gameState.expansions.tenth;
  const storyPage = hasTenth ? 25 : 16;
  const storyManual = hasTenth ? '10th AE' : 'Core';

  const setupOverrideMessage = React.useMemo(() => {
    if (gameState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
      return (
        <OverrideNotificationBlock
          source="setupCard"
          title="Flying Solo Mode Active"
          content={[
            { type: 'paragraph', content: ["You are playing in the 10th Anniversary Expanded Solo Mode. This mode allows you to play almost any story card solo, but it excludes some stories designed for the 'classic' solo variant."] }
          ]}
        />
      );
    }
    if (gameState.setupCardId === SETUP_CARD_IDS.SOLITAIRE_FIREFLY) {
      return (
        <OverrideNotificationBlock
          source="setupCard"
          title="Solitaire Firefly Mode Active"
          content={[
            { type: 'paragraph', content: ["You are playing the fan-made solo campaign that follows the TV series. Only the episodic story cards are available in this mode."] }
          ]}
        />
      );
    }
    return null;
  }, [gameState.setupCardId]);

  const containerBg = 'bg-[#faf8ef]/80 dark:bg-zinc-900/70 backdrop-blur-md';
  const containerBorder = 'border-[#d6cbb0] dark:border-zinc-800';
  const headerBarBg = 'bg-[#5e1916] dark:bg-black/40';
  const headerBarBorder = 'border-[#450a0a] dark:border-zinc-800';
  const headerColor = 'text-[#fef3c7] dark:text-amber-500';
  const badgeBg = 'bg-[#991b1b] dark:bg-zinc-800';
  const badgeText = 'text-[#fef3c7] dark:text-gray-400';
  const badgeBorder = 'border border-[#450a0a] dark:border-0';
  const navBorderTop = 'border-[#d6cbb0] dark:border-zinc-800';
  const footerBg = isDark ? 'bg-zinc-950/90' : 'bg-[#faf8ef]/95';
  const footerBorder = isDark ? 'border-zinc-800' : 'border-firefly-parchment-border';

  const nextButtonText = enablePart2 && gameState.setupMode === 'detailed' ? 'Next: Advanced →' : 'Next Step →';

  return (
    <div className="space-y-6 animate-fade-in pb-24 xl:pb-0">
      <h4 className={`text-center font-bold text-sm uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {title}
      </h4>
      
      {setupOverrideMessage}
      
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
        <StoryCardGrid onSelect={handleStoryCardSelect} />
      </div>
      
      {/* Desktop Nav */}
      <div className={cls(
          "hidden xl:flex mt-8 clear-both pt-6 border-t",
          isFirstStep ? 'justify-end' : 'justify-between',
          navBorderTop
      )}>
        {!isFirstStep && (
          <Button onClick={onPrev} variant="secondary" className="shadow-sm" disabled={isNavigating}>
            ← Back
          </Button>
        )}
        <Button 
          onClick={onNext} 
          className="shadow-lg hover:translate-y-[-2px] transition-transform"
          disabled={!activeStoryCard || isNavigating}
        >
          {nextButtonText}
        </Button>
      </div>
      
      {/* Sticky Mobile Nav */}
      <div className={cls(
        "fixed bottom-0 left-0 right-0 p-4 border-t z-[60] flex xl:hidden justify-between gap-4 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-colors duration-300",
        footerBg, footerBorder
      )}>
        {!isFirstStep && (
          <Button 
            onClick={onPrev} 
            variant="secondary"
            disabled={isNavigating}
            className="flex-1 text-xs uppercase tracking-wider !py-3"
          >
            ← Back
          </Button>
        )}
        <Button 
          onClick={onNext} 
          disabled={!activeStoryCard || isNavigating}
          className={cls(isFirstStep ? 'w-full' : 'flex-[2]', "text-xs uppercase tracking-[0.1em] !py-3")}
        >
          {nextButtonText}
        </Button>
      </div>
    </div>
  );
};
