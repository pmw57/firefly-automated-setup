import React, { useEffect, useMemo, useCallback } from 'react';
import { SETUP_CARDS } from '../data/setupCards';
import { SETUP_CARD_IDS } from '../data/ids';
import { EXPANSIONS_METADATA } from '../data/expansions';
import { Button } from './Button';
import { useTheme } from './ThemeContext';
import { useGameState } from '../hooks/useGameState';
import { ActionType } from '../state/actions';
import { FlyingSoloBanner } from './setup/FlyingSoloBanner';
import { SetupCardList } from './setup/SetupCardList';

// Fix: Add props interface to accept onNext and onBack handlers.
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
  
  const isFlyingSoloActive = gameState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
  const totalParts = (isFlyingSoloActive || has10th) ? 3 : 2;
  const isFlyingSoloEligible = isSolo && has10th;

  // Retrieve the Flying Solo card definition
  const flyingSoloCard = useMemo(() => SETUP_CARDS.find(c => c.id === SETUP_CARD_IDS.FLYING_SOLO), []);

  // Filter and Sort available setup cards based on current state and expansion metadata order
  const availableSetups = useMemo(() => {
    // Map expansion IDs to their index in the metadata for consistent sorting
    const expansionIndices = EXPANSIONS_METADATA.reduce((acc, exp, idx) => {
        (acc as Record<string, number>)[exp.id] = idx;
        return acc;
    }, {} as Record<string, number>);

    const stripThe = (str: string) => str.replace(/^The\s+/i, '');

    return SETUP_CARDS
        .filter(setup => {
            // 1. Expansion Check
            if (setup.requiredExpansion && !gameState.expansions[setup.requiredExpansion]) return false;
            // 2. Hide "Flying Solo" from main list (handled by banner toggle)
            if (setup.id === SETUP_CARD_IDS.FLYING_SOLO) return false;
            // 3. Mode Check (Multiplayer hides solo-only cards)
            if (!isSolo && setup.mode === 'solo') return false;
            
            return true;
        })
        .sort((a, b) => {
            // Base game cards (no requiredExpansion) get index -1 to stay at the very top
            const idxA = a.requiredExpansion ? (expansionIndices[a.requiredExpansion] ?? 999) : -1;
            const idxB = b.requiredExpansion ? (expansionIndices[b.requiredExpansion] ?? 999) : -1;
            
            if (idxA !== idxB) {
                return idxA - idxB;
            }
            
            // If both cards belong to the same expansion, sort alphabetically by label
            return stripThe(a.label).localeCompare(stripThe(b.label));
        });
  }, [gameState.expansions, isSolo]);

  const handleSetupCardSelect = useCallback((id: string, label: string) => {
    dispatch({ type: ActionType.SET_SETUP_CARD, payload: { id, name: label } });
  }, [dispatch]);

  const toggleFlyingSolo = () => {
    dispatch({ type: ActionType.TOGGLE_FLYING_SOLO });
  };

  // Initial Selection Guard: Ensure a valid selection exists when mounting
  useEffect(() => {
      if (!isFlyingSoloActive && (!gameState.setupCardId || gameState.setupCardId === SETUP_CARD_IDS.FLYING_SOLO)) {
           const defaultCard = availableSetups[0];
           if (defaultCard) handleSetupCardSelect(defaultCard.id, defaultCard.label);
      }
  }, [isFlyingSoloActive, gameState.setupCardId, availableSetups, handleSetupCardSelect]);

  const containerBg = isDark ? 'bg-black/60' : 'bg-[#faf8ef]/95';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const headerColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const badgeClass = isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-[#e6ddc5] text-[#7f1d1d] border-[#d6cbb0]';
  const showOptionalRules = isFlyingSoloActive || has10th;

  return (
    <div className={`${containerBg} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
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
        <Button onClick={onNext} fullWidth className="w-2/3 text-xl py-4 border-b-4 border-[#450a0a]">
          {showOptionalRules ? "Next: Optional Rules →" : "Launch Setup Sequence"}
        </Button>
      </div>
    </div>
  );
};
