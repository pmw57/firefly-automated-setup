import React, { useEffect, useRef } from 'react';
import { GameState } from '../types';
import { SETUP_CARDS } from '../constants';
import { Button } from './Button';
import { getExpansionIcon } from './iconHelpers';

interface SetupCardSelectionProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  onBack: () => void;
  onStart: () => void;
}

export const SetupCardSelection: React.FC<SetupCardSelectionProps> = ({ gameState, setGameState, onBack, onStart }) => {
  const selectedRef = useRef<HTMLButtonElement>(null);

  const availableSetups = SETUP_CARDS.filter(setup => {
    if (!setup.requiredExpansion) return true;
    return gameState.expansions[setup.requiredExpansion];
  });

  const handleSetupCardSelect = (id: string, label: string) => {
    setGameState(prev => ({
      ...prev,
      scenarioValue: id,
      scenarioName: label
    }));
  };

  // Scroll to selected item on mount with custom 1s animation
  useEffect(() => {
    if (selectedRef.current) {
      setTimeout(() => {
        const element = selectedRef.current;
        if (!element) return;

        const rect = element.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const elementTop = rect.top + scrollTop;
        const viewportHeight = window.innerHeight;
        
        // Calculate target position to center the element
        const targetScrollTop = elementTop - (viewportHeight / 2) + (rect.height / 2);
        
        const startScrollTop = scrollTop;
        const distance = targetScrollTop - startScrollTop;
        const duration = 1000; // 1 second
        let startTime: number | null = null;

        // Easing function: easeInOutQuad
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

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-gray-200 animate-fade-in">
       <div className="flex justify-between items-center mb-6 border-b pb-2">
           <h2 className="text-2xl font-bold text-gray-800 font-western">Select Setup Card</h2>
           <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-1 rounded">Part 2 of 2</span>
        </div>

       <div className="mb-8 relative">
        <label className="block font-bold text-gray-700 mb-2 uppercase tracking-wide text-xs">Available Setup Cards</label>
        
        <div className="w-full border border-gray-200 rounded-lg shadow-sm bg-white overflow-hidden flex flex-col">
          {availableSetups.map(opt => {
            const isSelected = gameState.scenarioValue === opt.id;
            return (
              <button 
                key={opt.id}
                ref={isSelected ? selectedRef : null}
                type="button"
                onClick={() => handleSetupCardSelect(opt.id, opt.label)}
                className={`flex items-stretch text-left cursor-pointer border-b border-gray-100 last:border-0 transition-colors focus:outline-none focus:bg-green-50 focus:z-10 focus:ring-inset focus:ring-2 focus:ring-green-500 ${isSelected ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                aria-pressed={isSelected}
              >
                 <div className={`w-16 flex items-center justify-center border-r border-gray-100 p-2 shrink-0 ${isSelected ? 'bg-green-100/50' : 'bg-gray-50/50'}`}>
                    {(opt.iconOverride || opt.requiredExpansion) ? (
                       <div className="w-10 h-10 rounded overflow-hidden shadow-sm border border-gray-300">
                         {getExpansionIcon(opt.iconOverride || opt.requiredExpansion)}
                       </div>
                    ) : (
                       <div className="w-10 h-10 rounded bg-white flex items-center justify-center border border-gray-300 text-gray-400 font-bold text-sm">
                         —
                       </div>
                    )}
                 </div>

                 <div className="flex-1 p-4 flex flex-col justify-center relative">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-lg ${isSelected ? 'font-bold text-green-900' : 'font-medium text-gray-800'}`}>
                          {opt.label}
                      </span>
                      {isSelected && <span className="text-green-600 font-bold text-xl">✓</span>}
                    </div>
                    {opt.description && (
                      <p className={`text-sm ${isSelected ? 'text-green-800' : 'text-gray-500'} line-clamp-2`}>
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
        <Button onClick={onStart} fullWidth className="w-2/3 text-xl py-4 shadow-xl border-b-4 border-green-900 hover:translate-y-[-2px]">
          Launch Setup Sequence
        </Button>
      </div>
    </div>
  );
};