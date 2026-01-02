import { SetupRule, Step, AddSpecialRule, AddFlagRule } from '../types';
import { STEP_IDS } from '../data/ids';

/**
 * A map of rule types to the ID of the setup step they primarily affect.
 * This is used to detect when a Story Card modifies a step that the user has already passed.
 */
const RULE_TYPE_TO_STEP_ID: { [key in SetupRule['type']]?: string | ((rule: SetupRule) => string) } = {
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
        // Alliance & Reaver Step (C2)
        case 'huntForTheArcReaverPlacement':
        case 'placeAllianceAlertsInAllianceSpace':
        case 'placeMixedAlertTokens':
            return STEP_IDS.C2;

        // Draft Step (C3)
        case 'startOutsideAllianceSpace':
        case 'isHeroesAndMisfits':
        case 'soloCrewDraft':
        case 'addBorderHavens':
        case 'allianceSpaceOffLimits':
            return STEP_IDS.C3;

        // Resources Step (C5)
        case 'smugglersBluesSetup':
        case 'lonelySmugglerSetup':
        case 'removeRiver':
            return STEP_IDS.C5;

        // Jobs Step (C6)
        case 'removePiracyJobs':
        case 'customJobDraw':
        case 'sharedHandSetup':
            return STEP_IDS.C6;

        // Prime Step (C_PRIME)
        case 'startWithAlertCard':
            return STEP_IDS.C_PRIME;
        
        default:
            return '';
    }
  }
};

export function detectOverrides(storyCard: import('../types').StoryCardDef, flow: Step[], currentStepIndex: number): string[] {
    if (!storyCard.rules) return [];

    const pastStepIds = new Set(flow.slice(0, currentStepIndex).map(step => step.id));
    const overriddenStepIds = new Set<string>();

    for (const rule of storyCard.rules) {
        const affectedStepIdOrFn = RULE_TYPE_TO_STEP_ID[rule.type];
        let affectedStepId = '';
        if (typeof affectedStepIdOrFn === 'function') {
            affectedStepId = affectedStepIdOrFn(rule);
        } else if (typeof affectedStepIdOrFn === 'string') {
            affectedStepId = affectedStepIdOrFn;
        }

        if (affectedStepId && pastStepIds.has(affectedStepId)) {
            overriddenStepIds.add(affectedStepId);
        }
    }
    
    return Array.from(overriddenStepIds);
}