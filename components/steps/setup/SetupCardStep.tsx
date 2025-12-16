
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { GameState } from '../../../types';
import { SETUP_CARDS } from '../../../constants';
import { Button } from '../../Button';
import { ExpansionIcon } from '../../ExpansionIcon';
import { useTheme } from '../../ThemeContext';

interface SetupCardStepProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBack: () => void;
  onNext: () => void;
}

export const SetupCardStep: React.FC<SetupCardStepProps> = ({ gameState, setGameState, onBack, onNext }) => {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;
  
  const isFlyingSoloActive = gameState.setupCardId === 'FlyingSolo';
  const isFlyingSoloEligible = isSolo && has10th;

  const flyingSoloCard = useMemo(() => SETUP_CARDS.find(c => c.id === 'FlyingSolo'), []);

  const availableSetups = useMemo(() => SETUP_CARDS.filter(setup => {
    if (setup.requiredExpansion && !gameState.expansions[setup.requiredExpansion]) return false;
    if (setup.id === 'FlyingSolo') return false;
    if (!isSolo && setup.mode === 'solo') return false;
    return true;
  }), [gameState.expansions, isSolo]);

  const handleSetupCardSelect = useCallback((id: string, label: string) => {
    setGameState(prev => {
        const currentIsFlyingSolo = prev.setupCardId === 'FlyingSolo';
        return {
            ...prev,
            setupCardId: currentIsFlyingSolo ? 'FlyingSolo' : id,
            setupCardName: currentIsFlyingSolo ? 'FlyingSolo' : label,
            secondarySetupId: currentIsFlyingSolo ? id : undefined
        };
    });
  }, [setGameState]);

  const toggleFlyingSolo = () => {
      setGameState(prev => {
          const currentIsFlyingSolo = prev.setupCardId === 'FlyingSolo';
          const firstAvailable = availableSetups[0];
          const defaultId = firstAvailable?.id || 'Standard';
          const defaultLabel = firstAvailable?.label || 'Standard Game Setup';

          if (currentIsFlyingSolo) {
              const newId = prev.secondarySetupId || defaultId;
              const newDef = SETUP_CARDS.find(c => c.id === newId);
              return {
                  ...prev,
                  setupCardId: newId,
                  setupCardName: newDef?.label || defaultLabel,
                  secondarySetupId: undefined
              };
          } else {
              const currentIsValid = availableSetups.some(c => c.id === prev.setupCardId);
              return {
                  ...prev,
                  setupCardId: 'FlyingSolo',
                  setupCardName: 'Flying Solo',
                  secondarySetupId: currentIsValid ? prev.setupCardId : defaultId
              };
          }
      });
  };

  useEffect(() => {
      if (!isFlyingSoloActive && (!gameState.setupCardId || gameState.setupCardId === 'FlyingSolo')) {
           const defaultCard = availableSetups[0];
           if (defaultCard) handleSetupCardSelect(defaultCard.id, defaultCard.label);
      }
  }, [isFlyingSoloActive, gameState.setupCardId, availableSetups, handleSetupCardSelect]);

  useEffect(() => {
    if (selectedRef.current) {
      setTimeout(() => {
        selectedRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [gameState.setupCardId, gameState.secondarySetupId]);

  const containerBorder = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const fsBannerBg = isDark 
     ? (isFlyingSoloActive ? 'bg-indigo-900/30 border-indigo-800' : 'bg-zinc-800/40 border-zinc-700')
     : (isFlyingSoloActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200');
  const fsTitle = isDark 
     ? (isFlyingSoloActive ? 'text-indigo-300' : 'text-gray-400')
     : (isFlyingSoloActive ? 'text-indigo-900' : 'text-gray-600');
  
  return (
    <div className={`bg-metal rounded-xl shadow-inner p-6 md:p-8 border ${containerBorder} relative overflow-hidden transition-all duration-300`}>
       <div className="mb-8 relative">
        {isFlyingSoloEligible && flyingSoloCard && (
           <div className={`mb-6 p-4 rounded-lg border-2 transition-colors duration-300 ${fsBannerBg} flex items-start gap-4 shadow-sm`}>
               <div className={`w-16 h-16 shrink-0 rounded overflow-hidden border shadow-sm transition-colors ${isFlyingSoloActive ? 'border-indigo-300 dark:border-indigo-700' : 'border-gray-300 dark:border-zinc-600 grayscale opacity-70'}`}>
                   <ExpansionIcon id="tenth" />
               </div>
               <div className="flex-1">
                   <div className="flex justify-between items-start">
                       <h3 className={`font-bold text-lg ${fsTitle}`}>Flying Solo (10th)</h3>
                       <div 
                         role="switch"
                         aria-checked={isFlyingSoloActive}
                         tabIndex={0}
                         onClick={toggleFlyingSolo}
                         className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ease-in-out flex items-center cursor-pointer ${isFlyingSoloActive ? 'bg-indigo-600' : 'bg-gray-300 dark:bg-zinc-600'}`}
                         onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFlyingSolo()}
                       >
                         <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform duration-300 ${isFlyingSoloActive ? 'translate-x-6' : 'translate-x-0'}`} />
                       </div>
                   </div>
                   <div className={`transition-opacity duration-300 ${isFlyingSoloActive ? 'opacity-100' : 'opacity-60 grayscale'}`}>
                       <p className={`text-sm mt-1 ${isDark ? 'text-indigo-200/70' : 'text-indigo-700'}`}>{flyingSoloCard.description}</p>
                       {isFlyingSoloActive && (
                           <p className="text-xs mt-2 font-bold opacity-80 uppercase tracking-wide">▼ Select your Board Setup below to pair with Flying Solo</p>
                       )}
                   </div>
                   {!isFlyingSoloActive && (
                       <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 italic">Toggle ON to use the automated solo rules.</p>
                   )}
               </div>
           </div>
        )}

        <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${isDark ? 'text-zinc-400' : 'text-[#78350f]'}`}>
            {isFlyingSoloActive ? 'Available Board Setups' : 'Available Setup Cards'}
        </label>
        
        <div className={`w-full border ${containerBorder} rounded-lg shadow-sm ${isDark ? 'bg-black/40' : 'bg-[#f5f5f4]'} overflow-hidden flex flex-col`}>
          {availableSetups.map(opt => {
            const isSelected = isFlyingSoloActive ? gameState.secondarySetupId === opt.id : gameState.setupCardId === opt.id;
            const itemBg = isSelected ? (isDark ? 'bg-emerald-900/30' : 'bg-[#fff1f2]') : (isDark ? 'bg-zinc-900/40' : 'bg-[#faf8ef]');
            const itemBorder = isSelected ? (isDark ? 'border-emerald-800' : 'border-[#7f1d1d]') : (isDark ? 'border-zinc-800/50' : 'border-[#e7e5e4]');
            const iconBg = isSelected ? (isDark ? 'bg-emerald-900/40 border-emerald-800' : 'bg-[#fee2e2] border-[#7f1d1d]') : (isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#e7e5e4] border-[#d6cbb0]');

            return (
              <button 
                key={opt.id}
                ref={isSelected ? selectedRef : null}
                type="button"
                onClick={() => handleSetupCardSelect(opt.id, opt.label)}
                className={`flex items-stretch text-left cursor-pointer border-b last:border-0 transition-all duration-200 focus:outline-none focus:z-10 focus:ring-inset focus:ring-2 focus:ring-[#d4af37] ${itemBg} ${itemBorder} ${!isSelected ? (isDark ? 'hover:bg-zinc-800' : 'hover:bg-[#f5f5f4]') : ''}`}
                aria-pressed={isSelected}
              >
                 <div className={`w-16 flex items-center justify-center border-r p-2 shrink-0 ${iconBg}`}>
                    <div className={`w-10 h-10 rounded overflow-hidden shadow-sm border ${isDark ? 'border-zinc-600' : 'border-[#d6cbb0]'}`}>
                         <ExpansionIcon id={opt.iconOverride || opt.requiredExpansion || 'base'} />
                    </div>
                 </div>
                 <div className="flex-1 p-4 flex flex-col justify-center relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'} ${isSelected ? (isDark ? 'text-emerald-400' : 'text-[#7f1d1d]') : (isDark ? 'text-gray-300' : 'text-[#292524]')}`}>
                          {opt.label}
                      </span>
                      {isSelected && <span className={`${isDark ? 'text-emerald-400' : 'text-[#7f1d1d]'} font-bold text-xl`}>✓</span>}
                    </div>
                    {opt.description && (
                      <p className={`text-sm ${isSelected ? (isDark ? 'text-emerald-200/70' : 'text-[#991b1b]') : (isDark ? 'text-zinc-400' : 'text-[#57534e]')} line-clamp-2`}>
                        {opt.description}
                      </p>
                    )}
                 </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4 mt-8 pt-6 border-t border-dashed border-gray-300 dark:border-zinc-700">
        <Button onClick={onBack} variant="secondary" className="w-1/3">
          ← Back
        </Button>
        <Button onClick={onNext} fullWidth className="w-2/3 text-lg py-4 border-b-4 border-[#450a0a]">
          Next →
        </Button>
      </div>
    </div>
  );
};
