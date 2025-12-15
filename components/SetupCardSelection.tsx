
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { GameState } from '../types';
import { SETUP_CARDS } from '../constants';
import { Button } from './Button';
import { ExpansionIcon } from './ExpansionIcon';
import { useTheme } from './ThemeContext';

interface SetupCardSelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBack: () => void;
  onStart: () => void;
}

export const SetupCardSelection: React.FC<SetupCardSelectionProps> = ({ gameState, setGameState, onBack, onStart }) => {
  const selectedRef = useRef<HTMLButtonElement>(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const isSolo = gameState.gameMode === 'solo';
  const has10th = gameState.expansions.tenth;
  
  // Eligibility: Must be Solo and have 10th Anniversary
  const isFlyingSoloEligible = isSolo && has10th;
  
  // Active State: Is the main setup card currently Flying Solo?
  const isFlyingSoloActive = gameState.setupCardId === 'FlyingSolo';

  // Retrieve the Flying Solo card definition for the header
  const flyingSoloCard = SETUP_CARDS.find(c => c.id === 'FlyingSolo');

  // Memoize available setups to prevent unnecessary re-renders or effect triggers
  const availableSetups = useMemo(() => SETUP_CARDS.filter(setup => {
    // 1. Check expansion requirements
    if (setup.requiredExpansion && !gameState.expansions[setup.requiredExpansion]) {
      return false;
    }

    // 2. Filter out Flying Solo from the list (it's handled via toggle in 10th Solo, or hidden in others)
    if (setup.id === 'FlyingSolo') {
        return false;
    }

    // 3. Multiplayer/Solo logic
    if (!isSolo) {
      // Multiplayer: Hide Solo-only cards
      if (setup.mode === 'solo') {
        return false;
      }
    }
    
    return true;
  }), [gameState.expansions, isSolo]);

  const handleSetupCardSelect = useCallback((id: string, label: string) => {
    setGameState(prev => {
        // Determine mode based on previous state to keep callback stable
        const currentIsFlyingSolo = prev.setupCardId === 'FlyingSolo';

        if (currentIsFlyingSolo) {
            // In 10th Solo Mode: The main card is Flying Solo, we are selecting the secondary
            return {
                ...prev,
                setupCardId: 'FlyingSolo',
                setupCardName: 'Flying Solo',
                secondarySetupId: id
            };
        } else {
            // Standard Mode: The selected card is the main card
            return {
                ...prev,
                setupCardId: id,
                setupCardName: label,
                secondarySetupId: undefined
            };
        }
    });
  }, [setGameState]);

  const toggleFlyingSolo = () => {
      setGameState(prev => {
          // Calculate based on current state to ensure correctness
          const currentIsFlyingSolo = prev.setupCardId === 'FlyingSolo';
          
          if (currentIsFlyingSolo) {
              // Disable Flying Solo -> Revert to Standard logic
              // Use the current secondary selection as main if valid, else first available
              const newMainId = prev.secondarySetupId || availableSetups[0]?.id || 'Standard';
              const newMainDef = SETUP_CARDS.find(c => c.id === newMainId);
              return {
                  ...prev,
                  setupCardId: newMainId,
                  setupCardName: newMainDef?.label || 'Standard Game Setup',
                  secondarySetupId: undefined
              };
          } else {
              // Enable Flying Solo
              // Use current main selection as secondary if valid, else first available
              const secondaryId = availableSetups.some(c => c.id === prev.setupCardId) ? prev.setupCardId : (availableSetups[0]?.id || 'Standard');
              return {
                  ...prev,
                  setupCardId: 'FlyingSolo',
                  setupCardName: 'Flying Solo',
                  secondarySetupId: secondaryId
              };
          }
      });
  };

  // Default to Enabled on Mount if Eligible
  useEffect(() => {
      if (isFlyingSoloEligible && !isFlyingSoloActive) {
           // Check if we entered this step with a non-FlyingSolo card (e.g. Standard).
           // Since user requested "starting as being enabled by default", we enforce it here.
           // To avoid overriding deliberate user choice during navigation within the app if we persist state more aggressively later, 
           // this effect assumes mounting means "entering the step".
           
           // We use the setter callback to ensure we have latest state if needed, though deps handle it.
           setGameState(prev => {
               // Only switch if not already correct (extra safety)
               if (prev.setupCardId === 'FlyingSolo') return prev;
               
               const secondaryId = availableSetups.some(c => c.id === prev.setupCardId) ? prev.setupCardId : (availableSetups[0]?.id || 'Standard');
               return {
                   ...prev,
                   setupCardId: 'FlyingSolo',
                   setupCardName: 'Flying Solo',
                   secondarySetupId: secondaryId
               };
           });
      }
      
      // Also ensure we have a valid selection if NOT in Flying Solo mode (e.g. coming from multiplayer)
      if (!isFlyingSoloEligible && (!gameState.setupCardId || gameState.setupCardId === 'FlyingSolo')) {
           const defaultCard = availableSetups[0] || SETUP_CARDS[0];
           handleSetupCardSelect(defaultCard.id, defaultCard.label);
      }
  }, [isFlyingSoloEligible, isFlyingSoloActive, setGameState, availableSetups, gameState.setupCardId, handleSetupCardSelect]); 

  // Auto-select first available secondary if in Flying Solo mode but none selected
  useEffect(() => {
      if (isFlyingSoloActive && !gameState.secondarySetupId && availableSetups.length > 0) {
          handleSetupCardSelect(availableSetups[0].id, availableSetups[0].label);
      }
  }, [isFlyingSoloActive, gameState.secondarySetupId, availableSetups, handleSetupCardSelect]);

  // Scroll to selected item on mount/change
  useEffect(() => {
    if (selectedRef.current) {
      setTimeout(() => {
        const element = selectedRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        const viewportHeight = window.innerHeight;
        
        const targetScrollTop = elementTop - (viewportHeight / 2) + (rect.height / 2);
        
        const startScrollTop = scrollTop;
        const distance = targetScrollTop - startScrollTop;
        const duration = 1000;
        let startTime: number | null = null;

        const easeInOutQuad = (t: number) => {
          return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        };

        const animateScroll = (currentTime: number) => {
          if (startTime === null) startTime = currentTime;
          const timeElapsed = currentTime - startTime;
          const progress = Math.min(timeElapsed / duration, 1);
          const ease = easeInOutQuad(progress);

          window.scrollTo(0, startScrollTop + (distance * ease));

          if (timeElapsed < duration) {
            requestAnimationFrame(animateScroll);
          }
        };

        requestAnimationFrame(animateScroll);
      }, 100);
    }
  }, [gameState.setupCardId, gameState.secondarySetupId]);

  const headerColor = isDark ? 'text-amber-500' : 'text-[#292524]';
  const labelColor = isDark ? 'text-zinc-400' : 'text-[#78350f]';
  const containerBg = isDark ? 'bg-black/60' : 'bg-[#faf8ef]/95';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  const badgeClass = isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-[#e6ddc5] text-[#7f1d1d] border-[#d6cbb0]';
  const listBg = isDark ? 'bg-black/40' : 'bg-[#f5f5f4]';

  // Flying Solo Banner Styles
  const fsBannerBg = isDark 
     ? (isFlyingSoloActive ? 'bg-indigo-900/30 border-indigo-800' : 'bg-zinc-800/40 border-zinc-700')
     : (isFlyingSoloActive ? 'bg-indigo-50 border-indigo-200' : 'bg-gray-50 border-gray-200');
  
  const fsTitle = isDark 
     ? (isFlyingSoloActive ? 'text-indigo-300' : 'text-gray-400')
     : (isFlyingSoloActive ? 'text-indigo-900' : 'text-gray-600');
     
  const fsDesc = isDark ? 'text-indigo-200/70' : 'text-indigo-700';

  return (
    <div className={`${containerBg} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
       <div className={`flex justify-between items-center mb-6 border-b ${containerBorder} pb-2`}>
           <h2 className={`text-2xl font-bold font-western ${headerColor}`}>Select Setup Card</h2>
           <span className={`text-xs font-bold ${badgeClass} border px-2 py-1 rounded`}>Part 2 of 2</span>
        </div>

       <div className="mb-8 relative">
        
        {/* Flying Solo Toggle Banner */}
        {isFlyingSoloEligible && flyingSoloCard && (
           <div className={`mb-6 p-4 rounded-lg border-2 transition-colors duration-300 ${fsBannerBg} flex items-start gap-4 shadow-sm`}>
               <div className={`w-16 h-16 shrink-0 rounded overflow-hidden border shadow-sm transition-colors ${isFlyingSoloActive ? 'border-indigo-300 dark:border-indigo-700' : 'border-gray-300 dark:border-zinc-600 grayscale opacity-70'}`}>
                   <ExpansionIcon id="tenth" />
               </div>
               <div className="flex-1">
                   <div className="flex justify-between items-start">
                       <h3 className={`font-bold text-lg ${fsTitle}`}>Expanded Solo Mode (10th)</h3>
                       
                       {/* Toggle Switch */}
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
                       <p className={`text-sm mt-1 ${fsDesc}`}>{flyingSoloCard.description}</p>
                       {isFlyingSoloActive && (
                           <p className="text-xs mt-2 font-bold opacity-80 uppercase tracking-wide">▼ Select your Board Setup below to pair with Flying Solo</p>
                       )}
                   </div>
                   {!isFlyingSoloActive && (
                       <p className="text-xs mt-2 text-gray-500 dark:text-gray-400 italic">Toggle ON to use the new automated solo rules.</p>
                   )}
               </div>
           </div>
        )}

        <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>
            {isFlyingSoloActive ? 'Available Board Setups' : 'Available Setup Cards'}
        </label>
        
        <div className={`w-full border ${containerBorder} rounded-lg shadow-sm ${listBg} overflow-hidden flex flex-col`}>
          {availableSetups.map(opt => {
            // Selection logic differs based on mode
            const isSelected = isFlyingSoloActive 
                ? gameState.secondarySetupId === opt.id
                : gameState.setupCardId === opt.id;
            
            // Item Theme Logic
            const itemBg = isSelected 
                ? (isDark ? 'bg-emerald-900/30' : 'bg-[#fff1f2]')
                : (isDark ? 'bg-zinc-900/40' : 'bg-[#faf8ef]');
            
            const itemBorder = isSelected
                ? (isDark ? 'border-emerald-800' : 'border-[#7f1d1d]')
                : (isDark ? 'border-zinc-800/50' : 'border-[#e7e5e4]');

            const itemHover = !isSelected 
                ? (isDark ? 'hover:bg-zinc-800' : 'hover:bg-[#f5f5f4]') 
                : '';

            const iconContainerBg = isSelected
                ? (isDark ? 'bg-emerald-900/40 border-emerald-800' : 'bg-[#fee2e2] border-[#7f1d1d]')
                : (isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-[#e7e5e4] border-[#d6cbb0]');

            const iconBox = isDark ? 'bg-zinc-800 border-zinc-600 text-zinc-500' : 'bg-white border-[#d4d4d4] text-gray-400';
            const iconBorder = isDark ? 'border-zinc-600' : 'border-[#d6cbb0]';

            const titleColor = isSelected 
                ? (isDark ? 'text-emerald-400' : 'text-[#7f1d1d]') 
                : (isDark ? 'text-gray-300' : 'text-[#292524]');
            
            const descColor = isSelected
                ? (isDark ? 'text-emerald-200/70' : 'text-[#991b1b]')
                : (isDark ? 'text-zinc-400' : 'text-[#57534e]');

            const checkMarkColor = isDark ? 'text-emerald-400' : 'text-[#7f1d1d]';

            return (
              <button 
                key={opt.id}
                ref={isSelected ? selectedRef : null}
                type="button"
                onClick={() => handleSetupCardSelect(opt.id, opt.label)}
                className={`
                  flex items-stretch text-left cursor-pointer border-b last:border-0 transition-all duration-200 focus:outline-none focus:z-10 focus:ring-inset focus:ring-2 focus:ring-[#d4af37]
                  ${itemBg} ${itemBorder} ${itemHover}
                `}
                aria-pressed={isSelected}
              >
                 <div className={`
                   w-16 flex items-center justify-center border-r p-2 shrink-0 ${iconContainerBg}
                 `}>
                    {(opt.iconOverride || opt.requiredExpansion) ? (
                       <div className={`w-10 h-10 rounded overflow-hidden shadow-sm border ${iconBorder}`}>
                         <ExpansionIcon id={opt.iconOverride || opt.requiredExpansion || ''} />
                       </div>
                    ) : (
                       <div className={`w-10 h-10 rounded flex items-center justify-center border font-bold text-sm ${iconBox}`}>
                         —
                       </div>
                    )}
                 </div>

                 <div className="flex-1 p-4 flex flex-col justify-center relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-lg ${isSelected ? 'font-bold' : 'font-medium'} ${titleColor}`}>
                          {opt.label}
                      </span>
                      {isSelected && <span className={`${checkMarkColor} font-bold text-xl`}>✓</span>}
                    </div>
                    {opt.description && (
                      <p className={`text-sm ${descColor} line-clamp-2`}>
                        {opt.description}
                      </p>
                    )}
                 </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex gap-4">
        <Button onClick={onBack} variant="secondary" className="w-1/3">
          ← Back
        </Button>
        <Button onClick={onStart} fullWidth className="w-2/3 text-xl py-4 border-b-4 border-[#450a0a]">
          Launch Setup Sequence
        </Button>
      </div>
    </div>
  );
};
