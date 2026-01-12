import React, { useRef, useEffect, lazy, Suspense, useMemo } from 'react';
import { Step, SetComponentRule } from '../types/index';
import { Button } from './Button';
import { QuotePanel } from './QuotePanel';
import { useTheme } from './ThemeContext';
import { STEP_IDS } from '../data/ids';
import { cls } from '../utils/style';
import { PageReference } from './PageReference';
import { useGameState } from '../hooks/useGameState';
import { calculateSetupFlow } from '../utils/flow';
import { getSetupCardSelectionInfo } from '../utils/selectors/ui';
import { getResolvedRules } from '../utils/selectors/rules';

export interface StepComponentProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  isNavigating: boolean;
  isDevMode?: boolean;
  onJump?: (index: number) => void;
  // New props for MissionDossierStep
  openOverrideModal?: (onContinue: () => void) => void;
  hasUnacknowledgedPastOverrides?: boolean;
}

const StepLoading: React.FC = () => (
    <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-firefly-red dark:border-emerald-500"></div>
    </div>
);

// Standard step components
const NavDeckStep = lazy(() => import('./NavDeckStep').then(m => ({ default: m.NavDeckStep })));
const AllianceReaverStep = lazy(() => import('./AllianceReaverStep').then(m => ({ default: m.AllianceReaverStep })));
const DraftStep = lazy(() => import('./DraftStep').then(m => ({ default: m.DraftStep })));
const MissionSelectionStep = lazy(() => import('./MissionDossierStep').then(m => ({ default: m.MissionDossierStep })));
const ResourcesStep = lazy(() => import('./ResourcesStep').then(m => ({ default: m.ResourcesStep })));
const JobStep = lazy(() => import('./JobStep').then(m => ({ default: m.JobStep })));
const PrimePumpStep = lazy(() => import('./PrimePumpStep').then(m => ({ default: m.PrimePumpStep })));
const GameLengthTokensStep = lazy(() => import('./steps/dynamic/GameLengthTokensStep').then(m => ({ default: m.GameLengthTokensStep })));
const TimeLimitStep = lazy(() => import('./steps/dynamic/TimeLimitStep').then(m => ({ default: m.TimeLimitStep })));
const ShuttleDraftStep = lazy(() => import('./steps/dynamic/ShuttleDraftStep').then(m => ({ default: m.ShuttleDraftStep })));
const StartingCapitolStep = lazy(() => import('./steps/dynamic/StartingCapitolStep').then(m => ({ default: m.StartingCapitolStep })));
const LocalHeroesStep = lazy(() => import('./steps/dynamic/LocalHeroesStep').then(m => ({ default: m.LocalHeroesStep })));
const AllianceAlertStep = lazy(() => import('./steps/dynamic/AllianceAlertStep').then(m => ({ default: m.AllianceAlertStep })));
const PressuresHighStep = lazy(() => import('./steps/dynamic/PressuresHighStep').then(m => ({ default: m.PressuresHighStep })));
const StripMiningStep = lazy(() => import('./steps/dynamic/StripMiningStep').then(m => ({ default: m.StripMiningStep })));
const CaptainSetup = lazy(() => import('./CaptainSetup').then(m => ({ default: m.CaptainSetup })));
const SetupCardSelection = lazy(() => import('./setup/SetupCardSelection').then(m => ({ default: m.SetupCardSelection })));
const OptionalRulesSelection = lazy(() => import('./OptionalRulesSelection').then(m => ({ default: m.OptionalRulesSelection })));

// Story-specific override components
const RuiningItDraftStep = lazy(() => import('./steps/story/RuiningItDraftStep').then(m => ({ default: m.RuiningItDraftStep })));
const RuiningItResourcesStep = lazy(() => import('./steps/story/RuiningItResourcesStep').then(m => ({ default: m.RuiningItResourcesStep })));
const RuiningItJobsStep = lazy(() => import('./steps/story/RuiningItJobsStep').then(m => ({ default: m.RuiningItJobsStep })));


