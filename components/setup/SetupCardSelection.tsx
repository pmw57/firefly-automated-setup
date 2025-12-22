import React, { useMemo, useCallback } from 'react';
import { SETUP_CARD_IDS } from '../../data/ids';
import { Button } from '../Button';
import { useTheme } from '../ThemeContext';
import { useGameState } from '../../hooks/useGameState';
import { ActionType } from '../../state/actions';
// FIX: 'getAvailableSetupCards' is exported from the 'story' selector module, not 'setup'.
import { getAvailableSetupCards, getSetupCardById } from '../../utils/selectors/story';
import { FlyingSoloBanner } from './FlyingSoloBanner';
import { SetupCardList } from './SetupCardList';

interface SetupCardSelectionProps {
  onNext: () => void;
  onBack: () => void;
}

export const SetupCardSelection: React.FC<SetupCardSelectionProps> = ({ onNext, onBack }) => {
  const { state: gameState, dispatch } = useGameState();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;
  
  const isFlyingSoloActive = useMemo(() => {
    const cardDef = getSetupCardById(gameState.setupCardId);
    return !!cardDef?.isCombinable;
  }, [gameState.setupCardId]);

  const totalParts = (isFlyingSoloActive || has10th) ? 3 : 2;
  const isFlyingSoloEligible = isSolo && has10th;

  // Retrieve the Flying Solo card definition via selector
  const flyingSoloCard = useMemo(() => getSetupCardById(SETUP_CARD_IDS.FLYING_SOLO), []);

  // Use selector to get the list of available setup cards
  const availableSetups = useMemo(() => 
    getAvailableSetupCards(gameState), 
  [gameState]);

  const handleSetupCardSelect = useCallback((id: string, label: string) => {
    dispatch({ type: ActionType.SET_SETUP_CARD, payload: { id, name: label } });
  }, [dispatch]);

  const toggleFlyingSolo = () => {
    dispatch({ type: ActionType.TOGGLE_FLYING_SOLO });
  };

  const containerBg = isDark ? 'bg-black/60 backdrop-blur-sm' : 'bg-[#faf8ef]/80 backdrop-blur-sm';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const badgeClass = isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-[#e6ddc5] text-[#7f1d1d] border-[#d6cbb0]';
  const showOptionalRules = isFlyingSoloActive || has10th;

  const isNextDisabled = isFlyingSoloActive ? !gameState.secondarySetupId : !gameState.setupCardId;

  return (
    <div className={`${containerBg} rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
       <div className={`flex justify-between items-center mb-6 border-b ${containerBorder} pb-2`}>
           <h2 className={`text-2xl font-bold font-western ${headerColor}`}>Select Setup Card</h2>
           <span className={`text-xs font-bold ${badgeClass} border px-2 py-1 rounded`}>Part 2 of {totalParts}</span>
        </div>

       <div className="mb-8 relative">
        <FlyingSoloBanner 
            isActive={isFlyingSoloActive}
            isEligible={!!isFlyingSoloEligible}
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

      <div className="flex gap-4">
        <Button onClick={onBack} variant="secondary" className="w-1/3">
          ← Back
        </Button>
        <Button 
          onClick={onNext} 
          fullWidth 
          className="w-2/3 text-xl py-4 border-b-4 border-[#450a0a]"
          disabled={isNextDisabled}
        >
          {showOptionalRules ? "Next: Optional Rules →" : "Launch Setup Sequence"}
        </Button>
      </div>
    </div>
  );
};
