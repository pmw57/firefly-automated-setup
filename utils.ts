
import { GameState, StoryCardDef, StepOverrides, DiceResult, DraftState } from './types';

// --- Draft Logic ---
export const calculateDraftOutcome = (currentRolls: DiceResult[], playerCount: number): DraftState => {
  const maxRoll = Math.max(...currentRolls.map(r => r.roll));
  const winnerIndex = currentRolls.findIndex(r => r.roll === maxRoll);
  
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
  if (overrides.rimJobMode) return 'rim_jobs';
  if (overrides.browncoatJobMode) return 'no_jobs';
  if (overrides.timesJobMode) return 'times_jobs';
  if (overrides.allianceHighAlertJobMode) return 'high_alert_jobs';
  if (overrides.buttonsJobMode) return 'buttons_jobs';
  if (overrides.awfulJobMode) return 'awful_jobs';
  
  return 'standard';
};

// --- Credit Calculation Logic ---
export const calculateStartingResources = (activeStoryCard: StoryCardDef, overrides: StepOverrides) => {
  let totalCredits = overrides.startingCredits || 3000;
  
  // Handle explicit override from story card (e.g., Community Content)
  if (activeStoryCard.setupConfig?.startingCreditsOverride !== undefined) {
    totalCredits = activeStoryCard.setupConfig.startingCreditsOverride;
  } else {
    // Apply bonuses
    const bonusCredits = activeStoryCard.setupConfig?.startingCreditsBonus || 0;
    totalCredits += bonusCredits;
  }

  const bonusCredits = activeStoryCard.setupConfig?.startingCreditsBonus || 0;
  const noFuelParts = activeStoryCard.setupConfig?.noStartingFuelParts;
  
  const customFuel = activeStoryCard.setupConfig?.customStartingFuel;

  return { totalCredits, bonusCredits, noFuelParts, customFuel };
};