// FIX: Changed import from '../types' to '../types/index' to fix module resolution ambiguity.
import { DiceResult, DraftState } from '../types/index';

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

export const runAutomatedDraft = (playerNames: string[]): DraftState => {
  const initialRolls: DiceResult[] = playerNames.map((name, i) => ({
    player: name || `Captain ${i + 1}`,
    roll: Math.floor(Math.random() * 6) + 1,
  }));

  const logicRolls = initialRolls.map(r => r.roll);
  let candidates = initialRolls.map((_, i) => i);
  let winnerIndex = -1;

  while (winnerIndex === -1) {
    let currentMax = -1;
    candidates.forEach(i => {
      if (logicRolls[i] > currentMax) currentMax = logicRolls[i];
    });

    const tiedCandidates = candidates.filter(i => logicRolls[i] === currentMax);

    if (tiedCandidates.length === 1) {
      winnerIndex = tiedCandidates[0];
    } else {
      candidates = tiedCandidates;
      candidates.forEach(i => {
        logicRolls[i] = Math.floor(Math.random() * 6) + 1;
      });
    }
  }

  return calculateDraftOutcome(initialRolls, playerNames.length, winnerIndex);
};

export const getInitialSoloDraftState = (playerName: string): DraftState => {
    const finalPlayerName = playerName || 'Captain 1';
    const soloRoll: DiceResult[] = [{
        player: finalPlayerName,
        roll: 6,
        isWinner: true
    }];
    return {
        rolls: soloRoll,
        draftOrder: [finalPlayerName],
        placementOrder: [finalPlayerName]
    };
};