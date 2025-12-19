import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const AllianceAlertStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock 
      source="setupCard" 
      title="Setup Card Override"
      content={[
        { type: 'strong', content: 'Alliance Alert Cards:' },
        { type: 'paragraph', content: ['Begin the game with ', { type: 'strong', content: 'one random Alliance Alert Card' }, ' in play.'] },
        { type: 'paragraph', content: ["Each Alert has a rule that affects all players. When a Misbehave Card directs you to draw a new Alert Card, place the current Alert at the bottom of the Alert Deck."] }
      ]}
    />
  );
};