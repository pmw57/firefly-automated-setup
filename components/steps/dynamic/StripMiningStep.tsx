
import React from 'react';
import { GameState, Step } from '../../../types';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

interface StripMiningStepProps {
  step: Step;
  gameState: GameState;
}

export const StripMiningStep: React.FC<StripMiningStepProps> = ({ gameState }) => {
  return (
    <SpecialRuleBlock source="setupCard" title="The Dinosaur Draft">
      <ol className="list-decimal ml-5 space-y-2 text-sm mt-1">
        <li>Choose 1 Supply Deck to be "Strip Mined".</li>
        <li>The winner of the Ship Roll claims the <strong>Dinosaur</strong>.</li>
        <li>Reveal <strong>{gameState.playerCount} cards</strong> from the top of the chosen deck.</li>
        <li>Starting at the Dinosaur and going left, draft one card for free.</li>
        <li>Pass the Dinosaur to the left. Repeat until all players have been the Dinosaur once.</li>
      </ol>
    </SpecialRuleBlock>
  );
};
