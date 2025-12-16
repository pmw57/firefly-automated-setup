
import React from 'react';
import { SpecialRuleBlock } from '../../SpecialRuleBlock';

export const LocalHeroesStep: React.FC = () => {
  return (
    <SpecialRuleBlock source="setupCard" title="Setup Card Override">
      <strong>Local Heroes Bonuses:</strong>
      <ul className="list-disc ml-5 space-y-2 mt-1">
        <li><strong>Shore Leave:</strong> At your Haven, you may use a Buy Action to take Shore Leave for free. Remove all Disgruntled and Wanted tokens.</li>
        <li><strong>Home Field Advantage:</strong> When you proceed with Misbehaving in the same System as your Haven, take <strong>$100</strong>.</li>
      </ul>
    </SpecialRuleBlock>
  );
};
