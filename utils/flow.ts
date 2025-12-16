
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
    const isBrowncoatWay = state.setupCardId === SETUP_CARD_IDS.THE_BROWNCOAT_WAY;

    if ((isFlyingSolo || has10th) && !isBrowncoatWay) {
        return [{ type: 'setup', id: STEP_IDS.SETUP_OPTIONAL_RULES }];
    }
    return [];
};

const getCoreStepsFromSetupCard = (state: GameState): Step[] => {
    // If Flying Solo is active, the core board setup is determined by the secondary card.
    const setupId = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO 
        ? state.secondarySetupId 
        : state.setupCardId;
        
    const setupCard = SETUP_CARDS.find(s => s.id === setupId) || SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.STANDARD)!;
    
    // For Flying Solo, we use the secondary card's steps but the primary card's definition for the main flow
    if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO) {
        const flyingSoloCard = SETUP_CARDS.find(c => c.id === SETUP_CARD_IDS.FLYING_SOLO)!;
        return flyingSoloCard.steps
            .map(stepDef => createStep(stepDef.id, stepDef.overrides))
            .filter((step): step is Step => step !== null);
    }

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
