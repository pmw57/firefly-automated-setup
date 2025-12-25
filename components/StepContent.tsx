
import React, { useRef, useEffect } from 'react';
import { Step } from '../types';
import { Button } from './Button';
import { QuotePanel } from './QuotePanel';
import { useTheme } from './ThemeContext';
import { STEP_IDS } from '../data/ids';
import { cls } from '../utils/style';
import { PageReference } from './PageReference';

// Core & Dynamic Steps
import { NavDeckStep } from './NavDeckStep';
import { AllianceReaverStep } from './AllianceReaverStep';
import { DraftStep } from './DraftStep';
import { MissionDossierStep } from './MissionDossierStep';
import { ResourcesStep } from './ResourcesStep';
import { JobStep } from './JobStep';
import { PrimePumpStep } from './PrimePumpStep';
import { GameLengthTokensStep } from './steps/dynamic/GameLengthTokensStep';
import { TimeLimitStep } from './steps/dynamic/TimeLimitStep';
import { ShuttleDraftStep } from './steps/dynamic/ShuttleDraftStep';
import { StartingCapitolStep } from './steps/dynamic/StartingCapitolStep';
import { LocalHeroesStep } from './steps/dynamic/LocalHeroesStep';
import { AllianceAlertStep } from './steps/dynamic/AllianceAlertStep';
import { PressuresHighStep } from './steps/dynamic/PressuresHighStep';
import { StripMiningStep } from './steps/dynamic/StripMiningStep';


// Setup Steps
import { CaptainSetup } from './CaptainSetup';
import { SetupCardSelection } from './setup/SetupCardSelection';
import { OptionalRulesSelection } from './OptionalRulesSelection';


export interface StepComponentProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  isNavigating: boolean;
}

const STEP_COMPONENT_REGISTRY: Record<string, React.FC<StepComponentProps>> = {
  [STEP_IDS.C1]: NavDeckStep,
  [STEP_IDS.C2]: AllianceReaverStep,
  [STEP_IDS.C3]: DraftStep,
  [STEP_IDS.C4]: MissionDossierStep,
  [STEP_IDS.C5]: ResourcesStep,
  [STEP_IDS.C6]: JobStep,
  [STEP_IDS.C_PRIME]: PrimePumpStep,
  [STEP_IDS.D_FIRST_GOAL]: MissionDossierStep,
  [STEP_IDS.D_RIM_JOBS]: JobStep,
  [STEP_IDS.D_HAVEN_DRAFT]: DraftStep,
  [STEP_IDS.D_GAME_LENGTH_TOKENS]: GameLengthTokensStep,
  [STEP_IDS.D_TIME_LIMIT]: TimeLimitStep,
  [STEP_IDS.D_SHUTTLE]: ShuttleDraftStep,
  [STEP_IDS.D_BC_CAPITOL]: StartingCapitolStep,
  [STEP_IDS.D_LOCAL_HEROES]: LocalHeroesStep,
  [STEP_IDS.D_ALLIANCE_ALERT]: AllianceAlertStep,
  [STEP_IDS.D_PRESSURES_HIGH]: PressuresHighStep,
  [STEP_IDS.D_STRIP_MINING]: StripMiningStep,
};


