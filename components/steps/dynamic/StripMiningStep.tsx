import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';
import { useGameState } from '../../../hooks/useGameState';

export const StripMiningStep = (): React.ReactElement => {
  const { state: gameState } = useGameState();
  return (
    <SpecialRuleBlock 
      source="setupCard" 
      title="The Dinosaur Draft"
      content={[
        { type: 'numbered-list', items: [
          ['Choose 1 Supply Deck to be "Strip Mined".'],
          ['The winner of the Ship Roll claims the ', { type: 'strong', content: 'Dinosaur' }, '.'],
          ['Reveal ', { type: 'strong', content: `${gameState.playerCount} cards` }, ' from the top of the chosen deck.'],
          ['Starting at the Dinosaur and going left, draft one card for free.'],
          ['Pass the Dinosaur to the left. Repeat until all players have been the Dinosaur once.']
        ]}
      ]}
    />
  );
};