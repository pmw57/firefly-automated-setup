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

// A single, unified registry that maps raw step IDs directly to components.
// All components now adhere to the StepComponentProps interface for consistency.
const STEP_COMPONENT_REGISTRY: Record<string, React.FC<StepComponentProps>> = {
  // Core Steps
  [STEP_IDS.C1]: NavDeckStep,
  [STEP_IDS.C2]: AllianceReaverStep,
  [STEP_IDS.C3]: DraftStep,
  [STEP_IDS.C4]: MissionDossierStep,
  [STEP_IDS.C5]: ResourcesStep,
  [STEP_IDS.C6]: JobStep,
  [STEP_IDS.C_PRIME]: PrimePumpStep,

  // Dynamic Steps
  [STEP_IDS.D_FIRST_GOAL]: MissionDossierStep,
  [STEP_IDS.D_RIM_JOBS]: JobStep, // Reuses JobStep
  [STEP_IDS.D_HAVEN_DRAFT]: DraftStep, // Reuses DraftStep
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

  // Accessibility: Focus the heading when the step changes.
  useEffect(() => {
    // Timeout gives the browser a moment to render and avoids race conditions.
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
          <div className="animate-fade-in-up">
              {renderStepBody()}
          </div>
      );
  }

  const isMissionDossier = step.id === STEP_IDS.C4 || step.id === STEP_IDS.D_FIRST_GOAL;
  const showNav = !isMissionDossier;
  
  const displayTitle = step.data?.title || step.id;
  
  const borderTop = isDark ? 'border-zinc-800' : 'border-firefly-parchment-border';
  
  const headerBg = isSpecial
    ? (isDark ? 'bg-green-900' : 'bg-green-800')
    : 'bg-firefly-saddleBrown';

  const headerColor = 'text-white';
  const tagColor = isSpecial
    ? (isDark ? 'text-green-300' : 'text-green-200')
    : (isDark ? 'text-amber-300' : 'text-amber-200');

  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-wrap items-start justify-between mb-6 gap-4">
        <h2 
            ref={titleRef}
            tabIndex={-1}
            className={cls("text-2xl font-bold font-western flex-1 min-w-[200px] transition-colors duration-300 flex justify-between items-center p-3 rounded-lg shadow-md focus:outline-none", headerBg, headerColor)}
        >
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span>{displayTitle}</span>
            {step.page && <PageReference page={step.page} manual={step.manual} />}
          </div>
          <span className={cls("text-xs font-bold uppercase tracking-wider", tagColor)}>
              {isSpecial ? 'Special' : 'Standard'}
          </span>
        </h2>
        <div className="w-full lg:w-1/3 shrink-0 flex">
           <QuotePanel stepId={step.id} className="flex-1" />
        </div>
      </div>

      <div className="relative">
        {renderStepBody()}
      </div>

      {showNav && (
        <div className={cls("mt-8 flex justify-between clear-both pt-6 border-t", borderTop)}>
          <Button onClick={onPrev} variant="secondary" className="shadow-sm" disabled={isNavigating}>
            ← Previous
          </Button>
          <Button 
              onClick={onNext}
              className="shadow-lg hover:translate-y-[-2px] transition-transform"
              disabled={isNavigating}
          >
            Next Step →
          </Button>
        </div>
      )}
    </div>
  );
};