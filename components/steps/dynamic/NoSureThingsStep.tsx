
import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const NoSureThingsStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock source="setupCard" title="No Sure Things In Life">
        <p className="mb-2"><strong>Remove 5 cards from play</strong> for <em>each</em> Supply and Contact Deck.</p>
        <p className="text-sm opacity-80">These cards are kept face down and cannot be accessed in any way during the game.</p>
    </SpecialRuleBlock>
  );
};
