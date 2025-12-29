
import { GameState } from '../types/index';

export enum ActionType {
  SET_PLAYER_COUNT = 'SET_PLAYER_COUNT',
  SET_PLAYER_NAME = 'SET_PLAYER_NAME',
  TOGGLE_EXPANSION = 'TOGGLE_EXPANSION',
  SET_CAMPAIGN_MODE = 'SET_CAMPAIGN_MODE',
  SET_CAMPAIGN_STORIES = 'SET_CAMPAIGN_STORIES',
  SET_SETUP_CARD = 'SET_SETUP_CARD',
  TOGGLE_FLYING_SOLO = 'TOGGLE_FLYING_SOLO',
  SET_STORY_CARD = 'SET_STORY_CARD',
  SET_GOAL = 'SET_GOAL',
  TOGGLE_CHALLENGE_OPTION = 'TOGGLE_CHALLENGE_OPTION',
  SET_DISGRUNTLED_DIE = 'SET_DISGRUNTLED_DIE',
  TOGGLE_SHIP_UPGRADES = 'TOGGLE_SHIP_UPGRADES',
  TOGGLE_CONFLICT_RESOLUTION = 'TOGGLE_CONFLICT_RESOLUTION',
  TOGGLE_HIGH_VOLUME_SUPPLY = 'TOGGLE_HIGH_VOLUME_SUPPLY',
  SET_FINAL_STARTING_CREDITS = 'SET_FINAL_STARTING_CREDITS',
  TOGGLE_SOLO_OPTION = 'TOGGLE_SOLO_OPTION',
  TOGGLE_TIMER_MODE = 'TOGGLE_TIMER_MODE',
  RESET_CHALLENGES = 'RESET_CHALLENGES',
  RESET_GAME = 'RESET_GAME',
}

// You can also define payload types here for more complex actions
export type Action =
  | { type: ActionType.SET_PLAYER_COUNT; payload: number }
  | { type: ActionType.SET_PLAYER_NAME; payload: { index: number; name: string } }
  | { type: ActionType.TOGGLE_EXPANSION; payload: keyof GameState['expansions'] }
  | { type: ActionType.SET_CAMPAIGN_MODE; payload: boolean }
  | { type: ActionType.SET_CAMPAIGN_STORIES; payload: number }
  | { type: ActionType.SET_SETUP_CARD; payload: { id: string; name: string } }
  | { type: ActionType.TOGGLE_FLYING_SOLO }
  | { type: ActionType.SET_STORY_CARD; payload: { title: string; goal?: string } }
  | { type: ActionType.SET_GOAL; payload: string }
  | { type: ActionType.TOGGLE_CHALLENGE_OPTION; payload: string }
  | { type: ActionType.SET_DISGRUNTLED_DIE; payload: GameState['optionalRules']['disgruntledDie'] }
  | { type: ActionType.TOGGLE_SHIP_UPGRADES }
  | { type: ActionType.TOGGLE_CONFLICT_RESOLUTION }
  | { type: ActionType.TOGGLE_HIGH_VOLUME_SUPPLY }
  | { type: ActionType.SET_FINAL_STARTING_CREDITS; payload: number }
  | { type: ActionType.TOGGLE_SOLO_OPTION; payload: keyof GameState['soloOptions'] }
  | { type: ActionType.TOGGLE_TIMER_MODE }
  | { type: ActionType.RESET_CHALLENGES }
  | { type: ActionType.RESET_GAME };