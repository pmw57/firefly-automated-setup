import React, { useRef } from 'react';
import { MissionSelectionProvider } from './MissionSelectionContext';
import { useMissionSelection } from '../hooks/useMissionSelection';
import { StepComponentProps } from './StepContent';
import { StorySelectionPart } from './story/StorySelectionPart';
import { AdvancedRulesConfigurationPart } from './story/AdvancedRulesConfigurationPart';

const MissionDossierStepContent = (props: StepComponentProps): React.ReactElement => {
  const { onNext, onPrev, isNavigating } = props;
  const { subStep, setSubStep } = useMissionSelection();
  const dossierTopRef = useRef<HTMLDivElement>(null);

  const handleGoToSelection = () => {
    setSubStep(1);
    dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const isFirstStep = props.step.data?.title?.startsWith('1.');
  const storySelectionTitle = isFirstStep ? "First, Choose a Story Card" : "Choose a Story Card";

  return (
    <div ref={dossierTopRef} className="scroll-mt-24">
      {subStep === 1 ? (
        <StorySelectionPart
          onNext={onNext}
          onPrev={onPrev}
          isNavigating={isNavigating}
          title={storySelectionTitle}
        />
      ) : (
        <AdvancedRulesConfigurationPart
          onNext={onNext}
          onBack={handleGoToSelection}
          isNavigating={isNavigating}
        />
      )}
    </div>
  );
};

export const MissionDossierStep = (props: StepComponentProps): React.ReactElement => {
  return (
    <MissionSelectionProvider>
      <MissionDossierStepContent {...props} />
    </MissionSelectionProvider>
  );
};