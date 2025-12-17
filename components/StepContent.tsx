import React from 'react';
import { Step } from '../types';
import { Button } from './Button';
import { QuotePanel } from './QuotePanel';
import { useTheme } from './ThemeContext';
import { STEP_IDS } from '../data/ids';
import { cls } from '../utils/style';

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
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
}

// Registry for Core Step Components
// Excludes MissionDossierStep because it has a different prop signature
const CORE_STEP_COMPONENTS: Record<string, React.FC<{ step: Step }>> = {
  [STEP_IDS.CORE_NAV_DECKS]: NavDeckStep,
  [STEP_IDS.CORE_ALLIANCE_REAVER]: AllianceReaverStep,
  [STEP_IDS.CORE_DRAFT]: DraftStep,
  [STEP_IDS.CORE_RESOURCES]: ResourcesStep,
  [STEP_IDS.CORE_JOBS]: JobStep,
  [STEP_IDS.CORE_PRIME_PUMP]: PrimePumpStep,
};

export const StepContent = ({ step, stepIndex, onNext, onPrev }: StepContentProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const stepId = step.id;

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
             return <MissionDossierStep onNext={onNext} onPrev={onPrev} />;
        }

        const Component = CORE_STEP_COMPONENTS[step.id];
        if (Component) {
          return <Component step={step} />;
        }
        return <div className="text-red-500">Unknown Core Step: {step.id}</div>;
      }

      case 'dynamic':
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
  const isMissionDossier = step.id === STEP_IDS.CORE_MISSION;
  const showNav = !isMissionDossier;

  const headerColor = isDark ? 'text-gray-200' : 'text-firefly-parchment-text';
  const indexColor = isDark ? 'text-amber-500/80' : 'text-firefly-red';
  const borderBottom = isDark ? 'border-zinc-700' : 'border-firefly-parchment-border';
  const borderTop = isDark ? 'border-zinc-800' : 'border-firefly-parchment-border';
  
  return (
    <div className="animate-fade-in-up">
      <div className="flex flex-wrap items-start justify-between mb-6 gap-4">
        <h2 className={cls("text-2xl font-bold font-western border-b-2 pb-2 pr-10 flex-1 min-w-[200px] drop-shadow-sm transition-colors duration-300", headerColor, borderBottom)}>
          <span className={cls("mr-2", indexColor)}>{stepIndex + 1}.</span>
          {step.data?.title || step.id}
        </h2>
        <div className="w-full lg:w-1/3 shrink-0">
           <QuotePanel stepId={stepId} />
        </div>
      </div>

      <div className="relative">
        {renderStepBody()}
      </div>

      {showNav && (
        <div className={cls("mt-8 flex justify-between clear-both pt-6 border-t", borderTop)}>
          <Button onClick={onPrev} variant="secondary" className="shadow-sm">
            ← Previous
          </Button>
          <Button 
              onClick={onNext}
              className="shadow-lg hover:translate-y-[-2px] transition-transform"
          >
            Next Step →
          </Button>
        </div>
      )}
    </div>
  );
};
