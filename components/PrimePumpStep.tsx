import React from 'react';
import { Step } from '../types';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { hasFlag } from '../utils/data';
import { getPrimeDetails, getActiveStoryCard } from '../utils/selectors';
import { STORY_TITLES } from '../data/ids';

interface PrimePumpStepProps {
  step: Step;
}

export const PrimePumpStep: React.FC<PrimePumpStepProps> = ({ step }) => {
  const { state: gameState } = useGameState();
  const overrides = React.useMemo(() => step.overrides || {}, [step.overrides]);
  const activeStoryCard = getActiveStoryCard(gameState);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const soloCrewDraft = hasFlag(activeStoryCard?.setupConfig, 'soloCrewDraft');
  
  const isFlyingSolo = gameState.setupCardId === 'FlyingSolo';
  const { isCampaign } = gameState;
  
  const {
    baseDiscard,
    effectiveMultiplier,
    finalCount,
    isHighSupplyVolume,
    isBlitz,
    isSlayingTheDragon
  } = React.useMemo(() => 
    getPrimeDetails(gameState, overrides),
    [gameState, overrides]
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
        <SpecialRuleBlock source="info" title="House Rule Active: High Volume Supply" content={["Due to the number of large supply expansions, the base discard count for Priming the Pump is increased to ", { type: 'strong', content: '4 cards' }, "."]} />
      )}

      {isBlitz && (
        <SpecialRuleBlock source="setupCard" title="The Blitz: Double Dip" page={22} manual="Core" content={['"Double Dip" rules are in effect. Discard the top ', { type: 'strong', content: `${baseDiscard * 2} cards` }, ' (2x Base) from each deck.']} />
      )}

      {effectiveMultiplier > 1 && !isBlitz && activeStoryCard && (
        <SpecialRuleBlock source="story" title="Story Override" content={[{ type: 'strong', content: `${activeStoryCard.title}:` }, ` Prime counts are increased by ${effectiveMultiplier}x.`]} />
      )}

      {isSlayingTheDragon && (
        <SpecialRuleBlock source="story" title={STORY_TITLES.SLAYING_THE_DRAGON} content={[{ type: 'strong', content: 'Shu-ki is greasing the rails:' }, ' Turn up ', { type: 'strong', content: '2 additional cards' }, ' from each deck when Priming the Pump.']} />
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
        <SpecialRuleBlock source="story" title="Campaign Rules: Supplies" content={[
          { type: 'paragraph', content: ['You receive your standard starting credits. ', { type: 'strong', content: 'Remember to add any money you saved from the last game.' }] },
          { type: 'paragraph', content: ['After priming, you may spend up to ', { type: 'strong', content: '$1000 (plus your saved money)' }, ' to repurchase any Supply Cards you set aside at the end of the last game.'] },
          { type: 'paragraph', content: ["Place any unpurchased cards into their discard piles."] }
        ]} />
      ) : isFlyingSolo ? (
        <SpecialRuleBlock source="setupCard" title="Flying Solo" content={[
          { type: 'paragraph', content: ['After priming, you may ', { type: 'strong', content: 'spend up to $1000' }, ' to buy ', { type: 'strong', content: 'up to 4 Supply Cards' }, ' that were revealed.'] },
          { type: 'paragraph', content: ['Discounts from special abilities apply. ', { type: 'strong', content: 'Replace any purchased cards.' }] }
        ]} />
      ) : null}


      {!isFlyingSolo && !isCampaign && soloCrewDraft && (
        <SpecialRuleBlock source="story" title="Solo Crew Recruitment" content={[
            { type: 'paragraph', content: ['After priming, you may purchase ', { type: 'strong', content: 'up to 4 Crew or Gear cards' }, ' from the ', { type: 'strong', content: 'discard piles' }, ' of any ', { type: 'strong', content: 'single Supply Deck' }, '.'] },
            { type: 'paragraph', content: ['The total cost of these items must not exceed ', { type: 'strong', content: '$1000' }, '.'] }
        ]} />
      )}
    </div>
  );
};