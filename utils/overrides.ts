
import { GameState, SetupRule, Step, AddSpecialRule, AddFlagRule, StepOverrides, SetComponentRule } from '../types/index';
import { STEP_IDS } from '../data/ids';
import { getNavDeckDetails } from './nav';
import { getAllianceReaverDetails } from './alliance';
import { getDraftDetails } from './draftRules';
import { getResourceDetails } from './resources';
import { getJobSetupDetails } from './jobs';
import { getPrimeDetails } from './prime';
import { STORY_CARDS } from '../data/storyCards';

type DetailsFn =
  | ((gameState: GameState, overrides: StepOverrides) => object)
  | ((gameState: GameState, step: Step) => object)
  | ((gameState: GameState, manualSelection?: 'story' | 'setupCard') => object);

// A map of Step IDs to the function that calculates their details.
// This allows us to dynamically re-calculate and compare step data.
const STEP_ID_TO_DETAILS_FN: Partial<Record<string, DetailsFn>> = {
  [STEP_IDS.C1]: getNavDeckDetails,
  [STEP_IDS.C2]: getAllianceReaverDetails,
  [STEP_IDS.C3]: getDraftDetails,
  [STEP_IDS.D_HAVEN_DRAFT]: getDraftDetails,
  [STEP_IDS.C5]: getResourceDetails,
  [STEP_IDS.C6]: getJobSetupDetails,
  [STEP_IDS.D_RIM_JOBS]: getJobSetupDetails,
  [STEP_IDS.C_PRIME]: getPrimeDetails,
};


/**
 * A map of rule types to the ID of the setup step they primarily affect.
 * This is used as a fallback for rules that don't have a dedicated details function.
 */
const RULE_TYPE_TO_STEP_ID: { [key in SetupRule['type']]?: string | ((rule: SetupRule) => string) } = {
  // These rules are complex and better handled by the main comparison logic above.
  // This map remains as a fallback or for rules without a dedicated details function.
  setJobMode: STEP_IDS.C6,
  setJobContacts: STEP_IDS.C6,
  forbidContact: STEP_IDS.C6,
  allowContacts: STEP_IDS.C6,
  primeContacts: STEP_IDS.C6,
  setNavMode: STEP_IDS.C1,
  setPrimeMode: STEP_IDS.C_PRIME,
  modifyPrime: STEP_IDS.C_PRIME,
  setDraftMode: STEP_IDS.C3,
  setLeaderSetup: STEP_IDS.C3,
  setAllianceMode: STEP_IDS.C2,
  createAlertTokenStack: STEP_IDS.C5,
  setShipPlacement: STEP_IDS.C3,
  modifyResource: STEP_IDS.C5,
  bypassDraft: STEP_IDS.C3,
  setPlayerBadges: STEP_IDS.C3,
  addBoardComponent: STEP_IDS.C5,
  setComponent: (rule: SetupRule) => (rule as SetComponentRule).stepId,
  setJobStepContent: () => STEP_IDS.C6,
  addSpecialRule: (rule: SetupRule): string => {
    const r = rule as AddSpecialRule;
    switch (r.category) {
      case 'jobs': return STEP_IDS.C6;
      case 'allianceReaver': return STEP_IDS.C2;
      case 'draft': return STEP_IDS.C3;
      case 'nav': return STEP_IDS.C1;
      case 'prime': return STEP_IDS.C_PRIME;
      case 'resources': return STEP_IDS.C5;
      case 'goal': return STEP_IDS.C4;
      case 'soloTimer': return STEP_IDS.D_GAME_LENGTH_TOKENS;
      case 'pressures_high': return STEP_IDS.D_PRESSURES_HIGH;
      case 'draft_panel': return STEP_IDS.C3;
      case 'draft_ships': return STEP_IDS.C3;
      case 'draft_placement': return STEP_IDS.C3;
      case 'prime_panel': return STEP_IDS.C_PRIME;
      case 'setup_selection': return STEP_IDS.SETUP_CARD_SELECTION;
      default: return '';
    }
  },
  addFlag: (rule: SetupRule): string => {
    const flag = (rule as AddFlagRule).flag;
    switch (flag) {
        case 'huntForTheArcReaverPlacement':
        case 'placeMixedAlertTokens':
            return STEP_IDS.C2;

        case 'startOutsideAllianceSpace':
        case 'isHeroesAndMisfits':
        case 'soloCrewDraft':
        case 'addBorderHavens':
        case 'allianceSpaceOffLimits':
            return STEP_IDS.C3;

        case 'smugglersBluesSetup':
        case 'lonelySmugglerSetup':
        case 'removeRiver':
        case 'placeAllianceAlertsInAllianceSpace':
            return STEP_IDS.C5;

        case 'removePiracyJobs':
        case 'customJobDraw':
        case 'sharedHandSetup':
            return STEP_IDS.C6;

        case 'startWithAlertCard':
            return STEP_IDS.C_PRIME;
        
        case 'soloGameTimer':
            return STEP_IDS.D_GAME_LENGTH_TOKENS;
        
        default:
            return '';
    }
  }
};

