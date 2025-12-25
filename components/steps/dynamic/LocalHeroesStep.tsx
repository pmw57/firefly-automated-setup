import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const LocalHeroesStep = (): React.ReactElement => {
  return (
    <SpecialRuleBlock 
      source="setupCard" 
      title="Setup Card Override"
      content={[
        { type: 'strong', content: 'Local Heroes Bonuses:' },
        { type: 'list', items: [
          [{ type: 'strong', content: 'Shore Leave:' }, ' At your Haven, you may use a Buy Action to take Shore Leave for free. Remove all Disgruntled and Wanted tokens.'],
          [{ type: 'strong', content: 'Home Field Advantage:' }, " When you proceed while Misbehaving in the same System as your Haven, take ", { type: 'strong', content: '$100' }, "."]
        ]}
      ]}
    />
  );
};