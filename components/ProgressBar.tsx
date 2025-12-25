

import React, { useRef, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { Step } from '../types';
import { STEP_IDS } from '../data/ids';
import { cls } from '../utils/style';

interface ProgressBarProps {
  flow: Step[];
  currentIndex: number;
  onJump: (index: number) => void;
  setupDetermined: boolean;
}

const getStepLabel = (step: Step): string => {
  switch (step.id) {
    case STEP_IDS.SETUP_CAPTAIN_EXPANSIONS: return 'Crew';
    case STEP_IDS.SETUP_CARD_SELECTION: return 'Setup';
    case STEP_IDS.SETUP_OPTIONAL_RULES: return 'Rules';
    case STEP_IDS.C1: return 'Nav';
    case STEP_IDS.C2: return 'Ships';
    case STEP_IDS.C3: return 'Draft';
    case STEP_IDS.D_HAVEN_DRAFT: return 'Havens';
    case STEP_IDS.C4: return 'Goal';
    case STEP_IDS.D_FIRST_GOAL: return 'Goal';
    case STEP_IDS.C5: return 'Cash';
    case STEP_IDS.C6: return 'Jobs';
    case STEP_IDS.C_PRIME: return 'Prime';
    case STEP_IDS.D_GAME_LENGTH_TOKENS: return 'Timer';
    case STEP_IDS.FINAL: return 'Finish';
    default: return step.data?.title?.split(' ').pop() || '...';
  }
};

export const ProgressBar: React.FC<ProgressBarProps> = ({ flow, currentIndex, onJump, setupDetermined }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // Automatic scrolling logic
  useEffect(() => {
    const container = containerRef.current;
    const activeItem = itemsRef.current[currentIndex];

    if (container && activeItem) {
      const containerRect = container.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();

      // Check if item is off-screen to the right
      if (itemRect.right > containerRect.right) {
        container.scrollBy({
          left: container.clientWidth,
          behavior: 'smooth'
        });
      }
      // Check if item is off-screen to the left
      else if (itemRect.left < containerRect.left) {
        container.scrollBy({
          left: -container.clientWidth,
          behavior: 'smooth'
        });
      }
    }
  }, [currentIndex]);
  
  if (flow.length <= 1) return null;

  const totalSteps = flow.length;
  const progressPercentage = (currentIndex / (totalSteps - 1)) * 100;

  const trackBg = isDark ? 'bg-zinc-800' : 'bg-stone-200';
  const filledTrackBg = isDark ? 'bg-emerald-500' : 'bg-firefly-red';
  const nodeActiveBorder = isDark ? 'border-emerald-400' : 'border-firefly-red';
  const nodeCompletedBg = isDark ? 'bg-emerald-600' : 'bg-firefly-red-light';
  
  const labelActive = isDark ? 'text-emerald-400' : 'text-firefly-red font-bold';
  const labelCompleted = isDark ? 'text-zinc-300' : 'text-stone-700';
  const labelUpcoming = isDark ? 'text-zinc-600' : 'text-stone-400';

  return (
    <div className="w-full mb-10 mt-4 px-2">
      <div 
        ref={containerRef}
        className="relative w-full overflow-x-auto no-scrollbar pb-6 pt-8 snap-x snap-mandatory"
      >
        <div className="min-w-max flex justify-between relative px-[20px]" style={{ minWidth: (flow.length * 60) + 'px' }}>
          
          {/* Background Track - Positioned relative to node centers */}
          <div className={cls("absolute top-1/2 left-[20px] right-[20px] h-1 -translate-y-1/2 rounded-full z-0", trackBg)}></div>
          
          {/* Filled Progress Track - Clipped to width */}
          <div 
            className={cls("absolute top-1/2 left-[20px] right-[20px] h-1 -translate-y-1/2 rounded-full z-0 overflow-hidden pointer-events-none")}
          >
             <div 
               className={cls("h-full transition-all duration-500 ease-out", filledTrackBg)}
               style={{ width: `${progressPercentage}%` }}
             />
          </div>

          {/* Step Nodes */}
          {flow.map((step, index) => {
            const isCurrent = index === currentIndex;
            const isPast = index < currentIndex;
            const isDetermined = step.type === 'setup' || setupDetermined;
            const label = isDetermined ? getStepLabel(step) : '...';
            
            return (
              <div 
                key={step.id} 
                // FIX: A ref callback function should not return a value. Using a block statement ensures an implicit `undefined` return.
                ref={el => { itemsRef.current[index] = el; }}
                className="relative z-10 flex flex-col items-center group snap-center"
                style={{ width: '40px' }}
              >
                {/* The Label */}
                <button
                  onClick={() => isDetermined && onJump(index)}
                  className={cls(
                    "absolute -top-7 whitespace-nowrap text-[9px] uppercase font-bold tracking-tighter transition-all duration-300 transform",
                    isDetermined ? "group-hover:scale-110 cursor-pointer" : "cursor-not-allowed",
                    isCurrent ? labelActive : isPast ? labelCompleted : labelUpcoming
                  )}
                >
                  {label}
                </button>

                {/* The Node */}
                <button
                  onClick={() => isDetermined && onJump(index)}
                  aria-label={isDetermined ? `Jump to ${label} step` : 'Step not yet determined'}
                  className={cls(
                    "w-4 h-4 rounded-full border-2 transition-all duration-300 shadow-sm touch-manipulation",
                    isDetermined ? "cursor-pointer hover:scale-125" : "cursor-not-allowed",
                    isCurrent 
                      ? cls("bg-white ring-4 ring-opacity-20 scale-125", isDark ? "ring-emerald-400" : "ring-red-600", nodeActiveBorder)
                      : isPast 
                      ? cls(nodeCompletedBg, "border-transparent")
                      : cls(trackBg, "border-transparent")
                  )}
                >
                  {isPast && !isCurrent && (
                    <span className="text-[8px] text-white flex items-center justify-center leading-none">✓</span>
                  )}
                </button>

                {/* Progress Badge */}
                {isCurrent && (
                   <div className={cls("absolute -bottom-5 text-[8px] font-mono", isDark ? 'text-zinc-500' : 'text-stone-400')}>
                      {index + 1}/{totalSteps}
                   </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
