
import React, { useEffect, useRef } from 'react';
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

  const availableSetups = SETUP_CARDS.filter(setup => {
    if (!setup.requiredExpansion) return true;
    return gameState.expansions[setup.requiredExpansion];
  });

  const handleSetupCardSelect = (id: string, label: string) => {
    setGameState(prev => ({
      ...prev,
      setupCardId: id,
      setupCardName: label
    }));
  };

  // Scroll to selected item on mount
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
  }, []);

  const headerColor = isDark ? 'text-amber-500' : 'text-gray-900';
  const labelColor = isDark ? 'text-zinc-400' : 'text-gray-700';
  const containerBg = isDark ? 'bg-black/60' : 'bg-white/90';
  const containerBorder = isDark ? 'border-zinc-800' : 'border-gray-300';
  const badgeClass = isDark ? 'bg-emerald-900/40 text-emerald-300 border-emerald-800' : 'bg-emerald-100 text-emerald-900 border-emerald-300';
  const listBg = isDark ? 'bg-black/40' : 'bg-gray-50';

  return (
    <div className={`${containerBg} backdrop-blur-md rounded-xl shadow-xl p-6 md:p-8 border ${containerBorder} animate-fade-in transition-all duration-300`}>
       <div className={`flex justify-between items-center mb-6 border-b ${containerBorder} pb-2`}>
           <h2 className={`text-2xl font-bold font-western ${headerColor}`}>Select Setup Card</h2>
           <span className={`text-xs font-bold ${badgeClass} border px-2 py-1 rounded`}>Part 2 of 2</span>
        </div>

       <div className="mb-8 relative">
        <label className={`block font-bold mb-2 uppercase tracking-wide text-xs ${labelColor}`}>Available Setup Cards</label>
        
        <div className={`w-full border ${containerBorder} rounded-lg shadow-sm ${listBg} overflow-hidden flex flex-col`}>
          {availableSetups.map(opt => {
            const isSelected = gameState.setupCardId === opt.id;
            
            // Item Theme Logic
            const itemBg = isSelected 
                ? (isDark ? 'bg-emerald-900/30' : 'bg-emerald-100/50')
                : (isDark ? 'bg-zinc-900/40' : 'bg-white');
            
            const itemBorder = isSelected
                ? (isDark ? 'border-emerald-800' : 'border-emerald-200')
                : (isDark ? 'border-zinc-800/50' : 'border-gray-100');

            const itemHover = !isSelected 
                ? (isDark ? 'hover:bg-zinc-800' : 'hover:bg-gray-100') 
                : '';

            const iconContainerBg = isSelected
                ? (isDark ? 'bg-emerald-900/40 border-emerald-800' : 'bg-emerald-200/50 border-emerald-200')
                : (isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-gray-100 border-gray-100');

            const iconBox = isDark ? 'bg-zinc-800 border-zinc-600 text-zinc-500' : 'bg-white border-gray-300 text-gray-400';
            const iconBorder = isDark ? 'border-zinc-600' : 'border-gray-300';

            const titleColor = isSelected 
                ? (isDark ? 'text-emerald-400' : 'text-emerald-900') 
                : (isDark ? 'text-gray-300' : 'text-gray-900');
            
            const descColor = isSelected
                ? (isDark ? 'text-emerald-200/70' : 'text-emerald-800')
                : (isDark ? 'text-zinc-400' : 'text-gray-600');

            const checkMarkColor = isDark ? 'text-emerald-400' : 'text-emerald-700';

            return (
              <button 
                key={opt.id}
                ref={isSelected ? selectedRef : null}
                type="button"
                onClick={() => handleSetupCardSelect(opt.id, opt.label)}
                className={`
                  flex items-stretch text-left cursor-pointer border-b last:border-0 transition-all duration-200 focus:outline-none focus:z-10 focus:ring-inset focus:ring-2 focus:ring-emerald-500
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
        <Button onClick={onStart} fullWidth className="w-2/3 text-xl py-4">
          Launch Setup Sequence
        </Button>
      </div>
    </div>
  );
};
