import { GameState, SetupRule, Step, AddSpecialRule, AddFlagRule } from '../types/index';
import { STEP_IDS } from '../data/ids';
import { getNavDeckDetails } from './nav';
import { getAllianceReaverDetails } from './alliance';
import { getDraftDetails } from './draftRules';
import { getResourceDetails } from './resources';
import { getJobSetupDetails } from './jobs';
import { getPrimeDetails } from './prime';
import { STORY_CARDS } from '../data/storyCards';

type DetailsFn = (gameState: GameState, ...args: any[]) => object;

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
  createAlertTokenStack: STEP_IDS.C_PRIME,
  setShipPlacement: STEP_IDS.C3,
  modifyResource: STEP_IDS.C5,
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
        case 'placeAllianceAlertsInAllianceSpace': // Moved from C2 to C5 (Resources)
            return STEP_IDS.C5;

        case 'removePiracyJobs':
        case 'customJobDraw':
        case 'sharedHandSetup':
            return STEP_IDS.C6;

        case 'startWithAlertCard':
            return STEP_IDS.C_PRIME;
        
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
 * @param currentStepIndex The user's current position in the flow.
 * @returns An array of step IDs that have been tangibly overridden.
 */
export function detectOverrides(gameState: GameState, flow: Step[], currentStepIndex: number): string[] {
    if (gameState.selectedStoryCardIndex === null) {
      return [];
    }
  
    const pastSteps = flow.slice(0, currentStepIndex);
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
  
    for (const step of pastSteps) {
      const detailsFn = STEP_ID_TO_DETAILS_FN[step.id];
  
      if (detailsFn) {
        // Compare the data generated for the step before and after applying the story.
        const detailsBefore = detailsFn(stateWithoutStory, step);
        const detailsAfter = detailsFn(stateWithStory, step);
        
        // Use JSON.stringify for a simple but effective deep comparison.
        if (JSON.stringify(detailsBefore) !== JSON.stringify(detailsAfter)) {
          overriddenStepIds.add(step.id);
        }
      } else {
        // Fallback for rules without a dedicated details function.
        // This is less accurate but covers edge cases.
        const storyCard = stateWithStory.selectedStoryCardIndex !== null ? flow[stateWithStory.selectedStoryCardIndex] : null;
        if(storyCard?.data?.title){
            const rules = STORY_CARDS.find(c => c.title === storyCard.data?.title)?.rules || [];
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
  
// FIX: This erroneous line was shadowing the imported `STORY_CARDS` array with the number 0, causing a type error. It has been removed.
// Keep a reference to the old function signature for rules that don't have a details function
// const STORY_CARDS =- [];