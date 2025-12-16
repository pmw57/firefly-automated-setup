
import React, { useState, useEffect } from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS } from '../constants';
import { SpecialRuleBlock } from './SpecialRuleBlock';
import { useTheme } from './ThemeContext';

interface PrimePumpStepProps {
  step: Step;
  gameState: GameState;
}

export const PrimePumpStep: React.FC<PrimePumpStepProps> = ({ step, gameState }) => {
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { soloCrewDraft } = activeStoryCard.setupConfig || {};
  const isFlyingSolo = gameState.setupCardId === 'FlyingSolo';
  const isSlayingTheDragon = activeStoryCard.title === "Slaying The Dragon";
  const { isCampaign } = gameState;
  
  // House Rule State
  const [useHouseRule, setUseHouseRule] = useState(() => {
    const saved = localStorage.getItem('firefly_setup_house_rule_prime4');
    return saved !== null ? JSON.parse(saved) : true;
  });

  useEffect(() => {
    localStorage.setItem('firefly_setup_house_rule_prime4', JSON.stringify(useHouseRule));
  }, [useHouseRule]);

  // Logic for Supply Deck Volume
  const supplyHeavyExpansions = ['kalidasa', 'pirates', 'breakin_atmo', 'still_flying'];
  const activeSupplyCount = supplyHeavyExpansions.filter(id => gameState.expansions[id as keyof typeof gameState.expansions]).length;
  const isHighSupplyVolume = activeSupplyCount >= 3;

  // 1. Determine Base Discard Count
  const baseDiscard = (isHighSupplyVolume && useHouseRule) ? 4 : 3;

  // 2. Determine Multiplier
  // "The Blitz" setup card enforces "Double Dip" rules (x2).
  // Story cards might also have a multiplier.
  const isBlitz = overrides.blitzPrimeMode;
  const storyMultiplier = activeStoryCard.setupConfig?.primingMultiplier || 1;
  
  let effectiveMultiplier = storyMultiplier;
  if (isBlitz) {
      effectiveMultiplier = 2;
  }

  // 3. Calculate Final Count
  let finalCount = baseDiscard * effectiveMultiplier;
  
  // Apply Slaying The Dragon modifier (+2 cards)
  if (isSlayingTheDragon) {
      finalCount += 2;
  }

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

  // Toggle Theme
  const toggleBgOff = isDark ? 'bg-zinc-700' : 'bg-[#d6cbb0]';
  const toggleBgOn = isDark ? 'bg-green-700' : 'bg-[#7f1d1d]';
  const hrBorder = isDark ? 'border-amber-700/50' : 'border-[#d6cbb0]';
  const hrBg = isDark ? 'bg-amber-900/10' : 'bg-[#fffbeb]';

  return (
    <div className="space-y-4">
      
      {isHighSupplyVolume && (
         <div className={`p-4 rounded-lg border border-dashed ${hrBorder} ${hrBg} mb-4 transition-colors`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <span className="text-xl mr-2">🏠</span>
                    <span className={`font-bold text-sm uppercase tracking-wide ${isDark ? 'text-amber-500' : 'text-[#92400e]'}`}>
                        House Rule: High Volume Supply
                    </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={useHouseRule} 
                    onChange={(e) => setUseHouseRule(e.target.checked)} 
                  />
                  <div className={`w-11 h-6 rounded-full peer peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500 dark:peer-focus:ring-amber-800 ${useHouseRule ? toggleBgOn : toggleBgOff} after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:after:translate-x-full peer-checked:after:border-white`}></div>
                </label>
            </div>
            <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-[#78350f]'}`}>
               {useHouseRule ? (
                   <>
                     Due to the number of large expansions active ({activeSupplyCount}), the Supply Decks are massive. 
                     <strong> Base priming is increased to 4 cards</strong> to ensure turnover.
                     {effectiveMultiplier > 1 && <span> Multipliers (Blitz/Story) apply to this new base.</span>}
                   </>
               ) : (
                   <>
                     House rule disabled. Priming remains at standard 3 cards despite large supply decks.
                   </>
               )}
            </p>
         </div>
      )}

      {isBlitz && (
        <SpecialRuleBlock source="setupCard" title="Setup Card Override">
          <strong>The Blitz:</strong> "Double Dip" rules are in effect. Discard the top <strong>{baseDiscard * effectiveMultiplier} cards</strong> (2x Base) from each deck.
        </SpecialRuleBlock>
      )}

      {storyMultiplier > 1 && !isBlitz && (
        <SpecialRuleBlock source="story" title="Story Override">
          <strong>{activeStoryCard.title}:</strong> Prime counts are increased by {storyMultiplier}x.
        </SpecialRuleBlock>
      )}

      {isSlayingTheDragon && (
        <SpecialRuleBlock source="story" title="Slaying The Dragon">
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