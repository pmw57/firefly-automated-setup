import { StepOverrides, GameState, Step, SetupCardStep, SetupContentData } from '../types';
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
        .filter((step): step is Step => step !== null);

    // If a combinable card (like Flying Solo) is active, merge its specific overrides.
    if (isCombinable) {
        const combinableCard = getSetupCardById(state.setupCardId)!;
        
        const combinableOverrides = combinableCard.steps.reduce((acc, step) => {
            if (step.overrides) {
                acc[step.id] = step.overrides;
            }
            return acc;
        }, {} as Record<string, StepOverrides>);
        
        steps = steps.map(step => {
            if (combinableOverrides[step.id]) {
                return {
                    ...step,
                    overrides: { ...step.overrides, ...combinableOverrides[step.id] },
                };
            }
            return step;
        });

        // Add any unique steps from the combinable card that don't exist in the base card's flow.
        combinableCard.steps.forEach(combinableStepDef => {
            if (!steps.some(s => s.id === combinableStepDef.id)) {
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