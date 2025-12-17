import React from 'react';
import { Step } from '../types';
import { JobStep } from './JobStep';
import { DraftStep } from './DraftStep';
import { STEP_IDS } from '../data/ids';

// Import individual step components
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

// 1. Define the Registry Key-Value pair
// This map makes the system "Open for Extension" (add new keys) 
// but "Closed for Modification" (logic below doesn't change).
const DYNAMIC_STEP_REGISTRY: Record<string, React.FC<{ step: Step }>> = {
  [STEP_IDS.D_RIM_JOBS]: JobStep,
  [STEP_IDS.D_HAVEN_DRAFT]: DraftStep,
  [STEP_IDS.D_NO_SURE_THINGS]: NoSureThingsStep,
  [STEP_IDS.D_GAME_LENGTH_TOKENS]: GameLengthTokensStep,
  [STEP_IDS.D_TIME_LIMIT]: TimeLimitStep,
  [STEP_IDS.D_SHUTTLE]: ShuttleDraftStep,
  [STEP_IDS.D_BC_CAPITOL]: StartingCapitolStep,
  [STEP_IDS.D_LOCAL_HEROES]: LocalHeroesStep,
  [STEP_IDS.D_ALLIANCE_ALERT]: AllianceAlertStep,
  [STEP_IDS.D_PRESSURES_HIGH]: PressuresHighStep,
  [STEP_IDS.D_STRIP_MINING]: StripMiningStep,
};

export const DynamicStepHandler = ({ step }: DynamicStepHandlerProps): React.ReactElement => {
  const { id } = step;

  // 2. Dynamic Lookup Logic
  // Iterate through registry keys to find a match. 
  // We use .find() because step IDs might contain the key as a substring (e.g. "D_HAVEN_DRAFT_1").
  const matchingKey = Object.keys(DYNAMIC_STEP_REGISTRY).find(key => id.includes(key));
  
  if (matchingKey) {
    const Component = DYNAMIC_STEP_REGISTRY[matchingKey];
    return <Component step={step} />;
  }

  // Fallback
  return <div className="p-4 text-red-500">Content for dynamic step '{id}' not found.</div>;
};
