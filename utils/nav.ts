import { GameState, StepOverrides, NavDeckSetupDetails } from '../types';

export const determineNavDeckDetails = (gameState: GameState, overrides: StepOverrides): NavDeckSetupDetails => {
  const isSolo = gameState.playerCount === 1;
  const isHighPlayerCount = gameState.playerCount >= 3;

  const forceReshuffle = !!(
    overrides.rimNavMode ||
    overrides.forceReshuffle ||
    overrides.browncoatNavMode ||
    overrides.flyingSoloNavMode
  );
  
  return {
    forceReshuffle,
    clearerSkies: !!overrides.clearerSkiesNavMode,
    showStandardRules: !forceReshuffle,
    isSolo,
    isHighPlayerCount,
  };
};