
import { GameState, AddFlagRule } from '../../types/index';
import { Action, ActionType } from '../actions';
import { SETUP_CARD_IDS } from '../../data/ids';
import { SETUP_CARDS } from '../../data/setupCards';

const handleToggleFlyingSolo = (state: GameState): GameState => {
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    if (isFlyingSolo) {
        const newId = state.secondarySetupId || '';
        const newDef = SETUP_CARDS.find(c => c.id === newId);
        return {
            ...state,
            setupCardId: newId,
            setupCardName: newDef?.label || '',
            secondarySetupId: undefined,
            draft: { state: null, isManual: false },
        };
    } else {
        return {
            ...state,
            setupCardId: SETUP_CARD_IDS.FLYING_SOLO,
            setupCardName: 'Flying Solo',
            secondarySetupId: state.setupCardId,
            draft: { state: null, isManual: false },
        };
    }
};

export function setupReducer(state: GameState, action: Action): GameState {
    switch (action.type) {
        case ActionType.SET_SETUP_CARD: {
            const { id, name } = action.payload;
            if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
                return { ...state, secondarySetupId: id };
            } else {
                return { ...state, setupCardId: id, setupCardName: name, secondarySetupId: undefined, draft: { state: null, isManual: false } };
            }
        }

        case ActionType.TOGGLE_FLYING_SOLO:
            return handleToggleFlyingSolo(state);

        case ActionType.SET_CAMPAIGN_MODE:
            return { ...state, isCampaign: action.payload };
      
        case ActionType.SET_CAMPAIGN_STORIES:
            return { ...state, campaignStoriesCompleted: Math.max(0, action.payload) };

        case ActionType.SET_ACTIVE_STORY: {
            const { story, index, goal } = action.payload;
            
            const newChallengeOptions: Record<string, boolean> = {};
      
            // If Smuggler's Blues is selected, check if we should default the variant.
            const hasSmugglersBluesFlag = story?.rules?.some(r => r.type === 'addFlag' && (r as AddFlagRule).flag === 'smugglersBluesSetup');
            if (hasSmugglersBluesFlag) {
              const canUseRimRule = state.expansions.blue && state.expansions.kalidasa;
              if (canUseRimRule) {
                newChallengeOptions.smugglers_blues_rim_variant = true;
              }
            }
      
            return { 
              ...state, 
              activeStory: story,
              selectedStoryCardIndex: index, 
              selectedGoal: goal, 
              challengeOptions: newChallengeOptions, 
              overriddenStepIds: [], 
              acknowledgedOverrides: [], 
              visitedStepOverrides: [],
              missionDossierSubStep: 1,
              riversRun_setupConfirmed: false,
            };
        }

        case ActionType.SET_GOAL:
            return { ...state, selectedGoal: action.payload };
      
        case ActionType.RESET_CHALLENGES:
            return { ...state, challengeOptions: {} };
      
        case ActionType.TOGGLE_CHALLENGE_OPTION:
            return {
              ...state,
              challengeOptions: { ...state.challengeOptions, [action.payload]: !state.challengeOptions[action.payload] }
            };

        default:
            return state;
    }
}
