
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

// --- UI Helpers ---
export const getDisplaySetupName = (state: GameState): string => {
    if (state.setupCardId === 'FlyingSolo' && state.secondarySetupId) {
        const secondary = SETUP_CARDS.find(s => s.id === state.secondarySetupId);
        if (secondary) return `Flying Solo + ${secondary.label}`;
    }
    return state.setupCardName;
};


// --- Setup Flow Logic ---

// Helper to inject a dynamic step safely
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

export const calculateSetupFlow = (state: GameState): Step[] => {
  const newFlow: Step[] = [];

  // 0. Prepend initial setup steps
  newFlow.push({ type: 'setup', id: 'setup-1' });
  newFlow.push({ type: 'setup', id: 'setup-2' });

  const isFlyingSolo = state.setupCardId === 'FlyingSolo';
  const has10th = state.expansions.tenth;
  if (isFlyingSolo || has10th) {
    newFlow.push({ type: 'setup', id: 'setup-3' });
  }
  
  const activeStory = STORY_CARDS.find(c => c.title === state.selectedStoryCard);
  const isSoloMode = state.gameMode === 'solo';

  // 1. Determine the definition that dictates the setup *structure*.
  // For Flying Solo, it's the secondary card. Otherwise, the main one.
  const structuralDefId = isFlyingSolo ? state.secondarySetupId : state.setupCardId;
  let structuralDef = SETUP_CARDS.find(s => s.id === structuralDefId);
  if (!structuralDef) structuralDef = SETUP_CARDS.find(s => s.id === 'Standard');
  if (!structuralDef) return []; // Should not happen

  const sourceSteps = structuralDef.steps;
  
  let noSureThingsInserted = false;

  // 2. Iterate through the structural steps and build the main flow.
  sourceSteps.forEach(setupStep => {
    const stepId = setupStep.id;

    // Injection: No Sure Things (Optional Solo Rule) - must happen inside the loop to get position right.
    if (isSoloMode && state.soloOptions?.noSureThings && !noSureThingsInserted && (stepId === 'C6' || stepId === 'C_PRIME')) {
      const step = createStep('D_NO_SURE_THINGS');
      if (step) {
        newFlow.push(step);
        noSureThingsInserted = true;
      }
    }
    
    // Merge overrides: start with the structural card's overrides.
    let finalOverrides = setupStep.overrides || {};
    
    // If Flying Solo, layer its specific overrides on top.
    if (isFlyingSolo) {
      const flyingSoloDef = SETUP_CARDS.find(s => s.id === 'FlyingSolo')!;
      const flyingSoloStepOverride = flyingSoloDef.steps.find(s => s.id === stepId);
      if (flyingSoloStepOverride) {
        finalOverrides = { ...finalOverrides, ...flyingSoloStepOverride.overrides };
      }
    }

    const step = createStep(stepId, finalOverrides);
    if (step) {
      newFlow.push(step);
    }
  });
  
  // 3. Post-loop injections for solo mode
  if (isSoloMode) {
    // Fallback for No Sure Things if it wasn't placed in the loop
    if (state.soloOptions?.noSureThings && !noSureThingsInserted) {
      const step = createStep('D_NO_SURE_THINGS');
      if (step) newFlow.push(step);
    }

    // Add Game Length Tokens step for any solo mode that uses a timer
    const isClassicSoloWithTimer = !isFlyingSolo && activeStory?.setupConfig?.soloGameTimer;
    if ((isFlyingSolo || isClassicSoloWithTimer) && !activeStory?.setupConfig?.disableSoloTimer) {
      if (!newFlow.some(s => s.id === 'D_GAME_LENGTH_TOKENS')) {
        const step = createStep('D_GAME_LENGTH_TOKENS');
        if (step) newFlow.push(step);
      }
    }
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
    optionalRules: {
        disgruntledDie: 'standard',
        optionalShipUpgrades: true
    },
    expansions: initialExpansions,
    isCampaign: false,
    campaignStoriesCompleted: 0
  };
};