export const StepContent = ({ step, onNext, onPrev, isNavigating }: StepComponentProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      titleRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [step.id]);
  
  const isSpecial = step.id.startsWith('D_');

  const renderStepBody = () => {
    if (step.type === 'setup') {
      if (step.id === STEP_IDS.SETUP_CAPTAIN_EXPANSIONS) return <CaptainSetup onNext={onNext} />;
      if (step.id === STEP_IDS.SETUP_CARD_SELECTION) return <SetupCardSelection onNext={onNext} onBack={onPrev} />;
      if (step.id === STEP_IDS.SETUP_OPTIONAL_RULES) return <OptionalRulesSelection onStart={onNext} onBack={onPrev} />;
      return <div className="text-red-500">Unknown Setup Step: {step.id}</div>;
    }

    const Component = STEP_COMPONENT_REGISTRY[step.id];
    if (Component) {
      return <Component step={step} onNext={onNext} onPrev={onPrev} isNavigating={isNavigating} />;
    }

    return <div className="text-red-500">Content for step '{step.id}' not found.</div>;
  };

  if (step.type === 'setup') {
      return (
          <div className="animate-fade-in-up pb-24 sm:pb-0">
              {renderStepBody()}
          </div>
      );
  }

  const isMissionDossier = step.id === STEP_IDS.C4 || step.id === STEP_IDS.D_FIRST_GOAL;
  const showNav = !isMissionDossier;
  const displayTitle = step.data?.title || step.id;
  
  const headerBg = isSpecial
    ? (isDark ? 'bg-emerald-950/80 border-emerald-500/50' : 'bg-emerald-800 border-emerald-900')
    : (isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-firefly-saddleBrown border-firefly-brown');

  const headerColor = 'text-white';
  const tagColor = isSpecial
    ? (isDark ? 'text-emerald-400' : 'text-emerald-200')
    : (isDark ? 'text-amber-400' : 'text-amber-200');

  const footerBg = isDark ? 'bg-zinc-950/90' : 'bg-[#faf8ef]/95';
  const footerBorder = isDark ? 'border-zinc-800' : 'border-firefly-parchment-border';

  return (
    <div className="animate-fade-in-up pb-32 sm:pb-8">
      <div className="flex flex-wrap items-start justify-between mb-6 gap-4">
        <h2 
            ref={titleRef}
            tabIndex={-1}
            className={cls("text-2xl font-bold font-western flex-1 min-w-[200px] transition-colors duration-300 flex justify-between items-center p-4 rounded-xl shadow-lg border-2 focus:outline-none backdrop-blur-md", headerBg, headerColor)}
        >
          <div className="flex flex-col">
            <span className={cls("text-[10px] font-bold uppercase tracking-[0.2em] mb-1 opacity-70", tagColor)}>
                Step {isSpecial ? 'Override' : 'Standard'}
            </span>
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="drop-shadow-md">{displayTitle}</span>
              {step.page && <PageReference page={step.page} manual={step.manual} />}
            </div>
          </div>
        </h2>
        <div className="w-full lg:w-1/3 shrink-0 flex">
           <QuotePanel stepId={step.id} className="flex-1" />
        </div>
      </div>

      <div className="relative">
        {renderStepBody()}
      </div>

      {showNav && (
        <>
          {/* Desktop Nav */}
          <div className={cls("hidden sm:flex mt-12 justify-between clear-both pt-8 border-t", isDark ? 'border-zinc-800' : 'border-stone-200')}>
            <Button onClick={onPrev} variant="secondary" disabled={isNavigating}>
              ← Previous
            </Button>
            <Button onClick={onNext} disabled={isNavigating} className="px-10">
              Next Step →
            </Button>
          </div>

          {/* Sticky Mobile Nav */}
          <div className={cls(
            "fixed bottom-0 left-0 right-0 p-4 border-t z-[60] flex sm:hidden justify-between gap-4 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-colors duration-300",
            footerBg, footerBorder
          )}>
            <button 
              onClick={onPrev} 
              disabled={isNavigating}
              className={cls(
                "flex-1 py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-wider transition-all",
                isDark ? 'bg-zinc-800 text-zinc-300 border border-zinc-700' : 'bg-stone-200 text-stone-700 border border-stone-300'
              )}
            >
              Back
            </button>
            <button 
              onClick={onNext} 
              disabled={isNavigating}
              className={cls(
                "flex-[2] py-3 px-4 rounded-lg font-bold text-xs uppercase tracking-[0.1em] shadow-lg transition-all active:scale-95",
                isDark ? 'bg-emerald-600 text-white' : 'bg-firefly-red text-white'
              )}
            >
              Continue →
            </button>
          </div>
        </>
      )}
    </div>
  );
};
