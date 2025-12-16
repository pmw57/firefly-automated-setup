
import { GameState, StepOverrides, NavDeckSetupDetails } from '../types';

export const determineNavDeckDetails = (gameState: GameState, overrides: StepOverrides): NavDeckSetupDetails => {
  const isRimMode = overrides.rimNavMode;
  const isBrowncoatNav = overrides.browncoatNavMode;
  const isForceReshuffle = overrides.forceReshuffle;
  const isFlyingSolo = overrides.flyingSoloNavMode;
  const isSolo = gameState.playerCount === 1;
  const isHighPlayerCount = gameState.playerCount >= 3;
  
  const hasForcedReshuffle = isRimMode || isForceReshuffle;
  
  let specialRule: NavDeckSetupDetails['specialRule'] = null;
  if (isBrowncoatNav) specialRule = 'hardcore';
  else if (isFlyingSolo) specialRule = 'flyingSolo';
  else if (hasForcedReshuffle) specialRule = 'reshuffle';

  return {
    specialRule,
    clearerSkies: !!overrides.clearerSkiesNavMode,
    showStandardRules: !isFlyingSolo && !hasForcedReshuffle && !isBrowncoatNav,
    isSolo,
    isHighPlayerCount
  };
};
