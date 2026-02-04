
import { GameState } from '../../types/index';
import { Action, ActionType } from '../actions';

export function uiReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case ActionType.TOGGLE_STORY_RATING_FILTER:
            return {
              ...state,
              storyRatingFilters: {
                ...state.storyRatingFilters,
                [action.payload]: !state.storyRatingFilters[action.payload],
              },
            };
      
        case ActionType.SET_STORY_OVERRIDES:
            return { ...state, overriddenStepIds: action.payload };
      
        case ActionType.ACKNOWLEDGE_OVERRIDES:
            return { ...state, acknowledgedOverrides: action.payload };
            
        case ActionType.VISIT_OVERRIDDEN_STEP:
            if (state.visitedStepOverrides.includes(action.payload)) {
              return state;
            }
            return {
              ...state,
              visitedStepOverrides: [...state.visitedStepOverrides, action.payload],
            };

        case ActionType.SET_MISSION_DOSSIER_SUBSTEP:
            return { ...state, missionDossierSubStep: action.payload };
    
        case ActionType.RIVERS_RUN_CONFIRM_SETUP:
            return { ...state, riversRun_setupConfirmed: true };

        default:
            return state;
    }
}
