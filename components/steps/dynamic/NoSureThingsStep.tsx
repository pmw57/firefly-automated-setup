
import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const NoSureThingsStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock 
      source="setupCard" 
      title="No Sure Things In Life"
      content={[
        { type: 'paragraph', content: [{ type: 'strong', content: "Remove 5 cards from play" }, " for ", { type: 'strong', content: 'each' }, " Supply and Contact Deck."] },
        { type: 'paragraph', content: ["These cards are kept face down and cannot be accessed in any way during the game."] }
      ]}
    />
  );
};
