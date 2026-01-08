import React, { useRef } from 'react';
import { MissionSelectionProvider } from './MissionSelectionContext';
import { useMissionSelection } from '../hooks/useMissionSelection';
import { StepComponentProps } from './StepContent';
import { StorySelectionPart } from './story/StorySelectionPart';
import { AdvancedRulesConfigurationPart } from './story/AdvancedRulesConfigurationPart';

const MissionSelectionStepContent = (props: StepComponentProps): React.ReactElement => {
  const { onNext, onPrev, isNavigating } = props;
  const { subStep, setSubStep, enablePart2 } = useMissionSelection();
  const dossierTopRef = useRef<HTMLDivElement>(null);

  const handleGoToOptions = () => {
    setSubStep(2);
    dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const handleGoToSelection = () => {
    setSubStep(1);
    dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleNext = () => {
    if (subStep === 1 && enablePart2) {
      handleGoToOptions();
    } else {
      onNext();
    }
  };
  
  const isFirstStep = props.step.data?.title?.startsWith('1.');
  const storySelectionTitle = isFirstStep ? "First, Choose a Story Card" : "Choose a Story Card";

  return (
    <div ref={dossierTopRef} className="scroll-mt-24">
      {subStep === 1 ? (
        <StorySelectionPart
          onNext={handleNext}
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

export const MissionSelectionStep = (props: StepComponentProps): React.ReactElement => {
  return (
    <MissionSelectionProvider>
      <MissionSelectionStepContent {...props} />
    </MissionSelectionProvider>
  );
};
