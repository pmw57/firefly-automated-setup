
import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const AllianceAlertStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock source="setupCard" title="Setup Card Override">
      <strong>Alliance Alert Cards:</strong>
      <div className="space-y-3 mt-1">
        <p>Begin the game with <strong>one random Alliance Alert Card</strong> in play.</p>
        <p className="text-sm italic">Each Alert has a rule that affects all players. When a Misbehave Card directs you to draw a new Alert Card, place the current Alert at the bottom of the Alert Deck.</p>
      </div>
    </SpecialRuleBlock>
  );
};
