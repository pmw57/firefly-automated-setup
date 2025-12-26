

import React, { useRef, useEffect, useMemo } from 'react';
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

const getStepDisplay = (step: Step): { label: string; number?: string } => {
  // Config steps
  if (step.type === 'setup') {
    let label = 'Config';
    if (step.id === STEP_IDS.SETUP_CAPTAIN_EXPANSIONS) label = 'Crew';
    if (step.id === STEP_IDS.SETUP_CARD_SELECTION) label = 'Setup';
    if (step.id === STEP_IDS.SETUP_OPTIONAL_RULES) label = 'Rules';
    return { label };
  }

  // Final step
  if (step.type === 'final') {
    return { label: 'Finish' };
  }

  // Core & Dynamic steps from Setup Cards
  const title = step.data?.title || '';
  const match = title.match(/^(\d+)\.\s+(.*)/);

  if (match) {
    const number = match[1];
    const textPart = match[2];
    
    const ABBREVIATIONS: Record<string, string> = {
      [STEP_IDS.C1]: 'Nav',
      [STEP_IDS.C2]: 'Ships',
      [STEP_IDS.C3]: 'Draft',
      [STEP_IDS.D_HAVEN_DRAFT]: 'Havens',
      [STEP_IDS.C4]: 'Goal',
      [STEP_IDS.D_FIRST_GOAL]: 'Goal',
      [STEP_IDS.C5]: 'Cash',
      [STEP_IDS.C6]: 'Jobs',
      [STEP_IDS.C_PRIME]: 'Prime',
      [STEP_IDS.D_GAME_LENGTH_TOKENS]: 'Timer',
      [STEP_IDS.D_RIM_JOBS]: 'Rim Jobs',
      [STEP_IDS.D_TIME_LIMIT]: 'Time Limit',
      [STEP_IDS.D_SHUTTLE]: 'Shuttles',
      [STEP_IDS.D_BC_CAPITOL]: 'Capitol',
      [STEP_IDS.D_LOCAL_HEROES]: 'Heroes',
      [STEP_IDS.D_ALLIANCE_ALERT]: 'Alerts',
      [STEP_IDS.D_PRESSURES_HIGH]: 'Pressure',
      [STEP_IDS.D_STRIP_MINING]: 'Mining',
    };
    const shortLabel = ABBREVIATIONS[step.id] || textPart.split(' ')[0];

    return { label: shortLabel, number };
  }

  // Fallback for any step without a number in its title
  return { label: title.split(' ').pop() || '...' };
};

const toRoman = (num: number): string => {
  if (num < 1 || num > 10) return String(num);
  const roman: { [key: number]: string } = {
    1: 'i', 2: 'ii', 3: 'iii', 4: 'iv', 5: 'v',
    6: 'vi', 7: 'vii', 8: 'viii', 9: 'ix', 10: 'x'
  };
  return roman[num];
};


export const ProgressBar: React.FC<ProgressBarProps> = ({ flow, currentIndex, onJump, setupDetermined }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLDivElement | null)[]>([]);

  // FIX: Hooks must be called unconditionally at the top level of the component.
  // Moved these useMemo calls before the early return to fix the error.
  const separatorIndex = useMemo(() => flow.findIndex(s => s.type !== 'setup'), [flow]);
  const finishIndex = useMemo(() => flow.findIndex(s => s.type === 'final'), [flow]);

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
  
  const configStepsCount = separatorIndex === -1 ? flow.length - 1 : separatorIndex;
  const effectiveFinishIndex = finishIndex === -1 ? flow.length : finishIndex;
  const setupStepsCount = configStepsCount > -1 ? effectiveFinishIndex - configStepsCount : 0;

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
            const isFirstMainStep = separatorIndex !== -1 && index === separatorIndex;
            
            const { label, number } = isDetermined ? getStepDisplay(step) : { label: '...', number: undefined };
            
            let badgeContent: string | null = null;
            if (isCurrent && step.type !== 'final') {
                if (separatorIndex === -1 || index < separatorIndex) {
                    // Config Phase
                    if (configStepsCount > 0) {
                        badgeContent = `${toRoman(index + 1)}`;
                    }
                } else {
                    // Setup Phase
                    if (setupStepsCount > 0) {
                        const currentSetupStep = index - configStepsCount + 1;
                        badgeContent = `${currentSetupStep}/${setupStepsCount}`;
                    }
                }
            }
            
            return (
              <div 
                key={step.id} 
                ref={el => { itemsRef.current[index] = el; }}
                className="relative z-10 flex flex-col items-center group snap-center"
                style={{ width: '40px' }}
              >
                {isFirstMainStep && (
                  <div 
                    className="absolute top-1/2 -left-2.5 h-6 w-px bg-stone-400 dark:bg-zinc-600 z-20 -translate-y-1/2"
                    aria-hidden="true"
                  />
                )}
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
                    "w-4 h-4 rounded-full border-2 transition-all duration-300 shadow-sm touch-manipulation flex items-center justify-center",
                    isDetermined ? "cursor-pointer hover:scale-125" : "cursor-not-allowed",
                    isCurrent 
                      ? cls("bg-white ring-4 ring-opacity-20 scale-125", isDark ? "ring-emerald-400" : "ring-red-600", nodeActiveBorder)
                      : isPast 
                      ? cls(nodeCompletedBg, "border-transparent")
                      : cls(trackBg, "border-transparent")
                  )}
                >
                  {isPast && !isCurrent ? (
                    <span className="text-[8px] text-white flex items-center justify-center leading-none">✓</span>
                  ) : number && !isPast ? (
                    <span className={cls(
                      "text-[8px] font-bold transition-colors",
                      isCurrent ? (isDark ? 'text-emerald-500' : 'text-firefly-red-dark') : (isDark ? 'text-zinc-500' : 'text-stone-500')
                    )}>
                      {number}
                    </span>
                  ) : null}
                </button>

                {/* Progress Badge */}
                {badgeContent && (
                   <div className={cls("absolute -bottom-5 text-[8px] font-mono", isDark ? 'text-zinc-500' : 'text-stone-400')}>
                      {badgeContent}
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