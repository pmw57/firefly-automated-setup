import { GameState, Step, SetupCardStep, SetupContentData } from '../types/index';
import { SETUP_CONTENT } from '../data/steps';
import { STEP_IDS, SETUP_CARD_IDS } from '../data/ids';
import { getSetupCardById } from './selectors/story';

const createStep = (stepDef: SetupCardStep): Step | null => {
  const template = SETUP_CONTENT[stepDef.id];
  if (!template) return null;

  const stepData: SetupContentData = {
    type: template.type,
    title: stepDef.title,
  };

  return {
    type: template.type,
    id: stepDef.id,
    data: stepData,
    overrides: stepDef.overrides,
    page: stepDef.page,
    manual: stepDef.manual,
  };
};

const getInitialSetupSteps = (): Step[] => [
    { type: 'setup', id: STEP_IDS.SETUP_CAPTAIN_EXPANSIONS },
    { type: 'setup', id: STEP_IDS.SETUP_CARD_SELECTION },
];

const getOptionalRulesStep = (): Step[] => {
    // The optional rules step includes house rules that are always available,
    // plus conditional rules for the 10th Anniversary expansion and solo mode.
    // Therefore, this step should always be included in the flow.
    return [{ type: 'setup', id: STEP_IDS.SETUP_OPTIONAL_RULES }];
};

const getCoreStepsFromSetupCard = (state: GameState): Step[] => {
    const primaryCardDef = getSetupCardById(state.setupCardId);
    const isCombinable = !!primaryCardDef?.isCombinable;

    const primarySequenceCardId = isCombinable && state.secondarySetupId
        ? state.secondarySetupId
        : state.setupCardId;

    const setupCard = getSetupCardById(primarySequenceCardId) || getSetupCardById(SETUP_CARD_IDS.STANDARD)!;
    const stepDefs = setupCard.steps;

    let steps = stepDefs
        .map(createStep)
        .filter((step: Step | null): step is Step => step !== null);

    // If a combinable card (like Flying Solo) is active, merge its specific overrides.
    if (isCombinable) {
        const combinableCard = getSetupCardById(state.setupCardId)!;
        const combinableStepMap = new Map(combinableCard.steps.map(s => [s.id, s]));
        
        steps = steps.map((step: Step) => {
            const combinableStepDef = combinableStepMap.get(step.id);
            if (combinableStepDef && step.data) {
                // A matching step was found. Override properties from the combinable card.
                return {
                    ...step,
                    data: {
                        ...step.data,
                        title: combinableStepDef.title // Use title from combinable card
                    },
                    overrides: { ...step.overrides, ...combinableStepDef.overrides },
                    page: combinableStepDef.page || step.page,
                    manual: combinableStepDef.manual || step.manual,
                };
            }
            return step;
        });

        // Add any unique steps from the combinable card that don't exist in the base card's flow.
        combinableCard.steps.forEach((combinableStepDef: SetupCardStep) => {
            if (!steps.some((s: Step) => s.id === combinableStepDef.id)) {
                const newStep = createStep(combinableStepDef);
                if (newStep) steps.push(newStep);
            }
        });
    }
    
    return steps;
};

const getFinalStep = (): Step => ({ type: 'final', id: STEP_IDS.FINAL });

export const calculateSetupFlow = (state: GameState): Step[] => {
    return [
        ...getInitialSetupSteps(),
        ...getOptionalRulesStep(),
        ...getCoreStepsFromSetupCard(state),
        getFinalStep(),
    ];
};