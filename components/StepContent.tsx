import React, { useMemo, useRef, useEffect } from 'react';
import { Step } from '../types';
import { Button } from './Button';
import { QuotePanel } from './QuotePanel';
import { useTheme } from './ThemeContext';
import { STEP_IDS, STORY_TITLES } from '../data/ids';
import { cls } from '../utils/style';
import { useGameState } from '../hooks/useGameState';
import { STORY_CARDS } from '../data/storyCards';
import { hasFlag } from '../utils/data';
import { PageReference } from './PageReference';

// Core Steps
import { NavDeckStep } from './NavDeckStep';
import { AllianceReaverStep } from './AllianceReaverStep';
import { DraftStep } from './DraftStep';
import { MissionDossierStep } from './MissionDossierStep';
import { ResourcesStep } from './ResourcesStep';
import { JobStep } from './JobStep';
import { PrimePumpStep } from './PrimePumpStep';

// Dynamic Step Handler
import { DynamicStepHandler } from './DynamicStepHandler';

// Setup Steps
import { CaptainSetup } from './CaptainSetup';
import { SetupCardSelection } from './SetupCardSelection';
import { OptionalRulesSelection } from './OptionalRulesSelection';


interface StepContentProps {
  step: Step;
  onNext: () => void;
  onPrev: () => void;
  isNavigating: boolean;
}

// Registry for Core Step Components
const CORE_STEP_COMPONENTS: Record<string, React.FC<{ step: Step }>> = {
  [STEP_IDS.CORE_NAV_DECKS]: NavDeckStep,
  [STEP_IDS.CORE_ALLIANCE_REAVER]: AllianceReaverStep,
  [STEP_IDS.CORE_DRAFT]: DraftStep,
  [STEP_IDS.CORE_RESOURCES]: ResourcesStep,
  [STEP_IDS.CORE_JOBS]: JobStep,
  [STEP_IDS.CORE_PRIME_PUMP]: PrimePumpStep,
};

export const StepContent = ({ step, onNext, onPrev, isNavigating }: StepContentProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const stepId = step.id;
  const { state: gameState } = useGameState();
  const titleRef = useRef<HTMLHeadingElement>(null);

  // Accessibility: Focus the heading when the step changes.
  useEffect(() => {
    // Timeout gives the browser a moment to render and avoids race conditions.
    const timer = setTimeout(() => {
      titleRef.current?.focus();
    }, 100);
    return () => clearTimeout(timer);
  }, [step.id]);

  const activeStoryCard = useMemo(() => 
    STORY_CARDS.find(c => c.title === gameState.selectedStoryCard),
    [gameState.selectedStoryCard]
  );
  
  const isSpecial = useMemo(() => {
    // Dynamic steps are special by definition.
    if (step.type === 'dynamic') {
        return true;
    }

    // A step is special if the setup card provides any rule overrides for it.
    const hasSetupOverrides = Object.keys(step.overrides || {}).length > 0;
    if (hasSetupOverrides) {
        return true;
    }

    if (!activeStoryCard?.setupConfig) {
        return false;
    }

    const config = activeStoryCard.setupConfig;

    switch (step.id) {
        case STEP_IDS.CORE_NAV_DECKS:
            // No story cards directly affect this step's core rules, only setup cards.
            return false;
        
        case STEP_IDS.CORE_ALLIANCE_REAVER:
            return hasFlag(config, 'placeAllianceAlertsInAllianceSpace') ||
                   hasFlag(config, 'placeMixedAlertTokens') ||
                   hasFlag(config, 'smugglersBluesSetup') ||
                   hasFlag(config, 'lonelySmugglerSetup') ||
                   hasFlag(config, 'startWithAlertCard') ||
                   !!config.createAlertTokenStackMultiplier;

        case STEP_IDS.CORE_DRAFT:
            return !!config.shipPlacementMode || !!config.startAtSector;
        
        case STEP_IDS.CORE_RESOURCES:
            return config.startingCreditsBonus !== undefined ||
                   config.startingCreditsOverride !== undefined ||
                   hasFlag(config, 'noStartingFuelParts') ||
                   config.customStartingFuel !== undefined ||
                   hasFlag(config, 'startWithWarrant') ||
                   hasFlag(config, 'removeRiver') ||
                   hasFlag(config, 'nandiCrewDiscount') ||
                   hasFlag(config, 'startWithGoalToken');

        case STEP_IDS.CORE_JOBS:
             return (config.jobDrawMode !== undefined && config.jobDrawMode !== 'standard') ||
                    !!config.forbiddenStartingContact ||
                    (!!config.allowedStartingContacts && config.allowedStartingContacts.length > 0) ||
                    hasFlag(config, 'removeJobDecks') ||
                    hasFlag(config, 'sharedHandSetup');

        case STEP_IDS.CORE_PRIME_PUMP:
            return (config.primingMultiplier !== undefined && config.primingMultiplier > 1) ||
                   (activeStoryCard?.title === STORY_TITLES.SLAYING_THE_DRAGON);

        // Mission Dossier is conceptually core.
        case STEP_IDS.CORE_MISSION:
        default:
            return false;
    }
  }, [step, activeStoryCard]);

  // Render logic based on Step Type and ID
  const renderStepBody = () => {
    switch (step.type) {
      case 'setup':
        if (step.id === STEP_IDS.SETUP_CAPTAIN_EXPANSIONS) return <CaptainSetup onNext={onNext} />;
        if (step.id === STEP_IDS.SETUP_CARD_SELECTION) return <SetupCardSelection onNext={onNext} onBack={onPrev} />;
        if (step.id === STEP_IDS.SETUP_OPTIONAL_RULES) return <OptionalRulesSelection onStart={onNext} onBack={onPrev} />;
        return <div className="text-red-500">Unknown Setup Step: {step.id}</div>;
      
      case 'core': {
        // Handle Mission Dossier separately due to different props
        if (step.id === STEP_IDS.CORE_MISSION) {
             return <MissionDossierStep onNext={onNext} onPrev={onPrev} isNavigating={isNavigating} />;
        }

        const Component = CORE_STEP_COMPONENTS[step.id];
        if (Component) {
          return <Component step={step} />;
        }
        return <div className="text-red-500">Unknown Core Step: {step.id}</div>;
      }

      case 'dynamic':
        if (step.id === STEP_IDS.D_FIRST_GOAL) {
            return <MissionDossierStep onNext={onNext} onPrev={onPrev} titleOverride="First, Choose a Story Card" isNavigating={isNavigating} />;
        }
        return <DynamicStepHandler step={step} />;

      default:
        return <div className="text-red-500">Unknown Step Type: {step.type}</div>;
    }
  };

  // Setup steps are self-contained components with their own layout, header, and nav.
  if (step.type === 'setup') {
      return (
          <div className="animate-fade-in-up">
              {renderStepBody()}
          </div>
      );
  }

  // Core and Dynamic steps use the standard StepContent wrapper.
  const isMissionDossier = step.id === STEP_IDS.CORE_MISSION || step.id === STEP_IDS.D_FIRST_GOAL;
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
           <QuotePanel stepId={stepId} className="flex-1" />
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
