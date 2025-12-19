import { GameState, AllianceReaverDetails, StoryCardDef } from '../types';
import { hasFlag } from './data';

export const calculateAllianceReaverDetails = (gameState: GameState, activeStoryCard: StoryCardDef | undefined): AllianceReaverDetails => {
  const storyConfig = activeStoryCard?.setupConfig;

  const smugglersBluesSetup = hasFlag(storyConfig, 'smugglersBluesSetup');

  return {
      useSmugglersRimRule: smugglersBluesSetup && gameState.expansions.blue && gameState.expansions.kalidasa,
      alertStackCount: storyConfig?.createAlertTokenStackMultiplier ? storyConfig.createAlertTokenStackMultiplier * gameState.playerCount : 0,
      placeAllianceAlertsInAllianceSpace: hasFlag(storyConfig, 'placeAllianceAlertsInAllianceSpace'),
      placeMixedAlertTokens: hasFlag(storyConfig, 'placeMixedAlertTokens'),
      smugglersBluesSetup,
      lonelySmugglerSetup: hasFlag(storyConfig, 'lonelySmugglerSetup'),
      startWithAlertCard: hasFlag(storyConfig, 'startWithAlertCard'),
  };
};