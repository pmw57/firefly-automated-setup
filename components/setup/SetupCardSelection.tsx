import React, { useMemo, useCallback, useEffect } from 'react';
import { SETUP_CARD_IDS } from '../../data/ids';
import { useTheme } from '../ThemeContext';
import { useGameState } from '../../hooks/useGameState';
// FIX: Import `useGameDispatch` to correctly dispatch actions to the game state reducer.
import { useGameDispatch } from '../../hooks/useGameDispatch';
import { getActiveStoryCard, getAvailableSetupCards, getSetupCardById } from '../../utils/selectors/story';
import { FlyingSoloBanner } from './FlyingSoloBanner';
import { SetupCardList } from './SetupCardList';
import { getSetupCardSelectionInfo } from '../../utils/selectors/ui';
import { calculateSetupFlow } from '../../utils/flow';
import { OverrideNotificationBlock } from '../SpecialRuleBlock';
import { getResolvedRules } from '../../utils/selectors/rules';
import { AddSpecialRule } from '../../types';

interface SetupCardSelectionProps {
}

export const SetupCardSelection: React.FC<SetupCardSelectionProps> = () => {
  // FIX: Destructure only the relevant state properties from `useGameState`.
  const { state: gameState } = useGameState();
  // FIX: Get the dispatch function and action creators from `useGameDispatch`.
  const { setSetupCard, toggleFlyingSolo, riversRunConfirmSetup } = useGameDispatch();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
  const activeStoryCard = useMemo(() => getActiveStoryCard(gameState), [gameState]);

  const allRules = useMemo(() => getResolvedRules(gameState), [gameState]);
  const setupSelectionRules = useMemo(() => {
    return allRules
      .filter((r): r is AddSpecialRule => r.type === 'addSpecialRule' && r.category === 'setup_selection')
      .map(r => ({ ...r.rule, source: r.source as 'story' | 'setupCard' | 'expansion' | 'warning' | 'info' }));
  }, [allRules]);
  
  const totalParts = useMemo(() => calculateSetupFlow(gameState).filter(s => s.type === 'setup').length, [gameState]);

  const {
    isFlyingSoloActive,
    isFlyingSoloEligible,
  } = useMemo(() => getSetupCardSelectionInfo(gameState), [gameState]);

  const flyingSoloCard = useMemo(() => getSetupCardById(SETUP_CARD_IDS.FLYING_SOLO), []);

  const availableSetups = useMemo(() => 
    getAvailableSetupCards(gameState), 
  [gameState]);

  const handleSetupCardSelect = useCallback((id: string, label: string) => {
    setSetupCard(id, label);
  }, [setSetupCard]);

  const handleToggleFlyingSolo = () => {
    toggleFlyingSolo();
  };
  
  // Auto-select the first available setup card if none is selected
  useEffect(() => {
    const shouldAutoSelect = isFlyingSoloActive
      ? !gameState.secondarySetupId
      : !gameState.setupCardId;

    if (shouldAutoSelect && availableSetups.length > 0) {
      const firstCard = availableSetups[0];
      handleSetupCardSelect(firstCard.id, firstCard.label);
    }
  }, [availableSetups, isFlyingSoloActive, gameState.setupCardId, gameState.secondarySetupId, handleSetupCardSelect]);
  
  // Effect for River's Run 1v1 confirmation
  useEffect(() => {
    if (activeStoryCard?.title === "River's Run 1v1") {
      riversRunConfirmSetup();
    }
  }, [activeStoryCard, riversRunConfirmSetup]);


  const containerBg = isDark ? 'bg-black/60 backdrop-blur-sm' : 'bg-[#faf8ef]/80 backdrop-blur-sm';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const badgeClass = isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-[#e6ddc5] text-[#7f1d1d] border-[#d6cbb0]';
  
  return (
    <div className={`${containerBg} rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
       <div className={`flex justify-between items-center mb-6 border-b ${containerBorder} pb-2`}>
           <h2 className={`text-2xl font-bold font-western ${headerColor}`}>Select Setup Card</h2>
           <span className={`text-xs font-bold ${badgeClass} border px-2 py-1 rounded`}>Part 2 of {totalParts}</span>
        </div>

        {setupSelectionRules.length > 0 && (
          <div className="mb-6 space-y-4">
            {setupSelectionRules.map((rule, i) => (
              <OverrideNotificationBlock key={i} {...rule} />
            ))}
          </div>
        )}

       <div className="mb-8 relative">
        <FlyingSoloBanner 
            isActive={isFlyingSoloActive}
            isEligible={isFlyingSoloEligible}
            cardDef={flyingSoloCard}
            onToggle={handleToggleFlyingSolo}
        />

        <SetupCardList 
            cards={availableSetups}
            selectedId={isFlyingSoloActive ? (gameState.secondarySetupId as string) : (gameState.setupCardId as string)}
            isFlyingSoloActive={isFlyingSoloActive}
            onSelect={handleSetupCardSelect}
        />
      </div>
    </div>
  );
};