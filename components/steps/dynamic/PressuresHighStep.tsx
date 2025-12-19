import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const PressuresHighStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock 
      source="setupCard" 
      title="The Pressure's High"
      content={[
        { type: 'paragraph', content: [{ type: 'strong', content: 'Alliance Alert:' }, ' Begin the game with one random Alliance Alert Card in play.'] },
        { type: 'paragraph', content: [{ type: 'strong', content: 'Wanted Accumulation:' }] },
        { type: 'list', items: [
          ["Wanted Crew and Leaders may accumulate Wanted tokens."],
          [{ type: 'strong', content: 'Roll Check:' }, ' When making Alliance Wanted Crew rolls, you must roll higher than the number of current Wanted tokens for that Crew/Leader to avoid effects.']
        ]}
      ]}
    />
  );
};