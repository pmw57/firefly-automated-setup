
import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const ShuttleDraftStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock source="setupCard" title="Setup Card Override">
      <strong>Draft Shuttles from Supply:</strong>
      <ul className="list-decimal ml-5 space-y-2 mt-1">
        <li>Pull all <strong>Shuttles</strong> from the Supply Decks.</li>
        <li>Starting with the winner of the Ship Roll, each player takes <strong>1 Shuttle</strong> for free.</li>
        <li>Selection passes to the <strong>left</strong>.</li>
        <li>Place remaining Shuttles in their respective discard piles.</li>
      </ul>
    </SpecialRuleBlock>
  );
};
