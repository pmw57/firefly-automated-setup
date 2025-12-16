
import React from 'react';
import { GameState, Step } from '../types';
import { JobStep } from './JobStep';
import { DraftStep } from './DraftStep';

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
  gameState: GameState;
  setGameState?: React.Dispatch<React.SetStateAction<GameState>>; 
}

export const DynamicStepHandler: React.FC<DynamicStepHandlerProps> = (props) => {
  const { id } = props.step;

  // --- Core Logic Steps Delegated ---
  if (id.includes('D_RIM_JOBS')) {
    return <JobStep {...props} />;
  }
  if (id.includes('D_HAVEN_DRAFT')) {
    return <DraftStep {...props} />;
  }

  // --- Individual Dynamic Steps ---
  if (id.includes('D_NO_SURE_THINGS')) {
    return <NoSureThingsStep />;
  }
  if (id.includes('D_GAME_LENGTH_TOKENS')) {
    return <GameLengthTokensStep {...props} />;
  }
  if (id.includes('D_TIME_LIMIT')) {
    return <TimeLimitStep />;
  }
  if (id.includes('D_SHUTTLE')) {
    return <ShuttleDraftStep />;
  }
  if (id.includes('D_BC_CAPITOL')) {
    return <StartingCapitolStep {...props} />;
  }
  if (id.includes('D_LOCAL_HEROES')) {
    return <LocalHeroesStep />;
  }
  if (id.includes('D_ALLIANCE_ALERT')) {
    return <AllianceAlertStep />;
  }
  if (id.includes('D_PRESSURES_HIGH')) {
    return <PressuresHighStep />;
  }
  if (id.includes('D_STRIP_MINING')) {
    return <StripMiningStep {...props} />;
  }

  // Fallback for any unhandled dynamic step
  return <div className="p-4 text-red-500">Content for dynamic step '{id}' not found.</div>;
};
