
import React from 'react';
import { Step } from '../types';
import { JobStep } from './JobStep';
import { DraftStep } from './DraftStep';
import { STEP_IDS } from '../constants';

// Import newly created individual step components
import { NoSureThingsStep } from './steps/dynamic/NoSureThingsStep';
import { GameLengthTokensStep } from './steps/dynamic/GameLengthTokensStep';
import { TimeLimitStep } from './steps/dynamic/TimeLimitStep';
import { ShuttleDraftStep } from './steps/dynamic/ShuttleDraftStep';
import { StartingCapitolStep } from './steps/dynamic/StartingCapitolStep';
import { LocalHeroesStep } from './steps/dynamic/LocalHeroesStep';
import { AllianceAlertStep } from './steps/dynamic/AllianceAlertStep';
import { PressuresHighStep } from './steps/dynamic/PressuresHighStep';
import { StripMiningStep } from './steps/dynamic/StripMiningStep';

interface DynamicStepHandlerProps {
  step: Step;
}

export const DynamicStepHandler = ({ step }: DynamicStepHandlerProps): React.ReactElement => {
  const { id } = step;

  // --- Core Logic Steps Delegated ---
  if (id.includes(STEP_IDS.D_RIM_JOBS)) {
    return <JobStep step={step} />;
  }
  if (id.includes(STEP_IDS.D_HAVEN_DRAFT)) {
    return <DraftStep step={step} />;
  }

  // --- Individual Dynamic Steps ---
  if (id.includes(STEP_IDS.D_NO_SURE_THINGS)) {
    return <NoSureThingsStep />;
  }
  if (id.includes(STEP_IDS.D_GAME_LENGTH_TOKENS)) {
    return <GameLengthTokensStep step={step} />;
  }
  if (id.includes(STEP_IDS.D_TIME_LIMIT)) {
    return <TimeLimitStep />;
  }
  if (id.includes(STEP_IDS.D_SHUTTLE)) {
    return <ShuttleDraftStep />;
  }
  if (id.includes(STEP_IDS.D_BC_CAPITOL)) {
    return <StartingCapitolStep step={step} />;
  }
  if (id.includes(STEP_IDS.D_LOCAL_HEROES)) {
    return <LocalHeroesStep />;
  }
  if (id.includes(STEP_IDS.D_ALLIANCE_ALERT)) {
    return <AllianceAlertStep />;
  }
  if (id.includes(STEP_IDS.D_PRESSURES_HIGH)) {
    return <PressuresHighStep />;
  }
  if (id.includes(STEP_IDS.D_STRIP_MINING)) {
    return <StripMiningStep />;
  }

  // Fallback for any unhandled dynamic step
  return <div className="p-4 text-red-500">Content for dynamic step '{id}' not found.</div>;
};
