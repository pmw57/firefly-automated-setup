
import { StoryCardDef, StepOverrides, DiceResult, DraftState, GameState, Expansions, Step } from './types';
import { EXPANSIONS_METADATA, STORY_CARDS, SETUP_CARDS, SETUP_CONTENT } from './constants';

// --- Draft Logic ---
export const calculateDraftOutcome = (
  currentRolls: DiceResult[], 
  playerCount: number,
  overrideWinnerIndex?: number
): DraftState => {
  let winnerIndex = overrideWinnerIndex;

  // If no winner is explicitly provided, calculate based on max roll (first player with max wins)
  if (winnerIndex === undefined || winnerIndex === -1) {
    const maxRoll = Math.max(...currentRolls.map(r => r.roll));
    winnerIndex = currentRolls.findIndex(r => r.roll === maxRoll);
  }
  
  const updatedRolls = currentRolls.map((r, i) => ({
    ...r,
    isWinner: i === winnerIndex
  }));

  const draftOrder: string[] = [];
  for (let i = 0; i < playerCount; i++) {
    const currentIndex = (winnerIndex + i) % playerCount;
    draftOrder.push(updatedRolls[currentIndex].player);
  }

  const placementOrder = [...draftOrder].reverse();

  return {
    rolls: updatedRolls,
    draftOrder,
    placementOrder
  };
};

// --- Job Mode Precedence Logic ---
export const determineJobMode = (activeStoryCard: StoryCardDef, overrides: StepOverrides): string => {
  const storyJobMode = activeStoryCard.setupConfig?.jobDrawMode;
  
  if (storyJobMode) return storyJobMode;
  if (overrides.browncoatJobMode) return 'no_jobs';
  if (overrides.timesJobMode) return 'times_jobs';
  if (overrides.allianceHighAlertJobMode) return 'high_alert_jobs';
  if (overrides.buttonsJobMode) return 'buttons_jobs';
  if (overrides.awfulJobMode) return 'awful_jobs';
  
  return 'standard';
};

// --- Credit Calculation Logic ---
export const calculateStartingResources = (activeStoryCard: StoryCardDef, overrides: StepOverrides) => {
  const bonusCredits = activeStoryCard.setupConfig?.startingCreditsBonus || 0;
  let totalCredits = overrides.startingCredits || 3000;
  
  // Handle explicit override from story card (e.g., Community Content)
  if (activeStoryCard.setupConfig?.startingCreditsOverride !== undefined) {
    totalCredits = activeStoryCard.setupConfig.startingCreditsOverride;
  } else {
    // Apply bonuses
    totalCredits += bonusCredits;
  }

  const noFuelParts = activeStoryCard.setupConfig?.noStartingFuelParts;
  const customFuel = activeStoryCard.setupConfig?.customStartingFuel;

  return { totalCredits, bonusCredits, noFuelParts, customFuel };
};

// --- Story Card Helpers ---
export const getStoryCardSetupSummary = (card: StoryCardDef): string | null => {
    if (card.setupDescription) return "Setup Changes";
    if (card.setupConfig?.jobDrawMode === 'no_jobs') return "No Starting Jobs";
    if (card.setupConfig?.jobDrawMode === 'caper_start') return "Starts with Caper";
    if (card.setupConfig?.shipPlacementMode === 'persephone') return "Starts at Persephone";
    return null;
};

// --- Setup Flow Logic ---

// Helper to inject a dynamic step safely
const createStep = (id: string, overrides: StepOverrides = {}): Step | null => {
  const content = SETUP_CONTENT[id];
  if (!content) return null;
  return {
    type: content.type === 'core' ? 'core' : 'dynamic',
    id: content.id || content.elementId || id,
    data: content,
    overrides
  };
};

