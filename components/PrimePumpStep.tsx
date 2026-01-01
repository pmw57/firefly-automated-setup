import React from 'react';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { getPrimeDetails } from '../utils/prime';
import { StepComponentProps } from './StepContent';
import { SETUP_CARD_IDS } from '../data/ids';

export const PrimePumpStep: React.FC<StepComponentProps> = ({ step }) => {
  const { state: gameState } = useGameState();
  const overrides = React.useMemo(() => step.overrides || {}, [step.overrides]);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const isFlyingSolo = gameState.setupCardId === 'FlyingSolo';
  
  const {
    baseDiscard,
    effectiveMultiplier,
    finalCount,
    isHighSupplyVolume,
    isBlitz,
    specialRules,
  } = React.useMemo(() => 
    getPrimeDetails(gameState, overrides),
    [gameState, overrides]
  );
  
  // FIX: This rule block is specific to the "Solitaire Firefly" fan campaign.
  // The condition has been corrected to check for that specific setup card,
  // preventing it from incorrectly appearing for the "Flying Solo" continuity mode.
  const isSolitaireFirefly = gameState.setupCardId === SETUP_CARD_IDS.SOLITAIRE_FIREFLY;

  const cardBg = isDark ? 'bg-black/40 backdrop-blur-sm' : 'bg-[#faf8ef]/70 backdrop-blur-sm';
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

      {effectiveMultiplier > 1 && !isBlitz && (
        <SpecialRuleBlock source="story" title="Story Override" content={[{ type: 'strong', content: `Prime counts are increased by ${effectiveMultiplier}x.` }]} />
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
      
      {specialRules.map((rule, i) => (
        <SpecialRuleBlock key={i} {...rule} />
      ))}
      
      {isSolitaireFirefly ? (
        <SpecialRuleBlock source="story" title="Solitaire Firefly: Supplies" content={[
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
    </div>
  );
};
