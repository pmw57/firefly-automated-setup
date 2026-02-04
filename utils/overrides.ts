
import { GameState, SetupRule, AddSpecialRule, AddFlagRule } from '../types/index';
import { STEP_IDS } from '../data/ids';
import { getResolvedRules } from './selectors/rules';

/**
 * A map of rule types to the ID of the setup step they primarily affect.
 * This allow us to trace a Story Card rule back to the step it overrides.
 */
const RULE_TYPE_TO_STEP_ID: Record<SetupRule['type'], string | ((rule: SetupRule) => string)> = {
  // Core Mode Setters
  setJobMode: STEP_IDS.C6,
  setJobContacts: STEP_IDS.C6,
  forbidContact: STEP_IDS.C6,
  allowContacts: STEP_IDS.C6,
  primeContacts: STEP_IDS.C6,
  setJobStepContent: STEP_IDS.C6,
  
  setNavMode: STEP_IDS.C1,
  
  setAllianceMode: STEP_IDS.C2,
  setAlliancePlacement: STEP_IDS.C2,
  setReaverPlacement: STEP_IDS.C2,
  
  setDraftMode: STEP_IDS.C3,
  setLeaderSetup: STEP_IDS.C3,
  setShipPlacement: STEP_IDS.C3,
  bypassDraft: STEP_IDS.C3,
  setPlayerBadges: STEP_IDS.C3,
  
  setPrimeMode: STEP_IDS.C_PRIME,
  modifyPrime: STEP_IDS.C_PRIME,
  
  modifyResource: STEP_IDS.C5,
  createAlertTokenStack: STEP_IDS.C5,
  addBoardComponent: STEP_IDS.C5,
  
  // Generic Rule Injectors - Map based on category
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
  
  // Flag Injectors - Map based on specific flag logic
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
        case 'placeReaverAlertsInMotherlodeAndUroboros':
            return STEP_IDS.C5;

        case 'removePiracyJobs':
        case 'customJobDraw':
        case 'sharedHandSetup':
        case 'isSolitaireFirefly':
            return STEP_IDS.C6;

        case 'startWithAlertCard':
        case 'disablePriming':
            return STEP_IDS.C_PRIME;
        
        case 'soloGameTimer':
        case 'disableSoloTimer':
        case 'replacesSoloTimerSetup':
            return STEP_IDS.D_GAME_LENGTH_TOKENS;
        
        case 'requiresSetupConfirmation':
            return STEP_IDS.SETUP_CARD_SELECTION;

        case 'hasConditionalHavenPageReference':
             return STEP_IDS.C3;
             
        default:
            return '';
    }
  }
};

/**
 * Detects which steps have been modified by the active Story Card.
 * Uses lightweight rule tracing instead of heavy state comparison.
 *
 * @param gameState The full current game state.
 * @param flow The current setup flow.
 * @returns An array of step IDs that are affected by active story rules.
 */
export function detectOverrides(gameState: GameState, flow: import('../types').Step[]): string[] {
    if (gameState.selectedStoryCardIndex === null) {
      return [];
    }
  
    const overriddenStepIds = new Set<string>();
    const allRules = getResolvedRules(gameState);

    // Filter for rules that come specifically from the story
    const storyRules = allRules.filter(r => r.source === 'story');

    for (const rule of storyRules) {
        const stepMapper = RULE_TYPE_TO_STEP_ID[rule.type];
        if (stepMapper) {
            let stepId = '';
            if (typeof stepMapper === 'function') {
                stepId = stepMapper(rule);
            } else {
                stepId = stepMapper;
            }

            if (stepId) {
                overriddenStepIds.add(stepId);
            }
        }
    }
  
    // Filter against the current flow to ensure we only flag steps that exist in this setup
    const activeStepIds = new Set(flow.map(s => s.id));
    return Array.from(overriddenStepIds).filter(id => activeStepIds.has(id));
}
