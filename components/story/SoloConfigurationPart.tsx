import React from 'react';
import { useMissionSelection } from '../../hooks/useMissionSelection';
import { Button } from '../Button';
import { PageReference } from '../PageReference';
import { SoloOptionsPart } from './SoloOptionsPart';

interface SoloConfigurationPartProps {
  onNext: () => void;
  onBack: () => void;
  isNavigating: boolean;
}

export const SoloConfigurationPart: React.FC<SoloConfigurationPartProps> = ({ onNext, onBack, isNavigating }) => {
  const { activeStoryCard, availableAdvancedRules, enablePart2 } = useMissionSelection();

  const containerBg = 'bg-[#faf8ef]/80 dark:bg-zinc-900/70 backdrop-blur-md';
  const containerBorder = 'border-[#d6cbb0] dark:border-zinc-800';
  const headerBarBg = 'bg-[#5e1916] dark:bg-black/40';
  const headerBarBorder = 'border-[#450a0a] dark:border-zinc-800';
  const headerColor = 'text-[#fef3c7] dark:text-amber-500';
  const badgeBg = 'bg-[#991b1b] dark:bg-zinc-800';
  const badgeText = 'text-[#fef3c7] dark:text-gray-400';
  const badgeBorder = 'border border-[#450a0a] dark:border-0';
  const navBorderTop = 'border-[#d6cbb0] dark:border-zinc-800';

  if (!activeStoryCard) return null;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`${containerBg} rounded-lg shadow-md border ${containerBorder} overflow-hidden transition-colors duration-300`}>
        <div className={`${headerBarBg} p-4 flex justify-between items-center border-b ${headerBarBorder} transition-colors duration-300`}>
          <div className="flex items-baseline gap-2">
            <h3 className={`font-bold text-lg font-western tracking-wider ${headerColor}`}>
              Story Options
            </h3>
            <PageReference page={55} manual="10th AE" />
          </div>
          {enablePart2 && <span className={`text-xs uppercase tracking-widest ${badgeBg} ${badgeBorder} ${badgeText} px-2 py-1 rounded font-bold`}>Part 2 of 2</span>}
        </div>
        
        <SoloOptionsPart 
          activeStoryCard={activeStoryCard}
          availableAdvancedRules={availableAdvancedRules}
        />
      </div>

      <div className={`mt-8 flex justify-between clear-both pt-6 border-t ${navBorderTop}`}>
        <Button onClick={onBack} variant="secondary" className="shadow-sm" disabled={isNavigating}>
          ← Back to Story
        </Button>
        <Button 
          onClick={onNext} 
          className="shadow-lg hover:translate-y-[-2px] transition-transform"
          disabled={!activeStoryCard || isNavigating}
        >
          Next Step →
        </Button>
      </div>
    </div>
  );
};