const STEP_COMPONENT_REGISTRY: Record<string, React.FC<StepComponentProps>> = {
  [STEP_IDS.C1]: NavDeckStep,
  [STEP_IDS.C2]: AllianceReaverStep,
  [STEP_IDS.C3]: DraftStep,
  [STEP_IDS.C4]: MissionSelectionStep,
  [STEP_IDS.C5]: ResourcesStep,
  [STEP_IDS.C6]: JobStep,
  [STEP_IDS.C_PRIME]: PrimePumpStep,
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

const STORY_COMPONENT_REGISTRY: Record<string, React.FC<StepComponentProps>> = {
    RuiningItDraftStep,
    RuiningItResourcesStep,
    RuiningItJobsStep,
};

export const StepContent = ({ step, onNext, onPrev, isNavigating, isDevMode, openOverrideModal, hasUnacknowledgedPastOverrides, onJump }: StepComponentProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const titleRef = useRef<HTMLHeadingElement>(null);
  const { state: gameState } = useGameState();
  const totalSetupParts = useMemo(() => calculateSetupFlow(gameState).filter(s => s.type === 'setup').length, [gameState]);
  const allRules = useMemo(() => getResolvedRules(gameState), [gameState]);

  useEffect(() => {
    const timer = setTimeout(() => {
      titleRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [step.id]);
  
  const isSpecial = step.id.startsWith('D_');

  const renderStepBody = () => {
    // Check for a story-specific component override first
    const componentRule = allRules.find(
      (r): r is SetComponentRule => r.type === 'setComponent' && r.stepId === step.id
    );
    if (componentRule && STORY_COMPONENT_REGISTRY[componentRule.component]) {
        const StoryComponent = STORY_COMPONENT_REGISTRY[componentRule.component];
        return <StoryComponent step={step} onNext={onNext} onPrev={onPrev} isNavigating={isNavigating} />;
    }
    
    // Fallback to standard component rendering
    if (step.type === 'setup') {
      if (step.id === STEP_IDS.SETUP_CAPTAIN_EXPANSIONS) return <CaptainSetup isDevMode={isDevMode} />;
      if (step.id === STEP_IDS.SETUP_CARD_SELECTION) return <SetupCardSelection />;
      if (step.id === STEP_IDS.SETUP_OPTIONAL_RULES) return <OptionalRulesSelection />;
      return <div className="text-red-500">Unknown Setup Step: {step.id}</div>;
    }

    const Component = STEP_COMPONENT_REGISTRY[step.id];
    if (Component) {
      return <Component 
        step={step} 
        onNext={onNext} 
        onPrev={onPrev} 
        isNavigating={isNavigating}
        isDevMode={isDevMode}
        openOverrideModal={openOverrideModal}
        hasUnacknowledgedPastOverrides={hasUnacknowledgedPastOverrides}
        onJump={onJump}
      />;
    }

    return <div className="text-red-500">Content for step '{step.id}' not found.</div>;
  };
  
  const footerBg = isDark ? 'bg-zinc-950/90' : 'bg-[#faf8ef]/95';
  const footerBorder = isDark ? 'border-zinc-800' : 'border-firefly-parchment-border';

  if (step.type === 'setup') {
      const isFirstSetupStep = step.id === STEP_IDS.SETUP_CAPTAIN_EXPANSIONS;
      
      const nextButtonTextMap: Record<string, string> = {
          [STEP_IDS.SETUP_CAPTAIN_EXPANSIONS]: 'Next: Choose Setup →',
          [STEP_IDS.SETUP_CARD_SELECTION]: totalSetupParts > 2 ? 'Next: Options →' : 'Begin Setup →',
          [STEP_IDS.SETUP_OPTIONAL_RULES]: 'Begin Setup →'
      };
      
      const finalNextText = nextButtonTextMap[step.id] || 'Next →';
      
      const { isNextDisabled } = getSetupCardSelectionInfo(gameState);
      const isButtonDisabled = step.id === STEP_IDS.SETUP_CARD_SELECTION && isNextDisabled;
      
      return (
          <div className="animate-fade-in-up pb-24 xl:pb-0">
            <Suspense fallback={<StepLoading />}>
              {renderStepBody()}
            </Suspense>

            {/* Desktop Nav */}
            <div className={cls("hidden xl:flex mt-8 pt-6 border-t", isFirstSetupStep ? 'justify-end' : 'justify-between', isDark ? 'border-zinc-800' : 'border-stone-200')}>
                {!isFirstSetupStep && (
                    <Button onClick={onPrev} variant="secondary" disabled={isNavigating}>
                        ← Back
                    </Button>
                )}
                <Button onClick={onNext} disabled={isNavigating || isButtonDisabled}>
                    {finalNextText}
                </Button>
            </div>
            
            {/* Sticky Mobile Nav */}
            <div className={cls(
              "fixed bottom-0 left-0 right-0 p-4 border-t z-[60] flex xl:hidden justify-between gap-4 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-colors duration-300",
              footerBg, footerBorder
            )}>
                {!isFirstSetupStep && (
                  <Button 
                    onClick={onPrev} 
                    variant="secondary"
                    disabled={isNavigating}
                    className="flex-1 text-xs uppercase tracking-wider !py-3"
                  >
                    ← Back
                  </Button>
                )}
                <Button 
                  onClick={onNext} 
                  disabled={isNavigating || isButtonDisabled}
                  className={cls(isFirstSetupStep ? 'w-full' : 'flex-[2]', "text-xs uppercase tracking-[0.1em] !py-3")}
                >
                  {finalNextText}
                </Button>
            </div>
          </div>
      );
  }

  const isMissionDossier = step.id === STEP_IDS.C4;
  const showNav = !isMissionDossier;
  const displayTitle = step.data?.title || step.id;
  
  const headerBg = isSpecial
    ? (isDark ? 'bg-emerald-950/80 border-emerald-500/50' : 'bg-emerald-800 border-emerald-900')
    : (isDark ? 'bg-zinc-900/80 border-zinc-700' : 'bg-firefly-saddleBrown border-firefly-brown');

  const headerColor = 'text-white';
  const tagColor = isSpecial
    ? (isDark ? 'text-emerald-400' : 'text-emerald-200')
    : (isDark ? 'text-amber-400' : 'text-amber-200');

  return (
    <div className="animate-fade-in-up pb-32 xl:pb-8">
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
        <Suspense fallback={<StepLoading />}>
            {renderStepBody()}
        </Suspense>
      </div>

      {showNav && (
        <>
          {/* Desktop Nav */}
          <div className={cls("hidden xl:flex mt-12 justify-between clear-both pt-8 border-t", isDark ? 'border-zinc-800' : 'border-stone-200')}>
            <Button onClick={onPrev} variant="secondary" disabled={isNavigating}>
              ← Back
            </Button>
            <Button onClick={onNext} disabled={isNavigating} className="px-10">
              Next Step →
            </Button>
          </div>

          {/* Sticky Mobile Nav */}
          <div className={cls(
            "fixed bottom-0 left-0 right-0 p-4 border-t z-[60] flex xl:hidden justify-between gap-4 backdrop-blur-md shadow-[0_-10px_20px_rgba(0,0,0,0.1)] transition-colors duration-300",
            footerBg, footerBorder
          )}>
            <Button 
              onClick={onPrev} 
              variant="secondary"
              disabled={isNavigating}
              className="flex-1 text-xs uppercase tracking-wider !py-3"
            >
              ← Back
            </Button>
            <Button 
              onClick={onNext} 
              disabled={isNavigating}
              className="flex-[2] text-xs uppercase tracking-[0.1em] !py-3"
            >
              Next Step →
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
