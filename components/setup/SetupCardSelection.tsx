import React, { useMemo, useCallback, useEffect } from 'react';
import { SETUP_CARD_IDS } from '../../data/ids';
import { useTheme } from '../ThemeContext';
import { useGameState } from '../../hooks/useGameState';
import { ActionType } from '../../state/actions';
import { getAvailableSetupCards, getSetupCardById } from '../../utils/selectors/story';
import { FlyingSoloBanner } from './FlyingSoloBanner';
import { SetupCardList } from './SetupCardList';
import { getSetupCardSelectionInfo } from '../../utils/ui';
import { calculateSetupFlow } from '../../utils/flow';

interface SetupCardSelectionProps {
}

export const SetupCardSelection: React.FC<SetupCardSelectionProps> = () => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  
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
    dispatch({ type: ActionType.SET_SETUP_CARD, payload: { id, name: label } });
  }, [dispatch]);

  const toggleFlyingSolo = () => {
    dispatch({ type: ActionType.TOGGLE_FLYING_SOLO });
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

       <div className="mb-8 relative">
        <FlyingSoloBanner 
            isActive={isFlyingSoloActive}
            isEligible={isFlyingSoloEligible}
            cardDef={flyingSoloCard}
            onToggle={toggleFlyingSolo}
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