/**
 * Detects which past steps have been changed by a Story Card selection.
 * It does this by comparing the data generated for each step "before" and "after"
 * the story card's rules are applied.
 *
 * @param gameState The full current game state.
 * @param flow The current setup flow.
 * @returns An array of step IDs that have been tangibly overridden.
 */
export function detectOverrides(gameState: GameState, flow: Step[]): string[] {
    if (gameState.selectedStoryCardIndex === null) {
      return [];
    }
  
    const overriddenStepIds = new Set<string>();

    // The "after" state is the current state.
    const stateWithStory = gameState;

    // The "before" state is a temporary state without the story card applied.
    const stateWithoutStory: GameState = {
        ...gameState,
        selectedStoryCardIndex: null,
        selectedGoal: undefined,
        challengeOptions: {},
        // Clear override tracking to get a clean "before" state
        overriddenStepIds: [],
        acknowledgedOverrides: [],
        visitedStepOverrides: [],
    };
  
    for (const step of flow) {
      const detailsFn = STEP_ID_TO_DETAILS_FN[step.id];
  
      if (detailsFn) {
        // Different detail functions have different signatures. We must call them correctly.
        let detailsBefore: object;
        let detailsAfter: object;

        switch (step.id) {
            case STEP_IDS.C5: // getResourceDetails
                detailsBefore = (detailsFn as (gs: GameState) => object)(stateWithoutStory);
                detailsAfter = (detailsFn as (gs: GameState) => object)(stateWithStory);
                break;
            
            case STEP_IDS.C3: // getDraftDetails
            case STEP_IDS.D_HAVEN_DRAFT:
                detailsBefore = (detailsFn as (gs: GameState, s: Step) => object)(stateWithoutStory, step);
                detailsAfter = (detailsFn as (gs: GameState, s: Step) => object)(stateWithStory, step);
                break;

            case STEP_IDS.C1: // getNavDeckDetails
            case STEP_IDS.C2: // getAllianceReaverDetails
            case STEP_IDS.C_PRIME: // getPrimeDetails
            case STEP_IDS.C6: // getJobSetupDetails
            case STEP_IDS.D_RIM_JOBS:
                detailsBefore = (detailsFn as (gs: GameState, o: StepOverrides) => object)(stateWithoutStory, step.overrides || {});
                detailsAfter = (detailsFn as (gs: GameState, o: StepOverrides) => object)(stateWithStory, step.overrides || {});
                break;
            
            // This case should not be reached if STEP_ID_TO_DETAILS_FN is exhaustive.
            // But as a fallback, we assume the (state, step) signature.
            default:
                detailsBefore = (detailsFn as (gs: GameState, s: Step) => object)(stateWithoutStory, step);
                detailsAfter = (detailsFn as (gs: GameState, s: Step) => object)(stateWithStory, step);
                break;
        }
        
        // Use JSON.stringify for a simple but effective deep comparison.
        if (JSON.stringify(detailsBefore) !== JSON.stringify(detailsAfter)) {
          overriddenStepIds.add(step.id);
        }
      } else {
        // Fallback for rules without a dedicated details function.
        const storyCard = stateWithStory.selectedStoryCardIndex !== null ? STORY_CARDS[stateWithStory.selectedStoryCardIndex] : null;
        if(storyCard){
            const rules = storyCard.rules || [];
            for (const rule of rules) {
                const affectedStepIdOrFn = RULE_TYPE_TO_STEP_ID[rule.type];
                let affectedStepId = '';
                if (typeof affectedStepIdOrFn === 'function') {
                    affectedStepId = affectedStepIdOrFn(rule);
                } else if (typeof affectedStepIdOrFn === 'string') {
                    affectedStepId = affectedStepIdOrFn;
                }
        
                if (affectedStepId === step.id) {
                    overriddenStepIds.add(step.id);
                }
            }
        }
      }
    }
  
    return Array.from(overriddenStepIds);
}