export const calculateSetupFlow = (state: GameState): Step[] => {
  const newFlow: Step[] = [];
  const activeStory = STORY_CARDS.find(c => c.title === state.selectedStoryCard);
  const isFlyingSolo = state.setupCardId === 'FlyingSolo';

  // 1. Determine the Base Definition (The source of truth for steps)
  let baseDef = SETUP_CARDS.find(s => s.id === state.setupCardId);
  
  // In Flying Solo, the base definition steps come from the *Secondary* card (Board Setup),
  // but wrapped in the context of the Flying Solo rules.
  if (isFlyingSolo && state.secondarySetupId) {
      baseDef = SETUP_CARDS.find(s => s.id === state.secondarySetupId);
  }
  
  // Fallback
  if (!baseDef) baseDef = SETUP_CARDS[0];

  // 2. Iterate Steps
  // If Flying Solo, we actually iterate the Flying Solo steps first, 
  // but we merge overrides from the Secondary card.
  const sourceSteps = isFlyingSolo 
    ? (SETUP_CARDS.find(s => s.id === 'FlyingSolo')?.steps || [])
    : baseDef.steps;

  let noSureThingsInserted = false;

  sourceSteps.forEach(setupStep => {
      const stepId = setupStep.id;

      // Injection: No Sure Things (Before C6/Jobs or C_PRIME)
      const shouldInjectNST = state.soloOptions?.noSureThings && !noSureThingsInserted && (stepId === 'C6' || stepId === 'C_PRIME');
      
      // For Flying Solo, we allow it. For Classic Solo (Awful Lonely), we also allow it.
      const isSoloMode = state.gameMode === 'solo'; // Covers both Flying Solo and Classic
      
      if (isSoloMode && shouldInjectNST) {
          const step = createStep('D_NO_SURE_THINGS');
          if (step) {
             newFlow.push(step);
             noSureThingsInserted = true;
          }
      }

      // Calculate Overrides
      let finalOverrides = setupStep.overrides || {};
      
      // If Flying Solo, merge overrides from the secondary board setup
      if (isFlyingSolo && state.secondarySetupId) {
           const secondaryStep = baseDef?.steps.find(s => s.id === stepId);
           if (secondaryStep) {
               finalOverrides = { ...finalOverrides, ...secondaryStep.overrides };
           }
      }

      const step = createStep(stepId, finalOverrides);
      if (step) {
          newFlow.push(step);
      }
  });

  // Injection: Game Length Tokens (For Classic Solo / Awful Lonely)
  // Flying Solo handles this in its own step definition, so we only need to inject for classic.
  if (state.gameMode === 'solo' && !isFlyingSolo && activeStory?.setupConfig?.soloGameTimer) {
       const step = createStep('D_GAME_LENGTH_TOKENS');
       if (step) newFlow.push(step);
  }

  // Fallback: NST wasn't inserted due to weird step order
  if (state.gameMode === 'solo' && state.soloOptions?.noSureThings && !noSureThingsInserted) {
      const step = createStep('D_NO_SURE_THINGS');
      if (step) newFlow.push(step);
  }

  newFlow.push({ type: 'final', id: 'final' });
  return newFlow;
};

// --- Default State Factory ---
export const getDefaultGameState = (): GameState => {
  const initialExpansions = EXPANSIONS_METADATA.reduce((acc, expansion) => {
    acc[expansion.id] = true; // Default all to true so expansions are ON by default
    return acc;
  }, {} as Expansions);

  // Ensure default story is compatible with default multiplayer mode (Find first non-Solo story)
  const defaultStory = STORY_CARDS.find(s => !s.isSolo) || STORY_CARDS[0];

  return {
    gameEdition: 'tenth',
    gameMode: 'multiplayer',
    playerCount: 4,
    playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'],
    setupCardId: 'Standard',
    setupCardName: 'Standard Game Setup',
    selectedStoryCard: defaultStory.title,
    selectedGoal: defaultStory.goals?.[0]?.title,
    challengeOptions: {},
    timerConfig: {
        mode: 'standard', // Default to standard even if others are available
        unpredictableSelectedIndices: [0, 2, 4, 5], // Default indices corresponding to one 1, one 2, one 3, one 4 from [1,1,2,2,3,4]
        randomizeUnpredictable: false
    },
    soloOptions: {
        noSureThings: false,
        shesTrouble: false,
        recipeForUnpleasantness: false
    },
    expansions: initialExpansions
  };
};
