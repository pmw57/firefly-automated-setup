

import { StoryCardDef, StepOverrides, DiceResult, DraftState, GameState, Expansions, Step } from './types';
import { SETUP_CARDS } from './data/setupCards';
import { SETUP_CONTENT } from './data/steps';
import { STORY_CARDS } from './data/storyCards';
import { EXPANSIONS_METADATA } from './data/expansions';
import { STEP_IDS, SETUP_CARD_IDS } from './data/ids';

// --- Draft Logic ---

const findWinnerIndex = (rolls: DiceResult[], overrideWinnerIndex?: number): number => {
    if (overrideWinnerIndex !== undefined && overrideWinnerIndex !== -1) {
        return overrideWinnerIndex;
    }
    const maxRoll = Math.max(...rolls.map(r => r.roll));
    return rolls.findIndex(r => r.roll === maxRoll);
};

const markWinner = (rolls: DiceResult[], winnerIndex: number): DiceResult[] => {
    return rolls.map((r, i) => ({ ...r, isWinner: i === winnerIndex }));
};

const generateDraftOrder = (rolls: DiceResult[], winnerIndex: number, playerCount: number): string[] => {
    const draftOrder: string[] = [];
    for (let i = 0; i < playerCount; i++) {
        const currentIndex = (winnerIndex + i) % playerCount;
        draftOrder.push(rolls[currentIndex].player);
    }
    return draftOrder;
};

export const calculateDraftOutcome = (
  currentRolls: DiceResult[], 
  playerCount: number,
  overrideWinnerIndex?: number
): DraftState => {
  const winnerIndex = findWinnerIndex(currentRolls, overrideWinnerIndex);
  const rollsWithWinner = markWinner(currentRolls, winnerIndex);
  const draftOrder = generateDraftOrder(rollsWithWinner, winnerIndex, playerCount);
  const placementOrder = [...draftOrder].reverse();

  return {
    rolls: rollsWithWinner,
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
    if (state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO && state.secondarySetupId) {
        const secondary = SETUP_CARDS.find(s => s.id === state.secondarySetupId);
        if (secondary) return `Flying Solo + ${secondary.label}`;
    }
    return state.setupCardName;
};


// --- Setup Flow Logic ---

// Helper to create a step object from its definition
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

// FIX: Replaced incomplete getInitialSetupSteps with a full implementation for the setup flow.
// This function was not exported, causing an error in SetupWizard.tsx, and it was incomplete, causing a return type error.
export const calculateSetupFlow = (state: GameState): Step[] => {
  const flow: Step[] = [];

  // Part 1: Initial configuration steps that are always present.
  flow.push({ type: 'setup', id: STEP_IDS.SETUP_CAPTAIN_EXPANSIONS });
  flow.push({ type: 'setup', id: STEP_IDS.SETUP_CARD_SELECTION });
  
  const isFlyingSolo = state.setupCardId === SETUP_CARD_IDS.FLYING_SOLO;
  const has10th = state.expansions.tenth;

  // Part 2: Optional Rules step, conditional on 10th Anniversary expansion or Flying Solo mode.
  if (isFlyingSolo || has10th) {
    flow.push({ type: 'setup', id: STEP_IDS.SETUP_OPTIONAL_RULES });
  }

  // Part 3: Core game setup steps, derived from the selected Setup Card.
  // The secondarySetupId (for Flying Solo) is used within steps to alter board state,
  // but the primary setupCardId determines the overall sequence of steps.
  const setupCard = SETUP_CARDS.find(s => s.id === state.setupCardId) || SETUP_CARDS.find(s => s.id === SETUP_CARD_IDS.STANDARD)!;

  setupCard.steps.forEach(stepDef => {
    const step = createStep(stepDef.id, stepDef.overrides);
    if (step) {
      flow.push(step);
    }
  });
  
  // Part 4: Final summary step.
  flow.push({ type: 'final', id: STEP_IDS.FINAL });

  return flow;
};

// FIX: Added missing getDefaultGameState function, which is required by GameStateContext.tsx.
export const getDefaultGameState = (): GameState => {
    const allExpansions = EXPANSIONS_METADATA.reduce((acc, exp) => {
        if (exp.id !== 'base') {
            (acc as Record<keyof Expansions, boolean>)[exp.id] = false;
        }
        return acc;
    }, {} as Expansions);

    const firstStory = STORY_CARDS.find(c => !c.isSolo && c.requiredExpansion !== 'community') || STORY_CARDS[0];

    return {
        gameEdition: 'original',
        gameMode: 'multiplayer',
        playerCount: 4,
        playerNames: ['Captain 1', 'Captain 2', 'Captain 3', 'Captain 4'],
        setupCardId: SETUP_CARD_IDS.STANDARD,
        setupCardName: 'Standard Game Setup',
        secondarySetupId: undefined,
        selectedStoryCard: firstStory.title,
        selectedGoal: firstStory.goals?.[0]?.title,
        challengeOptions: {},
        timerConfig: {
            mode: 'standard',
            unpredictableSelectedIndices: [0, 2, 4, 5], // Default to 1, 2, 3, 4
            randomizeUnpredictable: false,
        },
        soloOptions: {
            noSureThings: false,
            shesTrouble: false,
            recipeForUnpleasantness: false,
        },
        optionalRules: {
            disgruntledDie: 'standard',
            optionalShipUpgrades: false,
        },
        expansions: allExpansions,
        isCampaign: false,
        campaignStoriesCompleted: 0,
    };
};