import { GameState, StoryCardDef } from '../types';
import { hasFlag } from './data';

export interface AllianceReaverDetails {
  useSmugglersRimRule: boolean;
  alertStackCount: number;
}

/**
 * Calculates details specific to the Alliance & Reaver setup step.
 */
export const calculateAllianceReaverDetails = (
  gameState: GameState,
  activeStoryCard: StoryCardDef
): AllianceReaverDetails => {
  const { createAlertTokenStackMultiplier } = activeStoryCard.setupConfig || {};
  const smugglersBluesSetup = hasFlag(activeStoryCard.setupConfig, 'smugglersBluesSetup');

  const useSmugglersRimRule = !!(
    smugglersBluesSetup &&
    gameState.expansions.blue &&
    gameState.expansions.kalidasa
  );

  const alertStackCount = createAlertTokenStackMultiplier
    ? createAlertTokenStackMultiplier * gameState.playerCount
    : 0;

  return { useSmugglersRimRule, alertStackCount };
};
