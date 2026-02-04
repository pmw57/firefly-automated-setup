
import { GameState } from '../../types/index';
import { Action, ActionType } from '../actions';

export function sessionReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case ActionType.SET_DISGRUNTLED_DIE:
            return { ...state, optionalRules: { ...state.optionalRules, disgruntledDie: action.payload } };
            
        case ActionType.TOGGLE_SHIP_UPGRADES:
            return { ...state, optionalRules: { ...state.optionalRules, optionalShipUpgrades: !state.optionalRules.optionalShipUpgrades } };
          
        case ActionType.TOGGLE_CONFLICT_RESOLUTION:
            return { ...state, optionalRules: { ...state.optionalRules, resolveConflictsManually: !state.optionalRules.resolveConflictsManually } };
      
        case ActionType.TOGGLE_HIGH_VOLUME_SUPPLY:
            return { ...state, optionalRules: { ...state.optionalRules, highVolumeSupply: !state.optionalRules.highVolumeSupply } };
      
        case ActionType.SET_FINAL_STARTING_CREDITS:
            return { ...state, finalStartingCredits: action.payload };
            
        case ActionType.TOGGLE_SOLO_OPTION:
            return { ...state, soloOptions: { ...state.soloOptions, [action.payload]: !state.soloOptions[action.payload] } };
            
        case ActionType.TOGGLE_TIMER_MODE:
            return { ...state, timerConfig: { ...state.timerConfig, mode: state.timerConfig.mode === 'standard' ? 'unpredictable' : 'standard' } };
      
        case ActionType.TOGGLE_UNPREDICTABLE_TOKEN: {
            const newIndices = state.timerConfig.unpredictableSelectedIndices.includes(action.payload)
                ? state.timerConfig.unpredictableSelectedIndices.filter(i => i !== action.payload)
                : [...state.timerConfig.unpredictableSelectedIndices, action.payload];
            return { ...state, timerConfig: { ...state.timerConfig, unpredictableSelectedIndices: newIndices } };
        }
        
        case ActionType.SET_DRAFT_CONFIG:
            return { ...state, draft: action.payload };

        case ActionType.INITIALIZE_OPTIONAL_RULES:
            return {
              ...state,
              soloOptions: {
                  noSureThings: false,
                  shesTrouble: false,
                  recipeForUnpleasantness: false,
              },
              optionalRules: {
                  disgruntledDie: 'standard',
                  optionalShipUpgrades: true,
                  resolveConflictsManually: false,
                  highVolumeSupply: true,
              },
            };

        default:
            return state;
    }
}
