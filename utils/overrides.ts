import { SetupRule, Step, AddSpecialRule, AddFlagRule } from '../types';
import { STEP_IDS } from '../data/ids';

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
  createAlertTokenStack: STEP_IDS.C2,
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
    const r = rule as AddFlagRule;
    const flag = r.flag;

    if (['huntForTheArcReaverPlacement', 'smugglersBluesSetup', 'startWithAlertCard', 'placeAllianceAlertsInAllianceSpace', 'placeMixedAlertTokens', 'lonelySmugglerSetup'].includes(flag)) {
        return STEP_IDS.C2;
    }
    if (['startOutsideAllianceSpace', 'isHeroesAndMisfits', 'soloCrewDraft', 'addBorderHavens', 'allianceSpaceOffLimits'].includes(flag)) {
        return STEP_IDS.C3;
    }
    if (['removePiracyJobs', 'customJobDraw'].includes(flag)) {
        return STEP_IDS.C6;
    }
    
    // Most flags apply during gameplay, not setup.
    return '';
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