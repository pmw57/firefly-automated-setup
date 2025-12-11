import React from 'react';
import { GameState, Step } from '../types';
import { STORY_CARDS } from '../constants';

interface PrimePumpStepProps {
  step: Step;
  gameState: GameState;
}

export const PrimePumpStep: React.FC<PrimePumpStepProps> = ({ step, gameState }) => {
  const overrides = step.overrides || {};
  const activeStoryCard = STORY_CARDS.find(c => c.title === gameState.selectedStoryCard) || STORY_CARDS[0];
  
  const multiplier = activeStoryCard.setupConfig?.primingMultiplier || 1;
  const isBlitz = overrides.blitzPrimeMode;

  // Base Discard Count Logic
  let baseDiscard = 3;
  if (gameState.expansions.blue || gameState.expansions.kalidasa || gameState.expansions.pirates) {
    baseDiscard = 4;
  }

  // Blitz Override ("Double Dip" logic is roughly x2 but explicitly "top 6")
  let finalCount = baseDiscard * multiplier;
  let title = "Priming The Pump";

  if (isBlitz) {
    title = "Priming The Pump: Double Dip";
    finalCount = 6;
  }

  return (
    <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm text-center">
      <h4 className="font-bold text-xl text-gray-800 font-western mb-4">{title}</h4>
      <div className="text-5xl font-bold text-gray-300 mb-4">🃏</div>
      <p className="text-lg text-gray-700">
        Shuffle all Supply Decks.
      </p>
      <div className="my-6 bg-green-50 p-4 rounded-lg inline-block border border-green-200">
        <span className="block text-4xl font-bold text-green-700 mb-1">{finalCount}</span>
        <span className="text-sm font-bold text-green-800 uppercase tracking-wide">Cards Discarded</span>
      </div>
      <p className="text-sm text-gray-500 italic">
        (From the top of each Supply Deck)
      </p>
    </div>
  );
};