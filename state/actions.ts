import { GameState, SetupMode } from '../types/index';

// Action types related to the 10th Anniversary solo campaign mode.
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
  TOGGLE_UNPREDICTABLE_TOKEN = 'TOGGLE_UNPREDICTABLE_TOKEN',
  RESET_CHALLENGES = 'RESET_CHALLENGES',
  RESET_GAME = 'RESET_GAME',
  TOGGLE_STORY_RATING_FILTER = 'TOGGLE_STORY_RATING_FILTER',
  SET_STORY_OVERRIDES = 'SET_STORY_OVERRIDES',
  ACKNOWLEDGE_OVERRIDES = 'ACKNOWLEDGE_OVERRIDES',
  VISIT_OVERRIDDEN_STEP = 'VISIT_OVERRIDDEN_STEP',
  SET_DRAFT_CONFIG = 'SET_DRAFT_CONFIG',
  TOGGLE_SHOW_HIDDEN_CONTENT = 'TOGGLE_SHOW_HIDDEN_CONTENT',
  SET_SETUP_MODE = 'SET_SETUP_MODE',
  SET_EXPANSIONS_BUNDLE = 'SET_EXPANSIONS_BUNDLE',
  SET_MISSION_DOSSIER_SUBSTEP = 'SET_MISSION_DOSSIER_SUBSTEP',
  INITIALIZE_OPTIONAL_RULES = 'INITIALIZE_OPTIONAL_RULES',
}

export type ExpansionBundle = 'core_only' | 'rim_worlds' | 'all_official';

// You can also define payload types here for more complex actions
export type Action =
  | { type: ActionType.SET_PLAYER_COUNT; payload: number }
  | { type: ActionType.SET_PLAYER_NAME; payload: { index: number; name: string } }
  | { type: ActionType.TOGGLE_EXPANSION; payload: keyof GameState['expansions'] }
  | { type: ActionType.SET_CAMPAIGN_MODE; payload: boolean }
  | { type: ActionType.SET_CAMPAIGN_STORIES; payload: number }
  | { type: ActionType.SET_SETUP_CARD; payload: { id: string; name: string } }
  | { type: ActionType.TOGGLE_FLYING_SOLO }
  | { type: ActionType.SET_STORY_CARD; payload: { index: number | null; goal?: string } }
  | { type: ActionType.SET_GOAL; payload: string }
  | { type: ActionType.TOGGLE_CHALLENGE_OPTION; payload: string }
  | { type: ActionType.SET_DISGRUNTLED_DIE; payload: GameState['optionalRules']['disgruntledDie'] }
  | { type: ActionType.TOGGLE_SHIP_UPGRADES }
  | { type: ActionType.TOGGLE_CONFLICT_RESOLUTION }
  | { type: ActionType.TOGGLE_HIGH_VOLUME_SUPPLY }
  | { type: ActionType.SET_FINAL_STARTING_CREDITS; payload: number }
  | { type: ActionType.TOGGLE_SOLO_OPTION; payload: keyof GameState['soloOptions'] }
  | { type: ActionType.TOGGLE_TIMER_MODE }
  | { type: ActionType.TOGGLE_UNPREDICTABLE_TOKEN; payload: number }
  | { type: ActionType.RESET_CHALLENGES }
  | { type: ActionType.RESET_GAME }
  | { type: ActionType.TOGGLE_STORY_RATING_FILTER; payload: number }
  | { type: ActionType.SET_STORY_OVERRIDES; payload: string[] }
  | { type: ActionType.ACKNOWLEDGE_OVERRIDES; payload: string[] }
  | { type: ActionType.VISIT_OVERRIDDEN_STEP; payload: string }
  | { type: ActionType.SET_DRAFT_CONFIG; payload: GameState['draft'] }
  | { type: ActionType.TOGGLE_SHOW_HIDDEN_CONTENT }
  | { type: ActionType.SET_SETUP_MODE; payload: SetupMode }
  | { type: ActionType.SET_EXPANSIONS_BUNDLE; payload: ExpansionBundle }
  | { type: ActionType.SET_MISSION_DOSSIER_SUBSTEP; payload: number }
  | { type: ActionType.INITIALIZE_OPTIONAL_RULES };