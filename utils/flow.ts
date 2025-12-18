import { StepOverrides, GameState, Step, SetupCardStep, SetupContentData } from '../types';
import { SETUP_CARDS } from '../data/setupCards';
import { SETUP_CONTENT } from '../data/steps';
import { STEP_IDS, SETUP_CARD_IDS } from '../data/ids';

const createStep = (stepDef: SetupCardStep): Step | null => {
  const template = SETUP_CONTENT[stepDef.id];
  if (!template) return null;

  const stepData: SetupContentData = {
    ...template,
    title: stepDef.title,
  };

  return {
    type: stepData.type,
    id: stepData.id || stepData.elementId || stepDef.id,
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

const getOptionalRulesStep = (state: GameState): Step[] => {
    // Optional rules are part of the 10th Anniversary Expansion content.
    // They should show if the expansion is enabled.
    if (state.expansions.tenth) {
        return [{ type: 'setup', id: STEP_IDS.SETUP_OPTIONAL_RULES }];
    }

    return [];
};

const getCoreStepsFromSetupCard = (state: GameState): Step[] => {
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    
    // If Flying Solo is active and paired with a specific setup card, that card's sequence should be prioritized.
    // If it's just "Flying Solo" (paired with Standard), then Flying Solo's own sequence is correct.
    const primarySequenceCardId = isFlyingSolo && (state.secondarySetupId && state.secondarySetupId !== SETUP_CARD_IDS.STANDARD)
        ? state.secondarySetupId
        : (isFlyingSolo ? SETUP_CARD_IDS.FLYING_SOLO : state.setupCardId);

    const setupCard = SETUP_CARDS.find(s => s.id === primarySequenceCardId) || SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.STANDARD)!;

    let stepDefs = setupCard.steps;
    
    const secondaryIsStandard = !state.secondarySetupId || state.secondarySetupId === SETUP_CARD_IDS.STANDARD;
    const isStandardBasedSetup = (setupCard.id === SETUP_CARD_IDS.STANDARD) || (isFlyingSolo && secondaryIsStandard);

    if (isStandardBasedSetup) {
        const hasTenth = state.expansions.tenth;
        const page1 = hasTenth ? 12 : 3;
        const page2 = hasTenth ? 13 : 4;
        const manual = hasTenth ? '10th AE' : 'Core';
        
        stepDefs = stepDefs.map(stepDef => {
            if (['C1', 'C2', 'C3'].includes(stepDef.id)) {
                return { ...stepDef, page: page1, manual };
            }
            if (['C4', 'C5', 'C6', 'C_PRIME'].includes(stepDef.id)) {
                return { ...stepDef, page: page2, manual };
            }
            return stepDef;
        });
    }

    let steps = stepDefs
        .map(stepDef => createStep(stepDef))
        .filter((step): step is Step => step !== null);

    // If Flying Solo is active, we merge its specific overrides and add any unique steps.
    if (isFlyingSolo) {
        const flyingSoloCard = SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.FLYING_SOLO)!;
        
        // Create a map of overrides from the Flying Solo card for easy lookup.
        const flyingSoloOverrides = flyingSoloCard.steps.reduce((acc, step) => {
            if (step.overrides) {
                // Use the raw ID for matching (C1, C2 etc.)
                acc[step.id] = step.overrides;
            }
            return acc;
        }, {} as Record<string, StepOverrides>);
        
        // Merge the Flying Solo overrides into the base steps from the secondary card.
        steps = steps.map(step => {
            const rawId = Object.keys(SETUP_CONTENT).find(key => SETUP_CONTENT[key].id === step.id || SETUP_CONTENT[key].elementId === step.id);
            if (rawId && flyingSoloOverrides[rawId]) {
                return {
                    ...step,
                    overrides: { ...step.overrides, ...flyingSoloOverrides[rawId] },
                };
            }
            return step;
        });

        // Ensure the unique "Game Length Tokens" step from Flying Solo is always added at the end.
        const hasGameLengthStep = steps.some(s => s.id === STEP_IDS.D_GAME_LENGTH_TOKENS);
        if (!hasGameLengthStep) {
            const gameLengthStepDef = flyingSoloCard.steps.find(s => s.id === STEP_IDS.D_GAME_LENGTH_TOKENS);
            if (gameLengthStepDef) {
                const gameLengthStep = createStep(gameLengthStepDef);
                if (gameLengthStep) {
                    steps.push(gameLengthStep);
                }
            }
        }
    }
    
    return steps;
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