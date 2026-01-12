import React, { useRef, useCallback } from 'react';
import { MissionSelectionProvider } from './MissionSelectionContext';
import { useMissionSelection } from '../hooks/useMissionSelection';
import { StepComponentProps } from './StepContent';
import { StorySelectionPart } from './story/StorySelectionPart';
import { AdvancedRulesConfigurationPart } from './story/AdvancedRulesConfigurationPart';

const MissionDossierStepContent = (props: StepComponentProps): React.ReactElement => {
  const { onNext: onWizardNext, onPrev, isNavigating, openOverrideModal, hasUnacknowledgedPastOverrides } = props;
  const { subStep, setSubStep, enablePart2 } = useMissionSelection();
  const dossierTopRef = useRef<HTMLDivElement>(null);

  const handleGoToSelection = useCallback(() => {
    setSubStep(1);
    dossierTopRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [setSubStep]);

  const handleStoryPartNext = useCallback(() => {
    const continueToNextPart = () => {
      if (enablePart2) {
        setSubStep(2);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        onWizardNext();
      }
    };

    if (hasUnacknowledgedPastOverrides && openOverrideModal) {
      openOverrideModal(continueToNextPart);
    } else {
      continueToNextPart();
    }
  }, [hasUnacknowledgedPastOverrides, enablePart2, setSubStep, onWizardNext, openOverrideModal]);

  const isFirstStep = props.step.data?.title?.startsWith('1.');
  const storySelectionTitle = isFirstStep ? "First, Choose a Story Card" : "Choose a Story Card";

  return (
    <div ref={dossierTopRef} className="scroll-mt-24">
      {subStep === 1 ? (
        <StorySelectionPart
          onNext={handleStoryPartNext}
          onPrev={onPrev}
          isNavigating={isNavigating}
          title={storySelectionTitle}
          isFirstStep={!!isFirstStep}
        />
      ) : (
        <AdvancedRulesConfigurationPart
          onNext={onWizardNext}
          onBack={handleGoToSelection}
          isNavigating={isNavigating}
        />
      )}
    </div>
  );
};

export const MissionDossierStep = (props: StepComponentProps): React.ReactElement => {
  return (
    <MissionSelectionProvider onJump={props.onJump}>
      <MissionDossierStepContent {...props} />
    </MissionSelectionProvider>
  );
};