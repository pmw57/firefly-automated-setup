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
    const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
    
    // If Flying Solo is active and paired with a specific setup card, that card's sequence should be prioritized.
    // If it's just "Flying Solo" (paired with Standard), then Flying Solo's own sequence is correct.
    const primarySequenceCardId = isFlyingSolo && (state.secondarySetupId && state.secondarySetupId !== SETUP_CARD_IDS.STANDARD)
        ? state.secondarySetupId
        : (isFlyingSolo ? SETUP_CARD_IDS.FLYING_SOLO : state.setupCardId);

    const setupCard = SETUP_CARDS.find(s => s.id === primarySequenceCardId) || SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.STANDARD)!;

    let steps = setupCard.steps
        .map(stepDef => createStep(stepDef.id, stepDef.overrides))
        .filter((step): step is Step => step !== null);

    // If Flying Solo is active, we merge its specific overrides and add any unique steps.
    if (isFlyingSolo) {
        const flyingSoloCard = SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.FLYING_SOLO)!;
        
        // Create a map of overrides from the Flying Solo card for easy lookup.
        const flyingSoloOverrides = flyingSoloCard.steps.reduce((acc, step) => {
            if (step.overrides) {
                acc[step.id] = step.overrides;
            }
            return acc;
        }, {} as Record<string, StepOverrides>);
        
        // Merge the Flying Solo overrides into the base steps from the secondary card.
        steps = steps.map(step => {
            if (flyingSoloOverrides[step.id]) {
                return {
                    ...step,
                    overrides: { ...step.overrides, ...flyingSoloOverrides[step.id] },
                };
            }
            return step;
        });

        // Ensure the unique "Game Length Tokens" step from Flying Solo is always added at the end.
        const hasGameLengthStep = steps.some(s => s.id === STEP_IDS.D_GAME_LENGTH_TOKENS);
        if (!hasGameLengthStep) {
            const gameLengthStepDef = flyingSoloCard.steps.find(s => s.id === STEP_IDS.D_GAME_LENGTH_TOKENS);
            if (gameLengthStepDef) {
                const gameLengthStep = createStep(gameLengthStepDef.id, gameLengthStepDef.overrides);
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