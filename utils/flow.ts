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

    // Dynamically adjust titles for solo mode to be singular.
    if (state.playerCount === 1) {
        steps = steps.map((step: Step) => {
            if (step.id === STEP_IDS.C3 && step.data) {
                // "Choose Ships & Leaders" -> "Choose Ship & Leader"
                const newTitle = step.data.title.replace('Ships', 'Ship').replace('Leaders', 'Leader');
                return { ...step, data: { ...step.data, title: newTitle } };
            }
            if (step.id === STEP_IDS.D_HAVEN_DRAFT && step.data) {
                // "Choose Leaders, Havens & Ships" -> "Choose Leader, Haven & Ship"
                const newTitle = step.data.title.replace('Leaders', 'Leader').replace('Havens', 'Haven').replace('Ships', 'Ship');
                return { ...step, data: { ...step.data, title: newTitle } };
            }
            if (step.id === STEP_IDS.D_SHUTTLE && step.data) {
                // "Choose Shuttles" -> "Choose Shuttle"
                const newTitle = step.data.title.replace('Shuttles', 'Shuttle');
                return { ...step, data: { ...step.data, title: newTitle } };
            }
            return step;
        });
    }
    
    return steps;
};

const getFinalStep = (): Step => ({ type: 'final', id: STEP_IDS.FINAL });

export const calculateSetupFlow = (state: GameState): Step[] => {
    const optionalRulesStep = state.setupMode === 'advanced' ? getOptionalRulesStep() : [];

    return [
        ...getInitialSetupSteps(),
        ...optionalRulesStep,
        ...getCoreStepsFromSetupCard(state),
        getFinalStep(),
    ];
};