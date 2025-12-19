import React from 'react';
import { Step } from '../types';
import { STORY_CARDS } from '../data/storyCards';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { hasFlag } from '../utils/data';
import { calculatePrimeDetails } from '../utils/prime';
import { STORY_TITLES } from '../data/ids';

interface PrimePumpStepProps {
  step: Step;
}

export const PrimePumpStep: React.FC<PrimePumpStepProps> = ({ step }) => {
  const { state: gameState } = useGameState();
  const overrides = React.useMemo(() => step.overrides || {}, [step.overrides]);
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const soloCrewDraft = hasFlag(activeStoryCard?.setupConfig, 'soloCrewDraft');
  
  const isFlyingSolo = gameState.setupCardId === 'FlyingSolo';
  const isSlayingTheDragon = activeStoryCard?.title === STORY_TITLES.SLAYING_THE_DRAGON;
  const { isCampaign } = gameState;
  
  const {
    baseDiscard,
    effectiveMultiplier,
    finalCount,
    isHighSupplyVolume,
    isBlitz,
  } = React.useMemo(() => 
    calculatePrimeDetails(gameState, overrides, activeStoryCard),
    [gameState, overrides, activeStoryCard]
  );
  
  // Theming
  const cardBg = isDark ? 'bg-black/60' : 'bg-[#faf8ef]';
  const cardBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const titleColor = isDark ? 'text-white' : 'text-[#292524]';
  const iconColor = isDark ? 'text-gray-600' : 'text-[#a8a29e]';
  const textColor = isDark ? 'text-gray-300' : 'text-[#57534e]';
  
  const highlightBg = isDark ? 'bg-green-900/30 border-green-800' : 'bg-[#e6ddc5] border-[#d6cbb0]';
  const numberColor = isDark ? 'text-green-400' : 'text-[#7f1d1d]';
  const labelColor = isDark ? 'text-green-300' : 'text-[#78350f]';
  const subTextColor = isDark ? 'text-gray-400' : 'text-[#a8a29e]';

  return (
    <div className="space-y-4">
      
      {isHighSupplyVolume && gameState.optionalRules.highVolumeSupply && (
        <SpecialRuleBlock source="info" title="House Rule Active: High Volume Supply">
          Due to the number of large supply expansions, the base discard count for Priming the Pump is increased to <strong>4 cards</strong>.
        </SpecialRuleBlock>
      )}

      {isBlitz && (
        <SpecialRuleBlock source="setupCard" title="The Blitz: Double Dip" page={22} manual="Core">
          "Double Dip" rules are in effect. Discard the top <strong>{baseDiscard * 2} cards</strong> (2x Base) from each deck.
        </SpecialRuleBlock>
      )}

      {effectiveMultiplier > 1 && !isBlitz && activeStoryCard && (
        <SpecialRuleBlock source="story" title="Story Override">
          <strong>{activeStoryCard.title}:</strong> Prime counts are increased by {effectiveMultiplier}x.
        </SpecialRuleBlock>
      )}

      {isSlayingTheDragon && (
        <SpecialRuleBlock source="story" title={STORY_TITLES.SLAYING_THE_DRAGON}>
            <strong>Shu-ki is greasing the rails:</strong> Turn up <strong>2 additional cards</strong> from each deck when Priming the Pump.
        </SpecialRuleBlock>
      )}

      <div className={`${cardBg} p-6 rounded-lg border ${cardBorder} shadow-sm text-center transition-colors duration-300`}>
        <h4 className={`font-bold text-xl font-western mb-4 ${titleColor}`}>Priming The Pump</h4>
        <div className={`text-5xl font-bold mb-4 ${iconColor}`}>🃏</div>
        <p className={`text-lg ${textColor}`}>
          Shuffle all Supply Decks.
        </p>
        <div className={`my-6 p-4 rounded-lg inline-block border ${highlightBg}`}>
          <span className={`block text-4xl font-bold mb-1 ${numberColor}`}>{finalCount}</span>
          <span className={`text-sm font-bold uppercase tracking-wide ${labelColor}`}>Cards Discarded</span>
        </div>
        <p className={`text-sm italic ${subTextColor}`}>
          (From the top of each Supply Deck)
        </p>
      </div>
      
      {isCampaign ? (
        <SpecialRuleBlock source="story" title="Campaign Rules: Supplies">
          <p>You receive your standard starting credits. <strong>Remember to add any money you saved from the last game.</strong></p>
          <p className="mt-2">After priming, you may spend up to <strong>$1000 (plus your saved money)</strong> to repurchase any Supply Cards you set aside at the end of the last game.</p>
          <p className="mt-2 text-xs italic opacity-75">Place any unpurchased cards into their discard piles.</p>
        </SpecialRuleBlock>
      ) : isFlyingSolo ? (
        <SpecialRuleBlock source="setupCard" title="Flying Solo">
            <p>After priming, you may <strong>spend up to $1000</strong> to buy <strong>up to 4 Supply Cards</strong> that were revealed.</p>
            <p className="text-sm mt-1">Discounts from special abilities apply. <strong>Replace any purchased cards.</strong></p>
        </SpecialRuleBlock>
      ) : null}


      {!isFlyingSolo && !isCampaign && soloCrewDraft && (
        <SpecialRuleBlock source="story" title="Solo Crew Recruitment">
            <p>After priming, you may purchase <strong>up to 4 Crew or Gear cards</strong> from the <strong>discard piles</strong> of any <strong>single Supply Deck</strong>.</p>
            <p className="text-sm mt-1">The total cost of these items must not exceed <strong>$1000</strong>.</p>
        </SpecialRuleBlock>
      )}
    </div>
  );
};