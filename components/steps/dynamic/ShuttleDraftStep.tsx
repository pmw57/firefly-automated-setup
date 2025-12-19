import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const ShuttleDraftStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock 
      source="setupCard" 
      title="Setup Card Override"
      content={[
        { type: 'strong', content: 'Draft Shuttles from Supply:' },
        { type: 'numbered-list', items: [
          ["Pull all ", { type: 'strong', content: 'Shuttles' }, " from the Supply Decks."],
          ["Starting with the winner of the Ship Roll, each player takes ", { type: 'strong', content: '1 Shuttle' }, " for free."],
          ["Selection passes to the ", { type: 'strong', content: 'left' }, "."],
          ["Place remaining Shuttles in their respective discard piles."]
        ]}
      ]}
    />
  );
};