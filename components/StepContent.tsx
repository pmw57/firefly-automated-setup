
import React from 'react';
import { Step } from '../types';
import { Button } from './Button';
import { QuotePanel } from './QuotePanel';
import { useTheme } from './ThemeContext';
import { STEP_IDS } from '../constants';

// Core Steps
import { NavDeckStep } from './NavDeckStep';
import { AllianceReaverStep } from './AllianceReaverStep';
import { DraftStep } from './DraftStep';
import { MissionDossierStep } from './MissionDossierStep';
import { ResourcesStep } from './ResourcesStep';
import { JobStep } from './JobStep';
import { PrimePumpStep } from './PrimePumpStep';

// Dynamic Step
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

export const StepContent = ({ step, stepIndex, onNext, onPrev }: StepContentProps): React.ReactElement => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const stepId = step.id;

  // MissionDossierStep has its own nav buttons
  const isMissionDossier = step.id === STEP_IDS.CORE_MISSION;

  // Render logic based on Step Type and ID
  const renderStepBody = () => {
    switch (step.type) {
      case 'setup':
        if (step.id === STEP_IDS.SETUP_CAPTAIN_EXPANSIONS) return <CaptainSetup onNext={onNext} />;
        if (step.id === STEP_IDS.SETUP_CARD_SELECTION) return <SetupCardSelection onNext={onNext} onBack={onPrev} />;
        if (step.id === STEP_IDS.SETUP_OPTIONAL_RULES) return <OptionalRulesSelection onStart={onNext} onBack={onPrev} />;
        return <div className="text-red-500">Unknown Setup Step: {step.id}</div>;
      
      case 'core':
        switch (step.id) {
          case STEP_IDS.CORE_NAV_DECKS: return <NavDeckStep step={step} />;
          case STEP_IDS.CORE_ALLIANCE_REAVER: return <AllianceReaverStep step={step} />;
          case STEP_IDS.CORE_DRAFT: return <DraftStep step={step} />;
          case STEP_IDS.CORE_MISSION: return <MissionDossierStep onNext={onNext} onPrev={onPrev} />;
          case STEP_IDS.CORE_RESOURCES: return <ResourcesStep step={step} />;
          case STEP_IDS.CORE_JOBS: return <JobStep step={step} />;
          case STEP_IDS.CORE_PRIME_PUMP: return <PrimePumpStep step={step} />;
          default: return <div className="text-red-500">Unknown Core Step: {step.id}</div>;
        }

      case 'dynamic':
        // Delegate all dynamic logic to the handler
        return <DynamicStepHandler step={step} />;

      default:
        return <div className="text-red-500">Unknown Step Type: {step.type}</div>;
    }
  };

  const headerColor = isDark ? 'text-gray-200' : 'text-[#292524]';
  const indexColor = isDark ? 'text-amber-500/80' : 'text-[#7f1d1d]';
  const borderBottom = isDark ? 'border-zinc-700' : 'border-[#d6cbb0]';
  const borderTop = isDark ? 'border-zinc-800' : 'border-[#d6cbb0]';
  
  // Custom titles for setup steps that don't have them in constants
  const getStepTitle = () => {
    if (step.id === STEP_IDS.SETUP_CAPTAIN_EXPANSIONS) return 'Captain & Expansions';
    if (step.id === STEP_IDS.SETUP_CARD_SELECTION) return 'Setup Card';
    if (step.id === STEP_IDS.SETUP_OPTIONAL_RULES) return 'Optional Rules';
    return step.data?.title || step.id;
  };

  const showNav = !isMissionDossier && step.type !== 'setup';

  return (
    <div className="animate-fade-in-up">
      
      {/* 
        Header Section
      */}
      <div className="flex flex-wrap items-start justify-between mb-6 gap-4">
        <h2 className={`text-2xl font-bold ${headerColor} font-western border-b-2 ${borderBottom} pb-2 pr-10 flex-1 min-w-[200px] drop-shadow-sm transition-colors duration-300`}>
          {step.type !== 'setup' && (
            <span className={`${indexColor} mr-2`}>{stepIndex}.</span>
          )}
          {getStepTitle()}
        </h2>

        <div className="w-full lg:w-1/3 shrink-0">
           <QuotePanel stepId={stepId} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="relative">
        {renderStepBody()}
      </div>

      {showNav && (
        <div className={`mt-8 flex justify-between clear-both pt-6 border-t ${borderTop}`}>
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
