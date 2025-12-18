import { GameState, AllianceReaverDetails } from '../types';
import { hasFlag } from './data';
import { STORY_CARDS } from '../data/storyCards';

export const calculateAllianceReaverDetails = (gameState: GameState): AllianceReaverDetails => {
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard);
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
