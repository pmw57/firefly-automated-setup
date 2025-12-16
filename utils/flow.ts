
import { StepOverrides, GameState, Step } from '../types';
import { SETUP_CARDS } from '../data/setupCards';
import { SETUP_CONTENT } from '../data/steps';
import { STEP_IDS, SETUP_CARD_IDS } from '../data/ids';

const createStep = (id: string, overrides: StepOverrides = {}): Step | null => {
  const content = SETUP_CONTENT[id];
  if (!content) return null;
  return {
    type: content.type,
    id: content.id || content.elementId || id,
    data: content,
    overrides
  };
};

const getInitialSetupSteps = (): Step[] => [
    { type: 'setup', id: STEP_IDS.SETUP_CAPTAIN_EXPANSIONS },
    { type: 'setup', id: STEP_IDS.SETUP_CARD_SELECTION },
];

const getOptionalRulesStep = (state: GameState): Step[] => {
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    const has10th = state.expansions.tenth;
    if (isFlyingSolo || has10th) {
        return [{ type: 'setup', id: STEP_IDS.SETUP_OPTIONAL_RULES }];
    }
    return [];
};

const getCoreStepsFromSetupCard = (state: GameState): Step[] => {
    const setupCard = SETUP_CARDS.find(s => s.id === state.setupCardId) || SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.STANDARD)!;
    return setupCard.steps
        .map(stepDef => createStep(stepDef.id, stepDef.overrides))
        .filter((step): step is Step => step !== null);
};

const getFinalStep = (): Step => ({ type: 'final', id: STEP_IDS.FINAL });

export const calculateSetupFlow = (state: GameState): Step[] => {
    return [
        ...getInitialSetupSteps(),
        ...getOptionalRulesStep(state),
        ...getCoreStepsFromSetupCard(state),
        getFinalStep(),
    ];
};
